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
import { ArrowRight, Home, User, Phone, Globe, Calendar } from "lucide-react"
import type { PersonalInfo } from "@/lib/cv-types"
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS } from "@/lib/cv-types"

interface PersonalInfoStepProps {
  data: PersonalInfo
  onUpdate: (data: PersonalInfo) => void
  onNext: () => void
  onSaveAndHome: () => void
  isSaving: boolean
}

export function PersonalInfoStep({
  data,
  onUpdate,
  onNext,
  onSaveAndHome,
  isSaving,
}: PersonalInfoStepProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    if (name === "numberOfChildren") {
      onUpdate({ ...data, [name]: value === "" ? "" : Number(value) })
    } else {
      onUpdate({ ...data, [name]: value })
    }
  }

  const handleSelect = (name: keyof PersonalInfo, value: string) => {
    onUpdate({ ...data, [name]: value })
  }

  const isValid = data.firstName && data.lastName && data.dateOfBirth && data.gender && data.mobilePhoneNumber

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">
          Personal Information
        </h2>
        <p className="text-sm text-muted-foreground">
          Basic details about yourself
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              First Name *
            </Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Sime"
              value={data.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              Last Name *
            </Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Cvitan"
              value={data.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              Date of Birth *
            </Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={data.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">Gender *</Label>
            <Select
              value={data.gender}
              onValueChange={(v) => handleSelect("gender", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g.charAt(0) + g.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stateOfOrigin" className="flex items-center gap-2">
              <Globe className="size-4 text-muted-foreground" />
              State of Origin
            </Label>
            <Input
              id="stateOfOrigin"
              name="stateOfOrigin"
              placeholder="Croatia"
              value={data.stateOfOrigin}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobilePhoneNumber" className="flex items-center gap-2">
              <Phone className="size-4 text-muted-foreground" />
              Mobile Phone *
            </Label>
            <Input
              id="mobilePhoneNumber"
              name="mobilePhoneNumber"
              type="tel"
              placeholder="0914508995"
              value={data.mobilePhoneNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">Marital Status</Label>
            <Select
              value={data.maritalStatus}
              onValueChange={(v) => handleSelect("maritalStatus", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {MARITAL_STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="numberOfChildren">Number of Children</Label>
            <Input
              id="numberOfChildren"
              name="numberOfChildren"
              type="number"
              min={0}
              placeholder="0"
              value={data.numberOfChildren}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onSaveAndHome}
          disabled={isSaving}
          className="gap-2 bg-transparent"
        >
          <Home className="size-4" />
          {isSaving ? "Saving..." : "Save & Return Home"}
        </Button>
        <Button onClick={onNext} disabled={!isValid || isSaving} className="gap-2">
          {isSaving ? "Saving..." : "Continue"}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
