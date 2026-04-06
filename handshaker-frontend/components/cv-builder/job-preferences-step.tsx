"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { JobPreferences } from "@/lib/cv-types"
import { EXPERIENCE_LEVEL_OPTIONS, INDUSTRIES, WORK_TYPE_OPTIONS, POSITION_OPTIONS } from "@/lib/cv-types"

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
  // Determine initial salary type based on data
  const [salaryType, setSalaryType] = useState<"monthly" | "hourly">(() => {
    if (data.expectedHourlyPay !== null) return "hourly"
    return "monthly"
  })

  // Sync salaryType if data changes externally (e.g., profile load)
  useEffect(() => {
    if (data.expectedHourlyPay !== null) {
      setSalaryType("hourly")
    } else {
      setSalaryType("monthly")
    }
  }, [data.expectedHourlyPay, data.expectedMonthlyIncome])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numericFields = [
      "expectedMonthlyIncome",
      "expectedHourlyPay",
      "desiredWorkingHoursPerDay",
      "desiredWorkingDaysPerMonth",
    ]
    if (numericFields.includes(name)) {
      onUpdate({ ...data, [name]: value === "" ? null : Number(value) })
    } else {
      onUpdate({ ...data, [name]: value === "" ? null : value })
    }
  }

  const handleSelect = (name: keyof JobPreferences, value: string) => {
    onUpdate({ ...data, [name]: value })
  }

  const handleSwitch = (name: keyof JobPreferences, checked: boolean) => {
    onUpdate({ ...data, [name]: checked })
  }

  const handleWorkTypeToggle = (type: string, checked: boolean) => {
    const currentTypes = data.preferredWorkTypes || []
    if (checked) {
      onUpdate({ ...data, preferredWorkTypes: [...currentTypes, type] })
    } else {
      onUpdate({ ...data, preferredWorkTypes: currentTypes.filter((t) => t !== type) })
    }
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
              value={data.desiredIndustry ?? ""}
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
            {data.desiredIndustry ? (
              <Select
                value={data.desiredPosition ?? ""}
                onValueChange={(v) => handleSelect("desiredPosition", v)}
              >
                <SelectTrigger id="desiredPosition">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {(POSITION_OPTIONS[data.desiredIndustry as keyof typeof POSITION_OPTIONS] || []).map(
                    (position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-muted-foreground p-2 rounded border border-dashed">
                Select an industry first
              </div>
            )}
          </div>
        </div>

        {/* Preferred Work Type - Multiple Selection */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            Preferred Work Type
          </Label>
          <p className="text-xs text-muted-foreground -mt-1">
            Select all that apply
          </p>
          <div className="flex flex-wrap gap-4">
            {WORK_TYPE_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox
                  id={`work-type-${opt.value}`}
                  checked={(data.preferredWorkTypes || []).includes(opt.value)}
                  onCheckedChange={(checked) => handleWorkTypeToggle(opt.value, !!checked)}
                />
                <Label
                  htmlFor={`work-type-${opt.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {opt.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="size-4 text-muted-foreground" />
              Salary Type
            </Label>
            <RadioGroup
              value={salaryType}
              onValueChange={(value: "monthly" | "hourly") => {
                setSalaryType(value)
                if (value === "monthly") {
                  onUpdate({ ...data, expectedHourlyPay: null })
                } else {
                  onUpdate({ ...data, expectedMonthlyIncome: null })
                }
              }}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="monthly" id="salary-monthly" />
                <Label htmlFor="salary-monthly" className="font-normal cursor-pointer">
                  Monthly
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="hourly" id="salary-hourly" />
                <Label htmlFor="salary-hourly" className="font-normal cursor-pointer">
                  Hourly
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            {salaryType === "monthly" ? (
              <>
                <Label htmlFor="expectedMonthlyIncome" className="flex items-center gap-2">
                  <DollarSign className="size-4 text-muted-foreground" />
                  Expected Monthly Income (EUR)
                </Label>
                <Input
                  id="expectedMonthlyIncome"
                  name="expectedMonthlyIncome"
                  type="number"
                  min={0}
                  placeholder="2000"
                  value={data.expectedMonthlyIncome ?? ""}
                  onChange={handleChange}
                />
              </>
            ) : (
              <>
                <Label htmlFor="expectedHourlyPay" className="flex items-center gap-2">
                  <DollarSign className="size-4 text-muted-foreground" />
                  Expected Hourly Pay (EUR)
                </Label>
                <Input
                  id="expectedHourlyPay"
                  name="expectedHourlyPay"
                  type="number"
                  min={0}
                  placeholder="12"
                  value={data.expectedHourlyPay ?? ""}
                  onChange={handleChange}
                />
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">Experience Level</Label>
          <Select
            value={data.experienceLevel ?? ""}
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
              value={data.desiredWorkingHoursPerDay ?? ""}
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
              value={data.desiredWorkingDaysPerMonth ?? ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <Label
                htmlFor="accommodationRequired"
                className="text-sm font-medium"
              >
                Accommodation Required
              </Label>
              <p className="text-xs text-muted-foreground">
                Do you require accommodation?
              </p>
            </div>
            <Switch
              id="accommodationRequired"
              checked={data.accommodationRequired}
              onCheckedChange={(c) =>
                handleSwitch("accommodationRequired", c)
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <Label
                htmlFor="transportationRequired"
                className="text-sm font-medium"
              >
                Transportation Required
              </Label>
              <p className="text-xs text-muted-foreground">
                Do you require transportation?
              </p>
            </div>
            <Switch
              id="transportationRequired"
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
