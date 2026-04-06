"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  GraduationCap,
  Calendar,
  Globe,
} from "lucide-react"
import type { Education } from "@/lib/cv-types"
import { EDUCATION_LEVEL_OPTIONS, COUNTRIES } from "@/lib/cv-types"

interface EducationStepProps {
  data: Education
  onUpdate: (data: Education) => void
  onNext: () => void
  onBack: () => void
  onSaveAndHome: () => void
  isSaving: boolean
}

export function EducationStep({
  data,
  onUpdate,
  onNext,
  onBack,
  onSaveAndHome,
  isSaving,
}: EducationStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "dateFinished") {
      onUpdate({ ...data, [name]: value === "" ? null : value })
    } else {
      onUpdate({ ...data, [name]: value })
    }
  }

  const handleSelect = (name: keyof Education, value: string) => {
    onUpdate({ ...data, [name]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">
          Education
        </h2>
        <p className="text-sm text-muted-foreground">
          Tell us about your educational background
        </p>
      </div>

      <div className="grid gap-5">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <GraduationCap className="size-4 text-muted-foreground" />
            Highest Education Level
          </Label>
          <Select
            value={data.highestLevel ?? ""}
            onValueChange={(v) => handleSelect("highestLevel", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVEL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="schoolName">Name of School / Institution</Label>
            <Input
              id="schoolName"
              name="schoolName"
              placeholder="University of Zagreb"
              value={data.schoolName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="titleAcquired">Title / Degree Acquired</Label>
            <Input
              id="titleAcquired"
              name="titleAcquired"
              placeholder="Bachelor of Science"
              value={data.titleAcquired}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="size-4 text-muted-foreground" />
              Country of School
            </Label>
            <Select
              value={data.country ?? ""}
              onValueChange={(v) => handleSelect("country", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateFinished" className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              Year of Completion
            </Label>
            <Input
              id="dateFinished"
              name="dateFinished"
              type="number"
              min={1950}
              max={new Date().getFullYear()}
              placeholder={String(new Date().getFullYear())}
              value={data.dateFinished ?? ""}
              onChange={handleChange}
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
        <Button onClick={onNext} disabled={isSaving} className="gap-2">
          {isSaving ? "Saving..." : "Continue"}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
