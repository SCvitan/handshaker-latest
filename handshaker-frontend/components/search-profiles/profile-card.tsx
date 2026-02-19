"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Briefcase, Languages, Clock, Shield } from "lucide-react"
import type { UserProfile } from "@/lib/cv-types"

interface ProfileCardProps {
  profile: UserProfile
  onClick: () => void
}

function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

export function ProfileCard({ profile, onClick }: ProfileCardProps) {
  const { personalInfo, jobPreferences, languages, legalStatus, accommodation, employmentCurrent } =
    profile
  const completion = Math.round((profile.profileCompletion || 0) * 100)
  const age = personalInfo.dateOfBirth ? calculateAge(personalInfo.dateOfBirth) : null
  const city = accommodation.address.city || employmentCurrent.cityOfWork || ""

  return (
    <Card
      className="cursor-pointer transition-all hover:border-primary/30 hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground">
              {personalInfo.firstName} {personalInfo.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {age !== null && <span>{age} yrs</span>}
              {age !== null && personalInfo.gender && <span> / </span>}
              {personalInfo.gender && (
                <span>{personalInfo.gender.charAt(0) + personalInfo.gender.slice(1).toLowerCase()}</span>
              )}
              {personalInfo.stateOfOrigin && <span> / {personalInfo.stateOfOrigin}</span>}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className={`text-xs font-medium ${
                completion >= 80
                  ? "text-green-600"
                  : completion >= 50
                    ? "text-amber-600"
                    : "text-red-500"
              }`}
            >
              {completion}%
            </span>
            <Progress value={completion} className="h-1.5 w-16" />
          </div>
        </div>

        {/* Position + Industry */}
        {(jobPreferences.desiredPosition || jobPreferences.desiredIndustry) && (
          <div className="mb-3 flex items-center gap-1.5 text-sm">
            <Briefcase className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate text-foreground">
              {jobPreferences.desiredPosition}
              {jobPreferences.desiredPosition && jobPreferences.desiredIndustry && " in "}
              {jobPreferences.desiredIndustry}
            </span>
          </div>
        )}

        {/* City */}
        {city && (
          <div className="mb-3 flex items-center gap-1.5 text-sm">
            <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">{city}</span>
          </div>
        )}

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5">
          {/* Experience */}
          {jobPreferences.yearsOfExperience !== "" && (
            <Badge variant="secondary" className="text-xs font-normal">
              <Clock className="mr-1 size-3" />
              {jobPreferences.yearsOfExperience} yrs exp
            </Badge>
          )}

          {/* Work Permit */}
          <Badge
            variant={legalStatus.hasCroatianWorkPermit ? "secondary" : "outline"}
            className="text-xs font-normal"
          >
            <Shield className="mr-1 size-3" />
            {legalStatus.hasCroatianWorkPermit ? "Permit" : "No permit"}
          </Badge>

          {/* Languages */}
          {languages.length > 0 && (
            <Badge variant="secondary" className="text-xs font-normal">
              <Languages className="mr-1 size-3" />
              {languages.length} lang{languages.length !== 1 && "s"}
            </Badge>
          )}

          {/* Income */}
          {typeof jobPreferences.expectedMonthlyIncome === "number" &&
            jobPreferences.expectedMonthlyIncome > 0 && (
              <Badge variant="outline" className="text-xs font-normal">
                EUR {jobPreferences.expectedMonthlyIncome.toLocaleString()}/mo
              </Badge>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
