"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Save, Loader2, Plus, Trash2 } from "lucide-react"
import type { Language } from "@/lib/cv-types"
import { LANGUAGE_OPTIONS } from "@/lib/cv-types"
import { saveLanguages } from "@/lib/cv-api"

interface LanguagesSectionProps {
  data: Language[]
  onSaved: (data: Language[]) => void
}

const SKILL_LEVELS = Array.from({ length: 10 }, (_, i) => i + 1)

export function LanguagesSection({
  data: initialData,
  onSaved,
}: LanguagesSectionProps) {
  const [data, setData] = useState<Language[]>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const addLanguage = () => {
    setData([
      ...data,
      { language: "", written: 1, spoken: 1, reading: 1, understanding: 1 },
    ])
  }

  const removeLanguage = (index: number) => {
    setData(data.filter((_, i) => i !== index))
  }

  const updateLanguage = (
    index: number,
    field: keyof Language,
    value: string | number
  ) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    setData(updated)
  }

  async function handleSave() {
    try {
      setIsSaving(true)
      setMessage("")
      await saveLanguages(data)
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Rate your proficiency from 1 to 10
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={addLanguage}
          className="gap-2 bg-transparent"
        >
          <Plus className="size-4" />
          Add
        </Button>
      </div>

      <div className="space-y-4">
        {data.map((lang, index) => (
          <div
            key={index}
            className="rounded-lg border border-border p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-card-foreground">
                Language {index + 1}
              </span>
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
              <Label>Language</Label>
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
