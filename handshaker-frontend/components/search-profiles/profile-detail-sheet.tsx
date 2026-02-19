"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Shield,
  Briefcase,
  Languages,
  MapPin,
  Building,
  HardHat,
  Mail,
  Phone,
  Calendar,
  Clock,
} from "lucide-react"
import type { UserProfile } from "@/lib/cv-types"

interface ProfileDetailSheetProps {
  profile: UserProfile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

function formatDate(d: string) {
  if (!d) return "-"
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value || "-"}</span>
    </div>
  )
}

export function ProfileDetailSheet({ profile, open, onOpenChange }: ProfileDetailSheetProps) {
  if (!profile) return null

  const { personalInfo, legalStatus, jobPreferences, languages, accommodation, employmentCurrent } =
    profile
  const completion = Math.round((profile.profileCompletion || 0) * 100)
  const age = personalInfo.dateOfBirth ? calculateAge(personalInfo.dateOfBirth) : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl">
            {personalInfo.firstName} {personalInfo.lastName}
          </SheetTitle>
          <SheetDescription>{profile.email}</SheetDescription>
        </SheetHeader>

        {/* Completion bar */}
        <div className="mb-6">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Profile Completion</span>
            <span
              className={`font-medium ${
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
        </div>

        {/* Personal Info */}
        <section className="mb-5">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <User className="size-4 text-primary" />
            Personal Info
          </h4>
          <div className="rounded-md border border-border bg-muted/30 px-3 py-1">
            <Row label="Full Name" value={`${personalInfo.firstName} ${personalInfo.lastName}`} />
            <Row label="Age" value={age !== null ? `${age} years` : "-"} />
            <Row
              label="Gender"
              value={
                personalInfo.gender
                  ? personalInfo.gender.charAt(0) + personalInfo.gender.slice(1).toLowerCase()
                  : "-"
              }
            />
            <Row label="Date of Birth" value={formatDate(personalInfo.dateOfBirth)} />
            <Row label="State of Origin" value={personalInfo.stateOfOrigin} />
            <Row label="Phone" value={personalInfo.mobilePhoneNumber} />
            <Row
              label="Marital Status"
              value={
                personalInfo.maritalStatus
                  ? personalInfo.maritalStatus.charAt(0) +
                    personalInfo.maritalStatus.slice(1).toLowerCase()
                  : "-"
              }
            />
            <Row
              label="Children"
              value={
                typeof personalInfo.numberOfChildren === "number"
                  ? personalInfo.numberOfChildren
                  : "-"
              }
            />
          </div>
        </section>

        <Separator className="my-4" />

        {/* Legal Status */}
        <section className="mb-5">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Shield className="size-4 text-primary" />
            Legal Status
          </h4>
          <div className="rounded-md border border-border bg-muted/30 px-3 py-1">
            <Row
              label="Work Permit"
              value={
                <Badge variant={legalStatus.hasCroatianWorkPermit ? "secondary" : "outline"}>
                  {legalStatus.hasCroatianWorkPermit ? "Yes" : "No"}
                </Badge>
              }
            />
            {legalStatus.hasCroatianWorkPermit && (
              <Row label="Permit Expires" value={formatDate(legalStatus.workPermitExpirationDate)} />
            )}
            <Row
              label="Employed in Croatia"
              value={
                <Badge variant={legalStatus.currentlyEmployedInCroatia ? "secondary" : "outline"}>
                  {legalStatus.currentlyEmployedInCroatia ? "Yes" : "No"}
                </Badge>
              }
            />
            <Row label="Arrived in Croatia" value={formatDate(legalStatus.dateOfArrivalInCroatia)} />
            <Row label="Passport Expires" value={formatDate(legalStatus.passportExpirationDate)} />
            <Row label="OIB" value={legalStatus.oib} />
          </div>
        </section>

        <Separator className="my-4" />

        {/* Job Preferences */}
        <section className="mb-5">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Briefcase className="size-4 text-primary" />
            Job Preferences
          </h4>
          <div className="rounded-md border border-border bg-muted/30 px-3 py-1">
            <Row label="Industry" value={jobPreferences.desiredIndustry} />
            <Row label="Position" value={jobPreferences.desiredPosition} />
            <Row
              label="Expected Income"
              value={
                typeof jobPreferences.expectedMonthlyIncome === "number"
                  ? `EUR ${jobPreferences.expectedMonthlyIncome.toLocaleString()}/mo`
                  : "-"
              }
            />
            <Row
              label="Experience"
              value={
                typeof jobPreferences.yearsOfExperience === "number"
                  ? `${jobPreferences.yearsOfExperience} years`
                  : "-"
              }
            />
            <Row
              label="Experience Level"
              value={
                jobPreferences.experienceLevel
                  ? jobPreferences.experienceLevel.replace(/_/g, " ").charAt(0) +
                    jobPreferences.experienceLevel.replace(/_/g, " ").slice(1).toLowerCase()
                  : "-"
              }
            />
            <Row
              label="Working Hours"
              value={
                jobPreferences.desiredWorkingHoursPerDay
                  ? `${jobPreferences.desiredWorkingHoursPerDay}h/day, ${jobPreferences.desiredWorkingDaysPerMonth} days/mo`
                  : "-"
              }
            />
            <Row
              label="Accommodation"
              value={
                <Badge variant={jobPreferences.accommodationRequired ? "secondary" : "outline"}>
                  {jobPreferences.accommodationRequired ? "Needed" : "Not needed"}
                </Badge>
              }
            />
            <Row
              label="Transportation"
              value={
                <Badge variant={jobPreferences.transportationRequired ? "secondary" : "outline"}>
                  {jobPreferences.transportationRequired ? "Needed" : "Not needed"}
                </Badge>
              }
            />
          </div>
        </section>

        <Separator className="my-4" />

        {/* Languages */}
        <section className="mb-5">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Languages className="size-4 text-primary" />
            Languages ({languages.length})
          </h4>
          <div className="space-y-2">
            {languages.length > 0 ? (
              languages.map((lang, i) => {
                const avg = ((lang.written + lang.spoken + lang.reading + lang.understanding) / 4).toFixed(
                  1
                )
                return (
                  <div
                    key={`${lang.language}-${i}`}
                    className="rounded-md border border-border bg-muted/30 px-3 py-2"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {lang.language.charAt(0) + lang.language.slice(1).toLowerCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">Avg: {avg}/10</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                      <span>Written: {lang.written}</span>
                      <span>Spoken: {lang.spoken}</span>
                      <span>Reading: {lang.reading}</span>
                      <span>Understand: {lang.understanding}</span>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-muted-foreground">No languages listed.</p>
            )}
          </div>
        </section>

        <Separator className="my-4" />

        {/* Accommodation */}
        <section className="mb-5">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Building className="size-4 text-primary" />
            Accommodation
          </h4>
          <div className="rounded-md border border-border bg-muted/30 px-3 py-1">
            <Row
              label="Address"
              value={
                accommodation.address.street
                  ? `${accommodation.address.street} ${accommodation.address.houseNumber}, ${accommodation.address.postalCode} ${accommodation.address.city}`
                  : "-"
              }
            />
            <Row
              label="Provider"
              value={
                accommodation.provider
                  ? accommodation.provider.charAt(0) + accommodation.provider.slice(1).toLowerCase()
                  : "-"
              }
            />
            <Row
              label="Type"
              value={
                accommodation.type ? accommodation.type.replace(/_/g, " ").charAt(0) + accommodation.type.replace(/_/g, " ").slice(1).toLowerCase() : "-"
              }
            />
            <Row
              label="People in Room"
              value={
                accommodation.peopleInRoom
                  ? accommodation.peopleInRoom.replace(/_/g, " ").charAt(0) + accommodation.peopleInRoom.replace(/_/g, " ").slice(1).toLowerCase()
                  : "-"
              }
            />
          </div>
        </section>

        <Separator className="my-4" />

        {/* Current Employment */}
        {employmentCurrent.employerName && (
          <section className="mb-5">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <HardHat className="size-4 text-primary" />
              Current Work
            </h4>
            <div className="rounded-md border border-border bg-muted/30 px-3 py-1">
              <Row label="Job Title" value={employmentCurrent.jobTitleInCroatia} />
              <Row label="Industry" value={employmentCurrent.industry} />
              <Row label="Employer" value={employmentCurrent.employerName} />
              <Row label="Employer Address" value={employmentCurrent.employerAddress} />
              <Row label="Contact" value={employmentCurrent.employerContactInfo} />
              <Row label="City of Work" value={employmentCurrent.cityOfWork} />
              <Row
                label="Previous Employers"
                value={employmentCurrent.numberOfPreviousEmployersInCroatia}
              />
              <Row
                label="Work Address"
                value={
                  employmentCurrent.workAddress.street
                    ? `${employmentCurrent.workAddress.street} ${employmentCurrent.workAddress.houseNumber}, ${employmentCurrent.workAddress.postalCode} ${employmentCurrent.workAddress.city}`
                    : "-"
                }
              />
            </div>
          </section>
        )}
      </SheetContent>
    </Sheet>
  )
}
