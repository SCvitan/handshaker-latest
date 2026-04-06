"use client"

import type React from "react"
import { useState } from "react"
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
import { Save, Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { JobPreferences } from "@/lib/cv-types"
import { EXPERIENCE_LEVEL_OPTIONS, INDUSTRIES, POSITION_OPTIONS } from "@/lib/cv-types"
import { saveJobPreferences } from "@/lib/cv-api"

interface JobPreferencesSectionProps {
  data: JobPreferences
  onSaved: (data: JobPreferences) => void
}

export function JobPreferencesSection({
  data: initialData,
  onSaved,
}: JobPreferencesSectionProps) {
  const [data, setData] = useState<JobPreferences>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  
  // Determine salary type: "monthly" if monthly has value, "hourly" if hourly has value, default to "monthly"
  const [salaryType, setSalaryType] = useState<"monthly" | "hourly">(() => {
    if (initialData.expectedHourlyPay !== null) return "hourly"
    return "monthly"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numericFields = [
      "expectedMonthlyIncome",
      "expectedHourlyPay",
      "desiredWorkingHoursPerDay",
      "desiredWorkingDaysPerMonth",
      "yearsOfExperience",
    ]
    if (numericFields.includes(name)) {
      setData({ ...data, [name]: value === "" ? null : Number(value) })
    } else {
      setData({ ...data, [name]: value === "" ? null : value })
    }
  }

  const handleSelect = (name: keyof JobPreferences, value: string) => {
    setData({ ...data, [name]: value })
  }

  const handleSwitch = (name: keyof JobPreferences, checked: boolean) => {
    setData({ ...data, [name]: checked })
  }

  const formatLevel = (level: string) =>
    level
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ")

  async function handleSave() {
    try {
      setIsSaving(true)
      setMessage("")
      await saveJobPreferences(data)
      onSaved(data)
      setMessage("Saved successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch {
      setMessage("Failed to save. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="p-desiredIndustry">Industry</Label>
          <Select
            value={data.desiredIndustry ?? ""}
            onValueChange={(v) => handleSelect("desiredIndustry", v)}
          >
            <SelectTrigger id="p-desiredIndustry">
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
          <Label htmlFor="p-desiredPosition">Position</Label>
          {data.desiredIndustry ? (
            <Select
              value={data.desiredPosition ?? ""}
              onValueChange={(v) => handleSelect("desiredPosition", v)}
            >
              <SelectTrigger id="p-desiredPosition">
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

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Salary Type</Label>
          <RadioGroup
            value={salaryType}
            onValueChange={(value: "monthly" | "hourly") => {
              setSalaryType(value)
              if (value === "monthly") {
                setData({ ...data, expectedHourlyPay: null })
              } else {
                setData({ ...data, expectedMonthlyIncome: null })
              }
            }}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="monthly" id="p-salary-monthly" />
              <Label htmlFor="p-salary-monthly" className="font-normal cursor-pointer">
                Monthly
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="hourly" id="p-salary-hourly" />
              <Label htmlFor="p-salary-hourly" className="font-normal cursor-pointer">
                Hourly
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          {salaryType === "monthly" ? (
            <>
              <Label htmlFor="p-income">Expected Monthly Income (EUR)</Label>
              <Input
                id="p-income"
                name="expectedMonthlyIncome"
                type="number"
                min={0}
                value={data.expectedMonthlyIncome ?? ""}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <Label htmlFor="p-hourly">Expected Hourly Pay (EUR)</Label>
              <Input
                id="p-hourly"
                name="expectedHourlyPay"
                type="number"
                min={0}
                value={data.expectedHourlyPay ?? ""}
                onChange={handleChange}
              />
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Experience Level</Label>
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
          <Label htmlFor="p-hoursDay">Working Hours / Day</Label>
          <Input
            id="p-hoursDay"
            name="desiredWorkingHoursPerDay"
            type="number"
            min={1}
            max={24}
            value={data.desiredWorkingHoursPerDay ?? ""}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-daysMonth">Working Days / Month</Label>
          <Input
            id="p-daysMonth"
            name="desiredWorkingDaysPerMonth"
            type="number"
            min={1}
            max={31}
            value={data.desiredWorkingDaysPerMonth ?? ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <Label className="text-sm font-medium">
              Accommodation Required
            </Label>
            <p className="text-xs text-muted-foreground">
              Do you require accommodation?
            </p>
          </div>
          <Switch
            checked={data.accommodationRequired}
            onCheckedChange={(c) =>
              handleSwitch("accommodationRequired", c)
            }
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <Label className="text-sm font-medium">
              Transportation Required
            </Label>
            <p className="text-xs text-muted-foreground">
              Do you require transportation?
            </p>
          </div>
          <Switch
            checked={data.transportationRequired}
            onCheckedChange={(c) =>
              handleSwitch("transportationRequired", c)
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        {message && (
          <p
            className={`text-sm ${
              message.includes("success")
                ? "text-emerald-600"
                : "text-destructive"
            }`}
          >
            {message}
          </p>
        )}
        <div className="ml-auto">
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
