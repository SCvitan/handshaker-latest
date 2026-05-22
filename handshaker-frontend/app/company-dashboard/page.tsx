"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Coins,
  Loader2,
  Users,
  CheckCircle2,
  Clock3,
  Phone,
  SendHorizonal,
  Eye,
  ArrowUpRight,
  XCircle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  fetchCompanyDashboard,
  unlockCandidateContact,
  getFavorites,
  getUserProfileById,
  fetchCompanyJobs,
  sendJobOffer,
} from "@/lib/cv-api";

import type {
  CompanyDashboardResponse,
  CandidateProcess,
  ProfileSummary,
  UserProfile,
  JobAd,
} from "@/lib/cv-types";

import { ProfileDetailSheet } from "@/components/search-profiles/profile-detail-sheet";

export default function CompanyDashboardPage() {
  const { user, isLoading } = useAuth();

  const [isFetching, setIsFetching] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dashboardTab, setDashboardTab] = useState("pipeline");

  const [dashboard, setDashboard] = useState<CompanyDashboardResponse | null>(
    null
  );

  const [candidates, setCandidates] = useState<CandidateProcess[]>([]);
  const [savedCandidates, setSavedCandidates] = useState<ProfileSummary[]>([]);

  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [jobs, setJobs] = useState<JobAd[]>([]);

  const [offerModalOpen, setOfferModalOpen] = useState(false);

  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const [isSendingOffer, setIsSendingOffer] = useState(false);

  // PROFILE SHEET STATE
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(
    null
  );
  const [profileCache, setProfileCache] = useState<Record<string, UserProfile>>(
    {}
  );

  const getProfileId = (c: { id?: string; workerId?: string }) =>
    c.workerId ?? c.id!;

  // LOAD DATA
  useEffect(() => {
    if (!isLoading && user?.role === "COMPANY") {
      Promise.all([fetchCompanyDashboard(), getFavorites(), fetchCompanyJobs()])
        .then(([dash, favs, jobsData]) => {
          setDashboard(dash);
          setCandidates(dash.candidates);
          setSavedCandidates(favs);
          setJobs(jobsData);
        })
        .finally(() => setIsFetching(false));
    }
  }, [isLoading, user]);

  const stats = dashboard?.stats;

  // PROFILE OPEN (CACHE + FETCH)
  const openProfile = async (id: string) => {
    try {
      setIsProfileLoading(true);

      // cache hit → instant open
      const cached = profileCache[id];
      if (cached) {
        setSelectedProfile(cached);
        setIsOpen(true);
        return;
      }

      const profile = await getUserProfileById(id);

      setProfileCache((prev) => ({
        ...prev,
        [id]: profile,
      }));

      setSelectedProfile(profile);
      setIsOpen(true);
    } finally {
      setIsProfileLoading(false);
    }
  };

  // FILTER PIPELINE
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const name = `${c.firstName ?? ""} ${c.lastName ?? ""}`.toLowerCase();
      const searchOk =
        name.includes(search.toLowerCase()) ||
        (c.position ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (c.country ?? "").toLowerCase().includes(search.toLowerCase());

      const statusOk = statusFilter === "ALL" || c.status === statusFilter;

      return searchOk && statusOk;
    });
  }, [candidates, search, statusFilter]);

  // FILTER SAVED
  const filteredSavedCandidates = useMemo(() => {
    return savedCandidates.filter((c) => {
      const name = `${c.firstName} ${c.lastName}`.toLowerCase();
      const searchValue = search.toLowerCase();

      return (
        name.includes(searchValue) ||
        (c.profession ?? "").toLowerCase().includes(searchValue)
      );
    });
  }, [savedCandidates, search]);

  const unlockContact = async (offerId: string) => {
    try {
      await unlockCandidateContact(offerId);

      setCandidates((prev) =>
        prev.map((c) =>
          c.processId === offerId
            ? { ...c, status: "CONTACT_UNLOCKED", contactUnlocked: true }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const openSendOfferModal = (workerId: string) => {
    setSelectedWorkerId(workerId);
    setSelectedJobId("");
    setOfferModalOpen(true);
  };

  const handleSendOffer = async () => {
    if (!selectedWorkerId || !selectedJobId) return;

    try {
      setIsSendingOffer(true);

      await sendJobOffer({
        workerId: selectedWorkerId,
        jobAdId: selectedJobId,
      });

      setOfferModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingOffer(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SENT":
        return <Badge variant="secondary">Sent</Badge>;
      case "VIEWED":
        return <Badge variant="outline">Viewed</Badge>;
      case "INTERESTED":
        return <Badge className="bg-green-600 text-white">Interested</Badge>;
      case "CONTACT_UNLOCKED":
        return (
          <Badge className="bg-blue-600 text-white">Contact Unlocked</Badge>
        );
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading || !user || isFetching) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* TOP METRICS */}
        <div className="space-y-4">
          {/* Tokens */}
          <div className="flex justify-end">
            <Card className="w-full lg:w-[320px] border-primary/20 bg-primary/5">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Available Tokens
                  </p>
                  <p className="text-3xl font-bold">
                    {dashboard?.tokensRemaining ?? 0}
                  </p>
                </div>

                <Coins className="size-8 text-primary" />
              </CardContent>
            </Card>
          </div>

          {/* Stats grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">
                    {stats?.totalCandidates ?? 0}
                  </p>
                </div>
                <Users className="size-6 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Awaiting</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats?.awaitingResponse}
                  </p>
                </div>
                <Clock3 className="size-6 text-blue-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Interested</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats?.interested}
                  </p>
                </div>
                <CheckCircle2 className="size-6 text-green-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unlocked</p>
                  <p className="text-2xl font-bold text-primary">
                    {stats?.contactUnlocked}
                  </p>
                </div>
                <Phone className="size-6 text-primary" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats?.rejected}
                  </p>
                </div>
                <XCircle className="size-6 text-red-600" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* TABS */}
        <Card>
          <CardContent className="p-4 flex justify-between">
            <Tabs value={dashboardTab} onValueChange={setDashboardTab}>
              <TabsList>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
              </TabsList>
            </Tabs>

            <Input
              className="max-w-sm"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* PIPELINE */}
        {dashboardTab === "pipeline" && (
          <div className="grid gap-4">
            {filteredCandidates.map((c) => (
              <Card key={c.workerId}>
                <CardContent className="p-6 flex justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {c.firstName} {c.lastName}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {c.position}
                    </p>

                    <div className="flex gap-2 mt-2">
                      {getStatusBadge(c.status)}
                      <Badge>€{c.salaryAmount}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={() => openProfile(getProfileId(c))}
                    >
                      <Eye className="size-4 mr-2" />
                      View
                    </Button>

                    {!c.contactUnlocked && c.status === "INTERESTED" && (
                      <Button onClick={() => unlockContact(c.processId)}>
                        Unlock
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* SAVED */}
        {dashboardTab === "saved" && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredSavedCandidates.map((c) => (
              <Card key={c.id}>
                <CardContent className="p-5 space-y-3">
                  <div>
                    <h3 className="font-semibold">
                      {c.firstName} {c.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {c.profession}
                    </p>
                  </div>

                  <Button onClick={() => openSendOfferModal(c.id)}>
                    <SendHorizonal className="size-4 mr-2" />
                    Send Offer
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => openProfile(getProfileId(c))}
                  >
                    Open Profile
                    <ArrowUpRight className="size-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* SINGLE SHARED SHEET */}
      <ProfileDetailSheet
        profile={selectedProfile}
        open={isOpen}
        onOpenChange={setIsOpen}
      />

      <Dialog open={offerModalOpen} onOpenChange={setOfferModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Job Offer</DialogTitle>

            <DialogDescription>
              Select which job offer you want to send to this candidate.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a job offer" />
              </SelectTrigger>

              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    <div className="flex flex-col">
                      <span>{job.position}</span>

                      <span className="text-xs text-muted-foreground">
                        {job.location.city}, €{job.salaryAmount}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              className="w-full"
              disabled={!selectedJobId || isSendingOffer}
              onClick={handleSendOffer}
            >
              {isSendingOffer ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <SendHorizonal className="mr-2 size-4" />
              )}
              Send Offer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
