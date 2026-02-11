"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  name: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick: (step: number) => void
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <button
            onClick={() => onStepClick(step.id)}
            disabled={step.id > currentStep}
            className={cn(
              "flex items-center gap-2 transition-all",
              step.id <= currentStep ? "cursor-pointer" : "cursor-not-allowed",
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                step.id < currentStep
                  ? "bg-accent text-accent-foreground"
                  : step.id === currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {step.id < currentStep ? <Check className="w-5 h-5" /> : step.id}
            </div>
            <span
              className={cn(
                "hidden sm:block text-sm font-medium transition-colors",
                step.id === currentStep
                  ? "text-foreground"
                  : step.id < currentStep
                    ? "text-accent"
                    : "text-muted-foreground",
              )}
            >
              {step.name}
            </span>
          </button>

          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-8 sm:w-16 lg:w-24 h-1 mx-2 rounded-full transition-colors",
                step.id < currentStep ? "bg-accent" : "bg-muted",
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
