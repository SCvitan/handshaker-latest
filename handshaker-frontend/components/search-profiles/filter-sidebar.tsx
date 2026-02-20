"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { User, Shield, Briefcase, Languages, MapPin, CircleCheck } from "lucide-react"
import type { SearchFilters } from "./search-profiles-view"
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  LANGUAGE_OPTIONS,
  INDUSTRIES,
} from "@/lib/cv-types"

interface FilterSidebarProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const update = (partial: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...partial })
  }

  const toggleArrayItem = (
    key: "gender" | "maritalStatus" | "experienceLevel" | "languages",
    value: string
  ) => {
    const current = filters[key] as string[]
    if (current.includes(value)) {
      update({ [key]: current.filter((v) => v !== value) })
    } else {
      update({ [key]: [...current, value] })
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <Accordion
        type="multiple"
        defaultValue={["personal", "legal", "job", "languages", "location", "completion"]}
        className="w-full"
      >
        {/* Personal Info */}
        <AccordionItem value="personal">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <User className="size-4 text-primary" />
              Personal Info
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            {/* Gender */}
            <div>
              <Label className="mb-2 block text-xs font-medium text-muted-foreground">Gender</Label>
              <div className="flex flex-col gap-2">
                {GENDER_OPTIONS.map((g) => (
                  <label key={g} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={filters.gender.includes(g)}
                      onCheckedChange={() => toggleArrayItem("gender", g)}
                    />
                    {g.charAt(0) + g.slice(1).toLowerCase()}
                  </label>
                ))}
              </div>
            </div>

            {/* Marital Status */}
            <div>
              <Label className="mb-2 block text-xs font-medium text-muted-foreground">Marital Status</Label>
              <div className="flex flex-col gap-2">
                {MARITAL_STATUS_OPTIONS.map((s) => (
                  <label key={s} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={filters.maritalStatus.includes(s)}
                      onCheckedChange={() => toggleArrayItem("maritalStatus", s)}
                    />
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </label>
                ))}
              </div>
            </div>

            {/* State of Origin */}
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">State of Origin</Label>
              <Input
                placeholder="e.g. Croatia"
                value={filters.stateOfOrigin}
                onChange={(e) => update({ stateOfOrigin: e.target.value })}
                className="h-8 text-sm"
              />
            </div>

            {/* Age Range */}
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Age Range</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.ageMin}
                  onChange={(e) =>
                    update({ ageMin: e.target.value ? Number.parseInt(e.target.value) : "" })
                  }
                  className="h-8 text-sm"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.ageMax}
                  onChange={(e) =>
                    update({ ageMax: e.target.value ? Number.parseInt(e.target.value) : "" })
                  }
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Legal Status */}
        <AccordionItem value="legal">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              Legal Status
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Work Permit</Label>
              <Select
                value={filters.hasWorkPermit}
                onValueChange={(v) => update({ hasWorkPermit: v as "any" | "yes" | "no" })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="yes">Has Work Permit</SelectItem>
                  <SelectItem value="no">No Work Permit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Currently Employed</Label>
              <Select
                value={filters.currentlyEmployed}
                onValueChange={(v) => update({ currentlyEmployed: v as "any" | "yes" | "no" })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="yes">Currently Employed</SelectItem>
                  <SelectItem value="no">Not Employed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Job Preferences */}
        <AccordionItem value="job">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <Briefcase className="size-4 text-primary" />
              Job Preferences
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Industry</Label>
              <Select
                value={filters.industry || "ALL"}
                onValueChange={(v) => update({ industry: v === "ALL" ? "" : v })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Any industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Any</SelectItem>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind.value} value={ind.value}>
                      {ind.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Position</Label>
              <Input
                placeholder="e.g. Driver"
                value={filters.position}
                onChange={(e) => update({ position: e.target.value })}
                className="h-8 text-sm"
              />
            </div>

            {/* Experience Level */}
            <div>
              <Label className="mb-2 block text-xs font-medium text-muted-foreground">Experience Level</Label>
              <div className="flex flex-col gap-2">
                {EXPERIENCE_LEVEL_OPTIONS.map((lvl) => (
                  <label key={lvl} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={filters.experienceLevel.includes(lvl)}
                      onCheckedChange={() => toggleArrayItem("experienceLevel", lvl)}
                    />
                    {lvl.replace(/_/g, " ").charAt(0) + lvl.replace(/_/g, " ").slice(1).toLowerCase()}
                  </label>
                ))}
              </div>
            </div>

            {/* Years of Experience */}
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Years of Experience</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.yearsOfExperienceMin}
                  onChange={(e) =>
                    update({
                      yearsOfExperienceMin: e.target.value ? Number.parseInt(e.target.value) : "",
                    })
                  }
                  className="h-8 text-sm"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.yearsOfExperienceMax}
                  onChange={(e) =>
                    update({
                      yearsOfExperienceMax: e.target.value ? Number.parseInt(e.target.value) : "",
                    })
                  }
                  className="h-8 text-sm"
                />
              </div>
            </div>

            {/* Expected Income */}
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Expected Monthly Income (EUR)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.incomeMin}
                  onChange={(e) =>
                    update({ incomeMin: e.target.value ? Number.parseInt(e.target.value) : "" })
                  }
                  className="h-8 text-sm"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.incomeMax}
                  onChange={(e) =>
                    update({ incomeMax: e.target.value ? Number.parseInt(e.target.value) : "" })
                  }
                  className="h-8 text-sm"
                />
              </div>
            </div>

            {/* Accommodation Provided */}
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Needs Accommodation
              </Label>
              <Select
                value={filters.accommodationProvided}
                onValueChange={(v) => update({ accommodationProvided: v as "any" | "yes" | "no" })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transportation Provided */}
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Needs Transportation
              </Label>
              <Select
                value={filters.transportationProvided}
                onValueChange={(v) => update({ transportationProvided: v as "any" | "yes" | "no" })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Languages */}
        <AccordionItem value="languages">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <Languages className="size-4 text-primary" />
              Languages
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            <div>
              <Label className="mb-2 block text-xs font-medium text-muted-foreground">
                Must speak (select multiple)
              </Label>
              <div className="flex max-h-40 flex-col gap-2 overflow-y-auto">
                {LANGUAGE_OPTIONS.map((lang) => (
                  <label key={lang} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={filters.languages.includes(lang)}
                      onCheckedChange={() => toggleArrayItem("languages", lang)}
                    />
                    {lang.charAt(0) + lang.slice(1).toLowerCase()}
                  </label>
                ))}
              </div>
            </div>
            {filters.languages.length > 0 && (
              <div>
                <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Min avg proficiency: {filters.minProficiency}/10
                </Label>
                <Slider
                  value={[filters.minProficiency]}
                  onValueChange={([val]) => update({ minProficiency: val })}
                  min={1}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Location */}
        <AccordionItem value="location">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              Location
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">City</Label>
              <Input
                placeholder="e.g. Zagreb"
                value={filters.city}
                onChange={(e) => update({ city: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Profile Completion */}
        <AccordionItem value="completion" className="border-b-0">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <CircleCheck className="size-4 text-primary" />
              Profile Completion
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Minimum completion: {filters.minProfileCompletion}%
              </Label>
              <Slider
                value={[filters.minProfileCompletion]}
                onValueChange={([val]) => update({ minProfileCompletion: val })}
                min={0}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
