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
import { Save, Loader2 } from "lucide-react"
import type { PersonalInfo } from "@/lib/cv-types"
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS } from "@/lib/cv-types"
import { savePersonalInfo } from "@/lib/cv-api"

interface PersonalInfoSectionProps {
  data: PersonalInfo
  onSaved: (data: PersonalInfo) => void
}

export function PersonalInfoSection({
  data: initialData,
  onSaved,
}: PersonalInfoSectionProps) {
  const [data, setData] = useState<PersonalInfo>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "numberOfChildren") {
      setData({ ...data, [name]: value === "" ? "" : Number(value) })
    } else {
      setData({ ...data, [name]: value })
    }
  }

  const handleSelect = (name: keyof PersonalInfo, value: string) => {
    setData({ ...data, [name]: value })
  }

  async function handleSave() {
    try {
      setIsSaving(true)
      setMessage("")
      await savePersonalInfo(data)
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
          <Label htmlFor="p-firstName">First Name</Label>
          <Input
            id="p-firstName"
            name="firstName"
            value={data.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-lastName">Last Name</Label>
          <Input
            id="p-lastName"
            name="lastName"
            value={data.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="p-dateOfBirth">Date of Birth</Label>
          <Input
            id="p-dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={data.dateOfBirth}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
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
          <Label htmlFor="p-stateOfOrigin">State of Origin</Label>
          <Input
            id="p-stateOfOrigin"
            name="stateOfOrigin"
            value={data.stateOfOrigin}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-mobilePhone">Mobile Phone</Label>
          <Input
            id="p-mobilePhone"
            name="mobilePhone"
            type="tel"
            value={data.mobilePhoneNumber}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Marital Status</Label>
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
          <Label htmlFor="p-numberOfChildren">Number of Children</Label>
          <Input
            id="p-numberOfChildren"
            name="numberOfChildren"
            type="number"
            min={0}
            value={data.numberOfChildren}
            onChange={handleChange}
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
