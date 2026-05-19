"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Coins,
  Eye,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  Users,
  XCircle,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchCompanyDashboard, unlockCandidateContact } from "@/lib/cv-api";
import type {
  CompanyDashboardResponse,
  CandidateProcess,
} from "@/lib/cv-types";

export default function CompanyDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [isFetching, setIsFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [dashboard, setDashboard] = useState<CompanyDashboardResponse | null>(
    null
  );
  const [candidates, setCandidates] = useState<CandidateProcess[]>([]);

  useEffect(() => {
    if (!isLoading && user?.role === "COMPANY") {
      fetchCompanyDashboard()
        .then((data) => {
          setDashboard(data);
          setCandidates(data.candidates);
        })
        .catch(console.error)
        .finally(() => setIsFetching(false));
    }
  }, [isLoading, user]);

  const stats = dashboard?.stats;

  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
  
      const fullName =
        `${candidate.firstName ?? ""} ${candidate.lastName ?? ""}`
          .toLowerCase()
  
      const position =
        candidate.position?.toLowerCase() ?? ""
  
      const country =
        candidate.country?.toLowerCase() ?? ""
  
      const searchValue = search.toLowerCase()
  
      const searchOk =
        fullName.includes(searchValue) ||
        position.includes(searchValue) ||
        country.includes(searchValue)
  
      const statusOk =
        statusFilter === "ALL" ||
        candidate.status === statusFilter
  
      return searchOk && statusOk
    })
  }, [candidates, search, statusFilter])

  const unlockContact = async (candidateId: string) => {
    try {
      await unlockCandidateContact(candidateId);

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.workerId === candidateId
            ? {
                ...candidate,
                status: "CONTACT_UNLOCKED",
                contactUnlocked: true,
              }
            : candidate
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SENT":
        return <Badge variant="secondary">Sent</Badge>;

      case "VIEWED":
        return <Badge variant="outline">Viewed</Badge>;

      case "INTERESTED":
        return (
          <Badge className="bg-green-600 text-white hover:bg-green-600">
            Interested
          </Badge>
        );

      case "CONTACT_UNLOCKED":
        return (
          <Badge className="bg-blue-600 text-white hover:bg-blue-600">
            Contact Unlocked
          </Badge>
        );

      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;

      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading || !user || user.role !== "COMPANY" || isFetching) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Hiring Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage candidates, offers and hiring pipeline
              </p>
            </div>

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

                <div className="flex flex-col items-end gap-2">
                  <Coins className="size-8 text-primary" />

                  <Button size="sm">Buy Tokens</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Candidates
                    </p>
                    <p className="text-3xl font-bold mt-1">
                      {stats?.totalCandidates ?? 0}
                    </p>
                  </div>
                  <Users className="size-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Awaiting Response
                    </p>
                    <p className="text-3xl font-bold mt-1 text-blue-600">
                      {stats?.awaitingResponse}
                    </p>
                  </div>
                  <Clock3 className="size-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Interested</p>
                    <p className="text-3xl font-bold mt-1 text-green-600">
                      {stats?.interested}
                    </p>
                  </div>
                  <CheckCircle2 className="size-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Unlocked Contacts
                    </p>
                    <p className="text-3xl font-bold mt-1 text-primary">
                      {stats?.contactUnlocked}
                    </p>
                  </div>
                  <Phone className="size-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <p className="text-3xl font-bold mt-1 text-red-600">
                      {stats?.rejected}
                    </p>
                  </div>
                  <XCircle className="size-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-sm">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    placeholder="Search candidates..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                    <TabsList>
                      <TabsTrigger value="ALL">All</TabsTrigger>
                      <TabsTrigger value="INTERESTED">Interested</TabsTrigger>
                      <TabsTrigger value="VIEWED">Viewed</TabsTrigger>
                      <TabsTrigger value="CONTACT_UNLOCKED">
                        Unlocked
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="activity">Recent Activity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidates */}
          {filteredCandidates.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Briefcase className="mx-auto mb-4 size-10 text-muted-foreground" />
                <p className="text-muted-foreground">No candidates found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredCandidates.map((candidate) => (
                <Card
                  key={candidate.workerId}
                  className="transition-all hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                      {/* Left */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div>
                            <h3 className="text-xl font-semibold">
                              {candidate.firstName} {candidate.lastName}
                            </h3>

                            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="size-4" />
                              {candidate.country}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 sm:ml-4">
                            {candidate.hasWorkPermit && (
                              <Badge
                                variant="outline"
                                className="border-green-200 bg-green-50 text-green-700"
                              >
                                <ShieldCheck className="mr-1 size-3" />
                                Work Permit
                              </Badge>
                            )}

                            {candidate.inAnotherProcess && (
                              <Badge
                                variant="outline"
                                className="border-yellow-200 bg-yellow-50 text-yellow-700"
                              >
                                In Hiring Process
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="font-medium">{candidate.position}</p>

                          <p className="text-sm text-muted-foreground">
                            {candidate.industry}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {getStatusBadge(candidate.status)}

                          <Badge variant="secondary">
                            €{candidate.salaryAmount}
                          </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          Offer sent{" "}
                          {new Date(candidate.sentAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Right */}
                      <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:w-[220px]">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedCandidate(candidate)}
                        >
                          <Eye className="mr-2 size-4" />
                          View Details
                        </Button>

                        {!candidate.contactUnlocked &&
                          candidate.status === "INTERESTED" && (
                            <Button onClick={() => unlockContact(candidate.workerId)}>
                              <Coins className="mr-2 size-4" />
                              Unlock Contact
                            </Button>
                          )}

                        {candidate.contactUnlocked && (
                          <>
                            <Button>
                              <Phone className="mr-2 size-4" />
                              Call Candidate
                            </Button>

                            <Button variant="outline">
                              <Mail className="mr-2 size-4" />
                              Send Email
                            </Button>
                          </>
                        )}

                        <Button
                          variant="ghost"
                          onClick={() =>
                            router.push(`/profiles/${candidate.workerId}`)
                          }
                        >
                          Open Full Profile
                          <ArrowUpRight className="ml-2 size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Candidate Modal */}
      <Dialog
        open={!!selectedCandidate}
        onOpenChange={() => setSelectedCandidate(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedCandidate && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedCandidate.firstName} {selectedCandidate.lastName}
                </DialogTitle>

                <DialogDescription>
                  Candidate overview and recruitment status
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Position</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="font-medium">
                        {selectedCandidate.position}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {selectedCandidate.industry}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Experience</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="font-medium">
                        {selectedCandidate.experience}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Languages</CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-wrap gap-2">
                    {selectedCandidate.languages?.map((lang: string) => (
                      <Badge key={lang} variant="secondary">
                        {lang}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Contact Information
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {selectedCandidate.contactUnlocked ? (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">
                            {selectedCandidate.phone}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">
                            {selectedCandidate.email}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-lg border border-dashed p-4">
                        <p className="font-medium">Contact details locked</p>

                        <p className="text-sm text-muted-foreground mt-1">
                          Spend 1 token to unlock candidate contact details.
                        </p>

                        <Button
                          className="mt-4"
                          onClick={() => {
                            unlockContact(selectedCandidate.workerId);
                            setSelectedCandidate({
                              ...selectedCandidate,
                              contactUnlocked: true,
                              status: "CONTACT_UNLOCKED",
                            });
                          }}
                        >
                          <Coins className="mr-2 size-4" />
                          Unlock Contact
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
