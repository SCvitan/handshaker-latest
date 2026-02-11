"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Home, Plus, Trash2, Languages } from "lucide-react"
import type { Language } from "@/lib/cv-types"
import { LANGUAGE_OPTIONS } from "@/lib/cv-types"

interface LanguagesStepProps {
  data: Language[]
  onUpdate: (data: Language[]) => void
  onNext: () => void
  onBack: () => void
  onSaveAndHome: () => void
  isSaving: boolean
}

const SKILL_LEVELS = Array.from({ length: 10 }, (_, i) => i + 1)

export function LanguagesStep({
  data,
  onUpdate,
  onNext,
  onBack,
  onSaveAndHome,
  isSaving,
}: LanguagesStepProps) {
  const addLanguage = () => {
    onUpdate([
      ...data,
      { language: "", written: 1, spoken: 1, reading: 1, understanding: 1 },
    ])
  }

  const removeLanguage = (index: number) => {
    onUpdate(data.filter((_, i) => i !== index))
  }

  const updateLanguage = (
    index: number,
    field: keyof Language,
    value: string | number
  ) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onUpdate(updated)
  }

  const isValid = data.length > 0 && data.every((l) => l.language !== "")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Languages
          </h2>
          <p className="text-sm text-muted-foreground">
            Add languages and rate your proficiency (1-10)
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={addLanguage} className="gap-2 bg-transparent">
          <Plus className="size-4" />
          Add Language
        </Button>
      </div>

      <div className="space-y-4">
        {data.map((lang, index) => (
          <div
            key={index}
            className="rounded-lg border border-border p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Languages className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Language {index + 1}
                </span>
              </div>
              {data.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLanguage(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label>Language *</Label>
              <Select
                value={lang.language}
                onValueChange={(v) => updateLanguage(index, "language", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l.charAt(0) + l.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["written", "spoken", "reading", "understanding"] as const).map(
                (skill) => (
                  <div key={skill} className="space-y-2">
                    <Label className="text-xs capitalize">{skill}</Label>
                    <Select
                      value={String(lang[skill])}
                      onValueChange={(v) =>
                        updateLanguage(index, skill, Number(v))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_LEVELS.map((level) => (
                          <SelectItem key={level} value={String(level)}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
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
