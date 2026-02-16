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
import type { JobPreferences } from "@/lib/cv-types"
import { EXPERIENCE_LEVEL_OPTIONS } from "@/lib/cv-types"
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numericFields = [
      "expectedMonthlyIncome",
      "workingHoursPerDay",
      "workingDaysPerMonth",
      "yearsOfExperience",
    ]
    if (numericFields.includes(name)) {
      setData({ ...data, [name]: value === "" ? "" : Number(value) })
    } else {
      setData({ ...data, [name]: value })
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
          <Label htmlFor="p-industry">Industry</Label>
          <Input
            id="p-industry"
            name="industry"
            value={data.desiredIndustry}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-position">Position</Label>
          <Input
            id="p-position"
            name="position"
            value={data.desiredPosition}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="p-income">Expected Monthly Income (EUR)</Label>
          <Input
            id="p-income"
            name="expectedMonthlyIncome"
            type="number"
            min={0}
            value={data.expectedMonthlyIncome}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-yearsExp">Years of Experience</Label>
          <Input
            id="p-yearsExp"
            name="yearsOfExperience"
            type="number"
            min={0}
            value={data.yearsOfExperience}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Experience Level</Label>
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
          <Label htmlFor="p-hoursDay">Working Hours / Day</Label>
          <Input
            id="p-hoursDay"
            name="desiredWorkingHoursPerDay"
            type="number"
            min={1}
            max={24}
            value={data.desiredWorkingHoursPerDay}
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
            value={data.desiredWorkingDaysPerMonth}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <Label className="text-sm font-medium">
              Accommodation Provided
            </Label>
            <p className="text-xs text-muted-foreground">
              Employer provides accommodation?
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
              Transportation Provided
            </Label>
            <p className="text-xs text-muted-foreground">
              Employer provides transportation?
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
