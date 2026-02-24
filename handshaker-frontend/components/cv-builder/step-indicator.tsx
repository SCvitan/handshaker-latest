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
    <div className="overflow-x-auto pb-2 -mb-2">
      <div className="flex items-center min-w-max">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => onStepClick(step.id)}
              disabled={step.id > currentStep}
              className={cn(
                "flex items-center gap-1.5 transition-all whitespace-nowrap",
                step.id <= currentStep ? "cursor-pointer" : "cursor-not-allowed",
              )}
            >
              <div
                className={cn(
                  "size-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                  step.id < currentStep
                    ? "bg-primary/20 text-primary"
                    : step.id === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {step.id < currentStep ? <Check className="size-4" /> : step.id}
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors hidden sm:block",
                  step.id === currentStep
                    ? "text-foreground"
                    : step.id < currentStep
                      ? "text-primary"
                      : "text-muted-foreground",
                )}
              >
                {step.name}
              </span>
            </button>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-6 sm:w-8 lg:w-12 h-0.5 mx-1.5 rounded-full transition-colors shrink-0",
                  step.id < currentStep ? "bg-primary/30" : "bg-muted",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
