"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Briefcase,
  DollarSign,
  Clock,
} from "lucide-react"
import type { JobPreferences } from "@/lib/cv-types"
import { EXPERIENCE_LEVEL_OPTIONS, INDUSTRIES } from "@/lib/cv-types"

interface JobPreferencesStepProps {
  data: JobPreferences
  onUpdate: (data: JobPreferences) => void
  onNext: () => void
  onBack: () => void
  onSaveAndHome: () => void
  isSaving: boolean
}

export function JobPreferencesStep({
  data,
  onUpdate,
  onNext,
  onBack,
  onSaveAndHome,
  isSaving,
}: JobPreferencesStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numericFields = [
      "expectedMonthlyIncome",
      "workingHoursPerDay",
      "workingDaysPerMonth",
      "yearsOfExperience",
    ]
    if (numericFields.includes(name)) {
      onUpdate({ ...data, [name]: value === "" ? "" : Number(value) })
    } else {
      onUpdate({ ...data, [name]: value })
    }
  }

  const handleSelect = (name: keyof JobPreferences, value: string) => {
    onUpdate({ ...data, [name]: value })
  }

  const handleSwitch = (name: keyof JobPreferences, checked: boolean) => {
    onUpdate({ ...data, [name]: checked })
  }

  const isValid = data.desiredIndustry && data.desiredPosition

  const formatLevel = (level: string) =>
    level
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">
          Job Preferences
        </h2>
        <p className="text-sm text-muted-foreground">
          Your desired industry, role, and work conditions
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="desiredIndustry" className="flex items-center gap-2">
              <Briefcase className="size-4 text-muted-foreground" />
              Industry *
            </Label>
            <Select
              value={data.desiredIndustry}
              onValueChange={(v) => handleSelect("desiredIndustry", v)}
            >
              <SelectTrigger id="desiredIndustry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((ind) => (
                  <SelectItem key={ind.value} value={ind.value}>
                    {ind.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="desiredPosition" className="flex items-center gap-2">
              <Briefcase className="size-4 text-muted-foreground" />
              Position *
            </Label>
            <Input
              id="desiredPosition"
              name="desiredPosition"
              placeholder="Driver"
              value={data.desiredPosition}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="expectedMonthlyIncome"
              className="flex items-center gap-2"
            >
              <DollarSign className="size-4 text-muted-foreground" />
              Expected Monthly Income (EUR)
            </Label>
            <Input
              id="expectedMonthlyIncome"
              name="expectedMonthlyIncome"
              type="number"
              min={0}
              placeholder=""
              value={data.expectedMonthlyIncome}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="yearsOfExperience"
              className="flex items-center gap-2"
            >
              Years of Experience
            </Label>
            <Input
              id="yearsOfExperience"
              name="yearsOfExperience"
              type="number"
              min={0}
              placeholder=""
              value={data.yearsOfExperience}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">Experience Level</Label>
          <Select
            value={data.experienceLevel}
            onValueChange={(v) => handleSelect("experienceLevel", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_LEVEL_OPTIONS.map((level) => (
                <SelectItem key={level} value={level}>
                  {formatLevel(level)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="desiredWorkingHoursPerDay"
              className="flex items-center gap-2"
            >
              <Clock className="size-4 text-muted-foreground" />
              Working Hours / Day
            </Label>
            <Input
              id="desiredWorkingHoursPerDay"
              name="desiredWorkingHoursPerDay"
              type="number"
              min={1}
              max={24}
              placeholder="8"
              value={data.desiredWorkingHoursPerDay}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="desiredWorkingDaysPerMonth"
              className="flex items-center gap-2"
            >
              <Clock className="size-4 text-muted-foreground" />
              Working Days / Month
            </Label>
            <Input
              id="desiredWorkingDaysPerMonth"
              name="desiredWorkingDaysPerMonth"
              type="number"
              min={1}
              max={31}
              placeholder="20"
              value={data.desiredWorkingDaysPerMonth}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <Label
                htmlFor="accommodationProvided"
                className="text-sm font-medium"
              >
                Accommodation Provided
              </Label>
              <p className="text-xs text-muted-foreground">
                Employer provides accommodation?
              </p>
            </div>
            <Switch
              id="accommodationProvided"
              checked={data.accommodationRequired}
              onCheckedChange={(c) =>
                handleSwitch("accommodationRequired", c)
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <Label
                htmlFor="transportationProvided"
                className="text-sm font-medium"
              >
                Transportation Provided
              </Label>
              <p className="text-xs text-muted-foreground">
                Employer provides transportation?
              </p>
            </div>
            <Switch
              id="transportationProvided"
              checked={data.transportationRequired}
              onCheckedChange={(c) =>
                handleSwitch("transportationRequired", c)
              }
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="gap-2 bg-transparent"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={onSaveAndHome}
            disabled={isSaving}
            className="gap-2 bg-transparent"
          >
            <Home className="size-4" />
            {isSaving ? "Saving..." : "Save & Return Home"}
          </Button>
        </div>
        <Button onClick={onNext} disabled={!isValid || isSaving} className="gap-2">
          {isSaving ? "Saving..." : "Continue"}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
