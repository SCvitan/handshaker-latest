"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { StepIndicator } from "./cv-builder/step-indicator"
import { PersonalInfoStep } from "./cv-builder/personal-info-step"
import { LegalStatusStep } from "./cv-builder/legal-status-step"
import { JobPreferencesStep } from "./cv-builder/job-preferences-step"
import { LanguagesStep } from "./cv-builder/languages-step"
import { AccommodationStep } from "./cv-builder/accommodation-step"
import { EmploymentCurrentStep } from "./cv-builder/employment-current-step"
import type { CVData } from "@/lib/cv-types"
import { INITIAL_CV_DATA } from "@/lib/cv-types"
import {
  fetchProfile,
  savePersonalInfo,
  saveLegalStatus,
  saveJobPreferences,
  saveLanguages,
  saveAccommodation,
  saveEmploymentCurrent,
} from "@/lib/cv-api"
import { Loader2 } from "lucide-react"

const STEP_KEYS = [
  "personalInfo",
  "legalStatus",
  "jobPreferences",
  "languages",
  "accommodation",
  "currentWork",
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
            jobPreferences: profile.jobPreferences,
            languages: profile.languages.length > 0 ? profile.languages : INITIAL_CV_DATA.languages,
            accommodation: profile.accommodation,
            employmentCurrent: profile.employmentCurrent,
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

  const STEPS = STEP_KEYS.map((key, i) => ({
    id: i + 1,
    name: t(`cvBuilder.steps.${key}`),
  }))

  const updatePersonalInfo = (data: CVData["personalInfo"]) => {
    setCVData((prev) => ({ ...prev, personalInfo: data }))
  }

  const updateLegalStatus = (data: CVData["legalStatus"]) => {
    setCVData((prev) => ({ ...prev, legalStatus: data }))
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

  const updateEmploymentCurrent = (data: CVData["employmentCurrent"]) => {
    setCVData((prev) => ({ ...prev, employmentCurrent: data }))
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
          await saveJobPreferences(cvData.jobPreferences)
          break
        case 4:
          await saveLanguages(cvData.languages)
          break
        case 5:
          await saveAccommodation(cvData.accommodation)
          break
        case 6:
          await saveEmploymentCurrent(cvData.employmentCurrent)
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
          <JobPreferencesStep
            data={cvData.jobPreferences}
            onUpdate={updateJobPreferences}
            onNext={nextStep}
            onBack={prevStep}
            onSaveAndHome={handleSaveAndHome}
            isSaving={isSaving}
          />
        )}

        {currentStep === 4 && (
          <LanguagesStep
            data={cvData.languages}
            onUpdate={updateLanguages}
            onNext={nextStep}
            onBack={prevStep}
            onSaveAndHome={handleSaveAndHome}
            isSaving={isSaving}
          />
        )}

        {currentStep === 5 && (
          <AccommodationStep
            data={cvData.accommodation}
            onUpdate={updateAccommodation}
            onNext={nextStep}
            onBack={prevStep}
            onSaveAndHome={handleSaveAndHome}
            isSaving={isSaving}
          />
        )}

        {currentStep === 6 && (
          <EmploymentCurrentStep
            data={cvData.employmentCurrent}
            onUpdate={updateEmploymentCurrent}
            onBack={prevStep}
            onSaveAndHome={handleSaveAndHome}
            onFinish={() => handleFinish()}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  )
}
