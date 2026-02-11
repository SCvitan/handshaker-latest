"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StepIndicator } from "./cv-builder/step-indicator"
import { PersonalInfoStep } from "./cv-builder/personal-info-step"
import { LegalStatusStep } from "./cv-builder/legal-status-step"
import { JobPreferencesStep } from "./cv-builder/job-preferences-step"
import { LanguagesStep } from "./cv-builder/languages-step"
import { AccommodationStep } from "./cv-builder/accommodation-step"
import type { CVData } from "@/lib/cv-types"
import { INITIAL_CV_DATA } from "@/lib/cv-types"
import {
  savePersonalInfo,
  saveLegalStatus,
  saveJobPreferences,
  saveLanguages,
  saveAccommodation,
} from "@/lib/cv-api"

const STEPS = [
  { id: 1, name: "Personal Info" },
  { id: 2, name: "Legal Status" },
  { id: 3, name: "Job Preferences" },
  { id: 4, name: "Languages" },
  { id: 5, name: "Accommodation" },
]

export function CVBuilder() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [cvData, setCVData] = useState<CVData>(INITIAL_CV_DATA)
  const [isSaving, setIsSaving] = useState(false)

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
            onUpdate={updatePersonalInfo}
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
