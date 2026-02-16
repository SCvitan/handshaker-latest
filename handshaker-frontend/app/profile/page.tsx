"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { ProfileCompletionBar } from "@/components/profile/completion-bar"
import { ProfileSection } from "@/components/profile/profile-section"
import { PersonalInfoSection } from "@/components/profile/personal-info-section"
import { LegalStatusSection } from "@/components/profile/legal-status-section"
import { JobPreferencesSection } from "@/components/profile/job-preferences-section"
import { LanguagesSection } from "@/components/profile/languages-section"
import { AccommodationSection } from "@/components/profile/accommodation-section"
import { EmploymentCurrentSection } from "@/components/profile/employment-current-section"
import { fetchProfile } from "@/lib/cv-api"
import type { UserProfile } from "@/lib/cv-types"
import { INITIAL_CV_DATA } from "@/lib/cv-types"
import {
  User,
  Shield,
  Briefcase,
  Languages,
  Building,
  HardHat,
  Loader2,
} from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [openSection, setOpenSection] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth?mode=login")
      return
    }
    if (!authLoading && user && user.role !== "USER") {
      router.push("/")
      return
    }
    if (!authLoading && user) {
      loadProfile()
    }
  }, [authLoading, user, router])

  async function loadProfile() {
    try {
      setIsLoading(true)
      const data = await fetchProfile()
      setProfile(data)
    } catch (err) {
      setError("Failed to load profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleToggle(section: string) {
    setOpenSection(openSection === section ? null : section)
  }

  function handleProfileUpdate(updated: Partial<UserProfile>) {
    if (profile) {
      setProfile({ ...profile, ...updated })
    }
  }

  if (authLoading || isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <p className="text-destructive">{error}</p>
          <button
            onClick={loadProfile}
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Try again
          </button>
        </div>
      </main>
    )
  }

  if (!profile) return null

  const sections = [
    {
      id: "personal",
      title: "Personal Information",
      description: "Name, date of birth, contact details",
      icon: User,
    },
    {
      id: "legal",
      title: "Legal Status",
      description: "Work permit, employment, identification",
      icon: Shield,
    },
    {
      id: "job",
      title: "Job Preferences",
      description: "Industry, position, work conditions",
      icon: Briefcase,
    },
    {
      id: "languages",
      title: "Languages",
      description: "Language proficiency ratings",
      icon: Languages,
    },
    {
      id: "accommodation",
      title: "Accommodation",
      description: "Address and living arrangements",
      icon: Building,
    },
    {
      id: "employment",
      title: "Current Work Details",
      description: "Current employer and work address",
      icon: HardHat,
    },
  ]

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background py-8 px-4">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.email}
          </p>
        </div>

        <ProfileCompletionBar completion={profile.profileCompletion} />

        <div className="space-y-3">
          {sections.map((section) => (
            <ProfileSection
              key={section.id}
              title={section.title}
              description={section.description}
              icon={section.icon}
              isOpen={openSection === section.id}
              onToggle={() => handleToggle(section.id)}
            >
              {section.id === "personal" && (
                <PersonalInfoSection
                  data={profile.personalInfo || INITIAL_CV_DATA.personalInfo}
                  onSaved={(data) =>
                    handleProfileUpdate({ personalInfo: data })
                  }
                />
              )}
              {section.id === "legal" && (
                <LegalStatusSection
                  data={profile.legalStatus || INITIAL_CV_DATA.legalStatus}
                  onSaved={(data) =>
                    handleProfileUpdate({ legalStatus: data })
                  }
                />
              )}
              {section.id === "job" && (
                <JobPreferencesSection
                  data={
                    profile.jobPreferences || INITIAL_CV_DATA.jobPreferences
                  }
                  onSaved={(data) =>
                    handleProfileUpdate({ jobPreferences: data })
                  }
                />
              )}
              {section.id === "languages" && (
                <LanguagesSection
                  data={profile.languages || INITIAL_CV_DATA.languages}
                  onSaved={(data) => handleProfileUpdate({ languages: data })}
                />
              )}
              {section.id === "accommodation" && (
                <AccommodationSection
                  data={
                    profile.accommodation || INITIAL_CV_DATA.accommodation
                  }
                  onSaved={(data) =>
                    handleProfileUpdate({ accommodation: data })
                  }
                />
              )}
              {section.id === "employment" && (
                <EmploymentCurrentSection
                  data={
                    profile.employmentCurrent || INITIAL_CV_DATA.employmentCurrent
                  }
                  onSaved={(data) =>
                    handleProfileUpdate({ employmentCurrent: data })
                  }
                />
              )}
            </ProfileSection>
          ))}
        </div>
      </div>
    </main>
  )
}
