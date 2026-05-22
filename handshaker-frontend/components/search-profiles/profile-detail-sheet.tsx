"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  User,
  Shield,
  Briefcase,
  Languages,
  Building,
  HardHat,
  Clock,
  Loader2,
  Save,
  SendHorizonal,
  Lock,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { UserProfile } from "@/lib/cv-types";
import { addToFavorites, removeFromFavorites } from "@/lib/cv-api";

interface ProfileDetailSheetProps {
  profile: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFavorite?: boolean;
  onFavoriteChange?: () => void;

  // future states
  hasUnlockedContact?: boolean;
  hasPendingOffer?: boolean;
}

function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  const m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}

function formatDate(d: string | null) {
  if (!d) return "-";

  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatEnum(value?: string | null) {
  if (!value) return "-";

  return (
    value.replace(/_/g, " ").charAt(0) +
    value.replace(/_/g, " ").slice(1).toLowerCase()
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>

      <span className="text-right font-medium text-foreground">
        {value || "-"}
      </span>
    </div>
  );
}

export function ProfileDetailSheet({
  profile,
  open,
  onOpenChange,
  isFavorite = false,
  onFavoriteChange,
  hasUnlockedContact = false,
  hasPendingOffer = false,
}: ProfileDetailSheetProps) {
  const [isToggling, setIsToggling] = useState(false);

  if (!profile) return null;

  const {
    personalInfo,
    legalStatus,
    jobPreferences,
    languages,
    accommodation,
    education,
    workExperiences,
  } = profile;

  const handleToggleFavorite = async () => {
    setIsToggling(true);

    try {
      if (isFavorite) {
        await removeFromFavorites(profile.id);
      } else {
        await addToFavorites(profile.id);
      }

      onFavoriteChange?.();
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setIsToggling(false);
    }
  };

  const completion = Math.round((profile.profileCompletion || 0) * 100);

  const age = personalInfo.dateOfBirth
    ? calculateAge(personalInfo.dateOfBirth)
    : null;

  const initials =
    personalInfo.firstName && personalInfo.lastName
      ? `${personalInfo.firstName[0]}${personalInfo.lastName[0]}`.toUpperCase()
      : "?";

  // future field
  const availabilityStatus = "AVAILABLE_NOW";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-l bg-background sm:max-w-2xl">
        {/* Sticky action bar */}
        <div className="sticky top-0 z-30 -mx-6 mb-6 border-b bg-background/95 px-6 py-4 backdrop-blur">
          <div className="flex flex-col gap-4">
            <SheetHeader className="space-y-0">
              <div className="flex items-start gap-4">
                <Avatar className="size-16 shrink-0 border">
                  <AvatarImage
                    src={profile.profileImageUrl ?? undefined}
                    alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                  />

                  <AvatarFallback className="text-lg font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <SheetTitle className="text-2xl">
                      {personalInfo.firstName} {personalInfo.lastName}
                    </SheetTitle>

                    <Badge
                      variant="secondary"
                      className="border-green-200 bg-green-50 text-green-700"
                    >
                      <CheckCircle2 className="mr-1 size-3.5" />
                      Available now
                    </Badge>

                    {legalStatus.hasCroatianWorkPermit && (
                      <Badge variant="outline">
                        <Shield className="mr-1 size-3" />
                        Work Permit
                      </Badge>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {jobPreferences.desiredPosition && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="size-3.5" />
                        {jobPreferences.desiredPosition}
                      </div>
                    )}

                    {accommodation?.address?.city && (
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {accommodation.address.city}
                      </div>
                    )}

                    {age && <span>{age} yrs</span>}
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* CTA buttons */}
            <div className="flex gap-2">
              <Button
                variant={isFavorite ? "default" : "outline"}
                onClick={handleToggleFavorite}
                disabled={isToggling}
                className="flex-1"
              >
                {isToggling ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}

                {isFavorite ? "Saved" : "Save Candidate"}
              </Button>

              <Button
                className="flex-1"
                disabled={hasPendingOffer}
              >
                <SendHorizonal className="mr-2 size-4" />

                {hasPendingOffer ? "Offer Sent" : "Send Offer"}
              </Button>
            </div>
          </div>
        </div>

        {/* Profile completion */}
        <section className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Profile Completion
            </span>

            <span
              className={`text-sm font-semibold ${
                completion >= 80
                  ? "text-green-600"
                  : completion >= 50
                  ? "text-amber-600"
                  : "text-red-500"
              }`}
            >
              {completion}%
            </span>
          </div>

          <Progress value={completion} className="h-2" />
        </section>

        {/* Contact section */}
        <section className="mb-6 rounded-xl border bg-muted/30 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Contact Information
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Contact details unlock after candidate accepts your offer.
              </p>
            </div>

            {!hasUnlockedContact && (
              <Lock className="size-4 text-muted-foreground" />
            )}
          </div>

          {hasUnlockedContact ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                {profile.email}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                {personalInfo.mobilePhoneNumber || "-"}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed bg-background p-4 text-center">
              <Lock className="mx-auto mb-2 size-5 text-muted-foreground" />

              <p className="text-sm font-medium text-foreground">
                Contact details are locked
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Send an offer → candidate accepts → unlock contact using
                company tokens.
              </p>
            </div>
          )}
        </section>

        {/* Personal Info */}
        <section className="mb-6">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <User className="size-4 text-primary" />
            Personal Information
          </h4>

          <div className="rounded-xl border bg-muted/30 p-4">
            <Row
              label="Full Name"
              value={`${personalInfo.firstName} ${personalInfo.lastName}`}
            />

            <Separator />

            <Row label="Age" value={age ? `${age} years` : "-"} />

            <Separator />

            <Row
              label="Gender"
              value={formatEnum(personalInfo.gender)}
            />

            <Separator />

            <Row
              label="Date of Birth"
              value={formatDate(personalInfo.dateOfBirth)}
            />

            <Separator />

            <Row
              label="State of Origin"
              value={personalInfo.stateOfOrigin}
            />
          </div>
        </section>

        {/* Job Preferences */}
        <section className="mb-6">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Briefcase className="size-4 text-primary" />
            Job Preferences
          </h4>

          <div className="rounded-xl border bg-muted/30 p-4">
            <Row
              label="Industry"
              value={jobPreferences.desiredIndustry}
            />

            <Separator />

            <Row
              label="Position"
              value={jobPreferences.desiredPosition}
            />

            <Separator />

            <Row
              label="Experience"
              value={formatEnum(jobPreferences.experienceLevel)}
            />

            <Separator />

            <Row
              label="Expected Salary"
              value={
                typeof jobPreferences.expectedMonthlyIncome === "number"
                  ? `EUR ${jobPreferences.expectedMonthlyIncome.toLocaleString()}/mo`
                  : typeof jobPreferences.expectedHourlyPay === "number"
                  ? `EUR ${jobPreferences.expectedHourlyPay}/hr`
                  : "-"
              }
            />

            <Separator />

            <Row
              label="Accommodation"
              value={
                <Badge
                  variant={
                    jobPreferences.accommodationRequired
                      ? "secondary"
                      : "outline"
                  }
                >
                  {jobPreferences.accommodationRequired
                    ? "Required"
                    : "Not required"}
                </Badge>
              }
            />
          </div>
        </section>

        {/* Languages */}
        <section className="mb-6">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Languages className="size-4 text-primary" />
            Languages
          </h4>

          <div className="space-y-3">
            {languages.length > 0 ? (
              languages.map((lang, i) => {
                const avg = (
                  (lang.written +
                    lang.spoken +
                    lang.reading +
                    lang.understanding) /
                  4
                ).toFixed(1);

                return (
                  <div
                    key={`${lang.language}-${i}`}
                    className="rounded-xl border bg-muted/30 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-medium">
                        {formatEnum(lang.language)}
                      </span>

                      <Badge variant="secondary">
                        Avg {avg}/10
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span>Written: {lang.written}</span>
                      <span>Spoken: {lang.spoken}</span>
                      <span>Reading: {lang.reading}</span>
                      <span>Understanding: {lang.understanding}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                No languages listed.
              </div>
            )}
          </div>
        </section>

        {/* Work Experience */}
        <section className="mb-6">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Clock className="size-4 text-primary" />
            Work Experience
          </h4>

          <div className="space-y-3">
            {workExperiences?.length ? (
              workExperiences.map((exp, i) => (
                <div
                  key={`${exp.companyName}-${i}`}
                  className="rounded-xl border bg-muted/30 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h5 className="font-medium text-foreground">
                        {exp.position}
                      </h5>

                      <p className="text-sm text-muted-foreground">
                        {exp.companyName}
                      </p>
                    </div>

                    <Badge variant="outline">
                      {exp.yearsOfExperience === "LESS_THAN_1"
                        ? "<1 year"
                        : exp.yearsOfExperience === "5_PLUS"
                        ? "5+ years"
                        : `${exp.yearsOfExperience} years`}
                    </Badge>
                  </div>

                  {exp.shortDescription && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {exp.shortDescription}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                No work experience listed.
              </div>
            )}
          </div>
        </section>

        {/* Education */}
        <section className="mb-6">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <HardHat className="size-4 text-primary" />
            Education
          </h4>

          <div className="rounded-xl border bg-muted/30 p-4">
            <Row
              label="Highest Level"
              value={formatEnum(education?.highestLevel)}
            />

            <Separator />

            <Row label="School" value={education?.schoolName} />

            <Separator />

            <Row
              label="Title"
              value={education?.titleAcquired}
            />

            <Separator />

            <Row label="Country" value={education?.country} />
          </div>
        </section>

        {/* Legal */}
        <section className="mb-6">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Shield className="size-4 text-primary" />
            Legal Status
          </h4>

          <div className="rounded-xl border bg-muted/30 p-4">
            <Row
              label="Work Permit"
              value={
                <Badge
                  variant={
                    legalStatus.hasCroatianWorkPermit
                      ? "secondary"
                      : "outline"
                  }
                >
                  {legalStatus.hasCroatianWorkPermit ? "Yes" : "No"}
                </Badge>
              }
            />

            <Separator />

            <Row
              label="Currently Employed"
              value={
                <Badge
                  variant={
                    legalStatus.currentlyEmployedInCroatia
                      ? "secondary"
                      : "outline"
                  }
                >
                  {legalStatus.currentlyEmployedInCroatia
                    ? "Yes"
                    : "No"}
                </Badge>
              }
            />

            <Separator />

            <Row
              label="Passport Expires"
              value={formatDate(
                legalStatus.passportExpirationDate
              )}
            />
          </div>
        </section>

        {/* Accommodation */}
        <section className="pb-8">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Building className="size-4 text-primary" />
            Accommodation
          </h4>

          <div className="rounded-xl border bg-muted/30 p-4">
            <Row
              label="City"
              value={accommodation.address?.city}
            />

            <Separator />

            <Row
              label="Type"
              value={formatEnum(accommodation.type)}
            />

            <Separator />

            <Row
              label="Provider"
              value={formatEnum(accommodation.provider)}
            />
          </div>
        </section>
      </SheetContent>
    </Sheet>
  );
}