"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { ProfileCompletionBar } from "@/components/profile/completion-bar"
import { ProfileSection } from "@/components/profile/profile-section"
import { PersonalInfoSection } from "@/components/profile/personal-info-section"
import { LegalStatusSection } from "@/components/profile/legal-status-section"
import { WorkExperienceSection } from "@/components/profile/work-experience-section"
import { EducationSection } from "@/components/profile/education-section"
import { JobPreferencesSection } from "@/components/profile/job-preferences-section"
import { LanguagesSection } from "@/components/profile/languages-section"
import { AccommodationSection } from "@/components/profile/accommodation-section"
import { DocumentationSection } from "@/components/profile/documentation-section"
import { fetchProfile } from "@/lib/cv-api"
import type { UserProfile } from "@/lib/cv-types"
import { INITIAL_CV_DATA } from "@/lib/cv-types"
import {
  User,
  Shield,
  Briefcase,
  Languages,
  Building,
  FileText,
  Loader2,
  GraduationCap,
} from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const { t } = useLanguage()
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
      setError(t("profile.failedToLoad"))
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
          <span>{t("profile.loadingProfile")}</span>
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
            {t("profile.tryAgain")}
          </button>
        </div>
      </main>
    )
  }

  if (!profile) return null

  const sections = [
    {
      id: "personal",
      title: t("profile.sections.personalInfo"),
      description: t("profile.sections.personalInfoDesc"),
      icon: User,
    },
    {
      id: "legal",
      title: t("profile.sections.legalStatus"),
      description: t("profile.sections.legalStatusDesc"),
      icon: Shield,
    },
    {
      id: "workExperience",
      title: t("profile.sections.workExperience") || "Work Experience",
      description: t("profile.sections.workExperienceDesc") || "Your work history in Croatia",
      icon: Briefcase,
    },
    {
      id: "education",
      title: t("profile.sections.education") || "Education",
      description: t("profile.sections.educationDesc") || "Your educational background",
      icon: GraduationCap,
    },
    {
      id: "job",
      title: t("profile.sections.jobPreferences"),
      description: t("profile.sections.jobPreferencesDesc"),
      icon: Briefcase,
    },
    {
      id: "languages",
      title: t("profile.sections.languages"),
      description: t("profile.sections.languagesDesc"),
      icon: Languages,
    },
    {
      id: "accommodation",
      title: t("profile.sections.accommodation"),
      description: t("profile.sections.accommodationDesc"),
      icon: Building,
    },
    {
      id: "documentation",
      title: t("profile.sections.documentation"),
      description: t("profile.sections.documentationDesc"),
      icon: FileText,
    },
  ]

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background py-8 px-4">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">
            {t("profile.title")}
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
                  profileImageUrl={profile.profileImageUrl}
                  onSaved={(data) =>
                    handleProfileUpdate({ personalInfo: data })
                  }
                  onImageUploaded={(url) =>
                    handleProfileUpdate({ profileImageUrl: url })
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
              {section.id === "workExperience" && (
                <WorkExperienceSection
                  data={profile.workExperiences || INITIAL_CV_DATA.workExperience}
                  onSaved={(data) =>
                    handleProfileUpdate({ workExperiences: data })
                  }
                />
              )}
              {section.id === "education" && (
                <EducationSection
                  data={profile.education || INITIAL_CV_DATA.education}
                  onSaved={(data) =>
                    handleProfileUpdate({ education: data })
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
              {section.id === "documentation" && (
                <DocumentationSection
                  data={profile.documents || []}
                  onSaved={(data) =>
                    handleProfileUpdate({ documents: data })
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
