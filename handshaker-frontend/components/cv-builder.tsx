"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { StepIndicator } from "./cv-builder/step-indicator"
import { PersonalInfoStep } from "./cv-builder/personal-info-step"
import { LegalStatusStep } from "./cv-builder/legal-status-step"
import { WorkExperienceStep } from "./cv-builder/work-experience-step"
import { EducationStep } from "./cv-builder/education-step"
import { JobPreferencesStep } from "./cv-builder/job-preferences-step"
import { LanguagesStep } from "./cv-builder/languages-step"
import { AccommodationStep } from "./cv-builder/accommodation-step"
import { DocumentationStep } from "./cv-builder/documentation-step"
import type { CVData } from "@/lib/cv-types"
import { INITIAL_CV_DATA } from "@/lib/cv-types"
import {
  fetchProfile,
  savePersonalInfo,
  saveLegalStatus,
  saveWorkExperience,
  saveEducation,
  saveJobPreferences,
  saveLanguages,
  saveAccommodation,
} from "@/lib/cv-api"
import { Loader2 } from "lucide-react"

// New step order:
// 1. Personal Info
// 2. Legal Status
// 3. Work Experience (NEW)
// 4. Education (NEW)
// 5. Job Preferences
// 6. Languages
// 7. Accommodation
// 8. Documentation (replaces Employment Current)

const STEP_KEYS = [
  "personalInfo",
  "legalStatus",
  "workExperience",
  "education",
  "jobPreferences",
  "languages",
  "accommodation",
  "documentation",
] as const

export function CVBuilder() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(1)
  const [cvData, setCVData] = useState<CVData>(INITIAL_CV_DATA)
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load existing profile data on mount
  useEffect(() => {
    async function loadExistingProfile() {
      try {
        const profile = await fetchProfile()
        if (profile) {
          setCVData({
            personalInfo: profile.personalInfo,
            legalStatus: profile.legalStatus,
            workExperience: profile.workExperiences || [],
            education: profile.education || INITIAL_CV_DATA.education,
            jobPreferences: profile.jobPreferences,
            languages: profile.languages.length > 0 ? profile.languages : INITIAL_CV_DATA.languages,
            accommodation: profile.accommodation,
            documentation: profile.documents || [],
          })
          setProfileImageUrl(profile.profileImageUrl)
        }
      } catch {
        // New user, use initial data
      } finally {
        setIsLoading(false)
      }
    }
    loadExistingProfile()
  }, [])

  // Step names for display - using English for now
  const STEP_NAMES: Record<string, string> = {
    personalInfo: "Personal Info",
    legalStatus: "Legal Status",
    workExperience: "Work Experience",
    education: "Education",
    jobPreferences: "Job Preferences",
    languages: "Languages",
    accommodation: "Accommodation",
    documentation: "Documentation",
  }

  const STEPS = STEP_KEYS.map((key, i) => ({
    id: i + 1,
    name: STEP_NAMES[key] || t(`cvBuilder.steps.${key}`),
  }))

  const updatePersonalInfo = (data: CVData["personalInfo"]) => {
    setCVData((prev) => ({ ...prev, personalInfo: data }))
  }

  const updateLegalStatus = (data: CVData["legalStatus"]) => {
    setCVData((prev) => ({ ...prev, legalStatus: data }))
  }

  const updateWorkExperience = (data: CVData["workExperience"]) => {
    setCVData((prev) => ({ ...prev, workExperience: data }))
  }

  const updateEducation = (data: CVData["education"]) => {
    setCVData((prev) => ({ ...prev, education: data }))
  }

  const updateJobPreferences = (data: CVData["jobPreferences"]) => {
    setCVData((prev) => ({ ...prev, jobPreferences: data }))
  }

  const updateLanguages = (data: CVData["languages"]) => {
    setCVData((prev) => ({ ...prev, languages: data }))
  }

  const updateAccommodation = (data: CVData["accommodation"]) => {
    setCVData((prev) => ({ ...prev, accommodation: data }))
  }

  const updateDocumentation = (data: CVData["documentation"]) => {
    setCVData((prev) => ({ ...prev, documentation: data }))
  }

  async function nextStep() {
    if (currentStep < STEPS.length) {
      await saveCurrentStep()
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step)
    }
  }

  async function saveCurrentStep() {
    setIsSaving(true)
    try {
      switch (currentStep) {
        case 1:
          await savePersonalInfo(cvData.personalInfo)
          break
        case 2:
          await saveLegalStatus(cvData.legalStatus)
          break
        case 3:
          await saveWorkExperience(cvData.workExperience)
          break
        case 4:
          await saveEducation(cvData.education)
          break
        case 5:
          await saveJobPreferences(cvData.jobPreferences)
          break
        case 6:
          await saveLanguages(cvData.languages)
          break
        case 7:
          await saveAccommodation(cvData.accommodation)
          break
        case 8:
          // Documents are uploaded directly via the upload API
          // No need to save anything here
          break
      }
    } catch (err) {
      console.error("Failed to save:", err)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSaveAndHome() {
    await saveCurrentStep()
    router.push("/")
  }

  async function handleFinish() {
    await saveCurrentStep()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
      <div className="border-b border-border bg-muted/30 p-6">
        <StepIndicator
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={goToStep}
        />
      </div>

      <div className="p-6">
        {currentStep === 1 && (
          <PersonalInfoStep
            data={cvData.personalInfo}
            profileImageUrl={profileImageUrl}
            onUpdate={updatePersonalInfo}
            onImageUploaded={setProfileImageUrl}
            onNext={nextStep}
            onSaveAndHome={handleSaveAndHome}
            isSaving={isSaving}
          />
        )}

        {currentStep === 2 && (
          <LegalStatusStep
            data={cvData.legalStatus}
            onUpdate={updateLegalStatus}
            onNext={nextStep}
            onBack={prevStep}
            onSaveAndHome={handleSaveAndHome}
            isSaving={isSaving}
          />
        )}

        {currentStep === 3 && (
          <WorkExperienceStep
            data={cvData.workExperience}
            onUpdate={updateWorkExperience}
            onNext={nextStep}
            onBack={prevStep}
            onSaveAndHome={handleSaveAndHome}
            isSaving={isSaving}
          />
        )}

        {currentStep === 4 && (
          <EducationStep
            data={cvData.education}
            onUpdate={updateEducation}
            onNext={nextStep}
            onBack={prevStep}
            onSaveAndHome={handleSaveAndHome}
            isSaving={isSaving}
          />
        )}

        {currentStep === 5 && (
          <JobPreferencesStep
            data={cvData.jobPreferences}
            onUpdate={updateJobPreferences}
            onNext={nextStep}
            onBack={prevStep}
            onSaveAndHome={handleSaveAndHome}
            isSaving={isSaving}
          />
        )}

        {currentStep === 6 && (
          <LanguagesStep
            data={cvData.languages}
            onUpdate={updateLanguages}
            onNext={nextStep}
            onBack={prevStep}
            onSaveAndHome={handleSaveAndHome}
            isSaving={isSaving}
          />
        )}

        {currentStep === 7 && (
          <AccommodationStep
            data={cvData.accommodation}
            onUpdate={updateAccommodation}
            onNext={nextStep}
            onBack={prevStep}
            onSaveAndHome={handleSaveAndHome}
            isSaving={isSaving}
          />
        )}

        {currentStep === 8 && (
          <DocumentationStep
            data={cvData.documentation}
            onUpdate={updateDocumentation}
            onBack={prevStep}
            onSaveAndHome={handleSaveAndHome}
            onFinish={handleFinish}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  )
}
