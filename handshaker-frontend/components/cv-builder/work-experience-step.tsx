"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Briefcase,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react"
import type { WorkExperience } from "@/lib/cv-types"
import { YEARS_EXPERIENCE_OPTIONS } from "@/lib/cv-types"

interface WorkExperienceStepProps {
  data: WorkExperience[]
  onUpdate: (data: WorkExperience[]) => void
  onNext: () => void
  onBack: () => void
  onSaveAndHome: () => void
  isSaving: boolean
}

const EMPTY_EXPERIENCE: WorkExperience = {
  companyName: "",
  position: "",
  shortDescription: "",
  yearsOfExperience: "",
}

export function WorkExperienceStep({
  data,
  onUpdate,
  onNext,
  onBack,
  onSaveAndHome,
  isSaving,
}: WorkExperienceStepProps) {
  const addExperience = () => {
    onUpdate([...data, { ...EMPTY_EXPERIENCE }])
  }

  const removeExperience = (index: number) => {
    onUpdate(data.filter((_, i) => i !== index))
  }

  const updateExperience = (index: number, field: keyof WorkExperience, value: string) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onUpdate(updated)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">
          Work Experience in Croatia
        </h2>
        <p className="text-sm text-muted-foreground">
          Add your previous work experience in Croatia. This helps employers understand your background.
        </p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="size-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Croatian Work Experience Only
            </p>
            <p className="text-sm text-amber-700">
              Please list only your work experience in Croatia. If you have no previous work experience in Croatia, you can skip this step.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
            <Briefcase className="mx-auto size-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              No work experience added yet. Click the button below to add your first job.
            </p>
            <Button onClick={addExperience} variant="outline" className="gap-2">
              <Plus className="size-4" />
              Add Work Experience
            </Button>
          </div>
        ) : (
          <>
            {data.map((exp, index) => (
              <Card key={index} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Briefcase className="size-4 text-muted-foreground" />
                      Experience {index + 1}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`company-${index}`}>Company Name *</Label>
                      <Input
                        id={`company-${index}`}
                        placeholder="ABC Company d.o.o."
                        value={exp.companyName}
                        onChange={(e) => updateExperience(index, "companyName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`position-${index}`}>Role / Position *</Label>
                      <Input
                        id={`position-${index}`}
                        placeholder="Warehouse Worker"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, "position", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`years-${index}`}>Years of Experience *</Label>
                    <Select
                      value={exp.yearsOfExperience}
                      onValueChange={(v) => updateExperience(index, "yearsOfExperience", v)}
                    >
                      <SelectTrigger id={`years-${index}`}>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {YEARS_EXPERIENCE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`desc-${index}`}>Short Description</Label>
                    <Textarea
                      id={`desc-${index}`}
                      placeholder="Briefly describe your responsibilities and achievements..."
                      value={exp.shortDescription}
                      onChange={(e) => updateExperience(index, "shortDescription", e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button onClick={addExperience} variant="outline" className="w-full gap-2">
              <Plus className="size-4" />
              Add Another Experience
            </Button>
          </>
        )}
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
