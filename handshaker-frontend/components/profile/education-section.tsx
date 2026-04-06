"use client"

import type React from "react"
import { useState } from "react"
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
import { GraduationCap, Calendar, Globe, Save, Loader2 } from "lucide-react"
import type { Education } from "@/lib/cv-types"
import { EDUCATION_LEVEL_OPTIONS, COUNTRIES } from "@/lib/cv-types"
import { saveEducation } from "@/lib/cv-api"

interface EducationSectionProps {
  data: Education
  onSaved: (data: Education) => void
}

export function EducationSection({ data: initialData, onSaved }: EducationSectionProps) {
  const [data, setData] = useState<Education>(initialData)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "dateFinished") {
      setData({ ...data, [name]: value === "" ? null : value })
    } else {
      setData({ ...data, [name]: value })
    }
  }

  const handleSelect = (name: keyof Education, value: string) => {
    setData({ ...data, [name]: value })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveEducation(data)
      onSaved(data)
    } catch (err) {
      console.error("Failed to save education:", err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4 pt-4">
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
            <Label htmlFor="p-schoolName">Name of School / Institution</Label>
            <Input
              id="p-schoolName"
              name="schoolName"
              placeholder="University of Zagreb"
              value={data.schoolName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-titleAcquired">Title / Degree Acquired</Label>
            <Input
              id="p-titleAcquired"
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
            <Label htmlFor="p-dateFinished" className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              Year of Completion
            </Label>
            <Input
              id="p-dateFinished"
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

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
