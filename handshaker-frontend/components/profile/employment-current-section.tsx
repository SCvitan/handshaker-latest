"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { EmploymentCurrent } from "@/lib/cv-types"
import { INDUSTRIES } from "@/lib/cv-types"
import { saveEmploymentCurrent } from "@/lib/cv-api"

interface EmploymentCurrentSectionProps {
  data: EmploymentCurrent
  onSaved: (data: EmploymentCurrent) => void
}

export function EmploymentCurrentSection({
  data: initialData,
  onSaved,
}: EmploymentCurrentSectionProps) {
  const [data, setData] = useState<EmploymentCurrent>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "numberOfPreviousEmployersInCroatia") {
      setData({ ...data, [name]: value === "" ? "" : Number(value) })
    } else {
      setData({ ...data, [name]: value })
    }
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      workAddress: { ...data.workAddress, [e.target.name]: e.target.value },
    })
  }

  async function handleSave() {
    try {
      setIsSaving(true)
      setMessage("")
      await saveEmploymentCurrent(data)
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
          <Label htmlFor="ps-ec-industry">Industry</Label>
          <Select
            value={data.industry}
            onValueChange={(v) => setData({ ...data, industry: v })}
          >
            <SelectTrigger id="ps-ec-industry">
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
          <Label htmlFor="ps-ec-jobTitle">Job Title in Croatia</Label>
          <Input
            id="ps-ec-jobTitle"
            name="jobTitleInCroatia"
            value={data.jobTitleInCroatia}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ps-ec-employerName">Employer Name</Label>
          <Input
            id="ps-ec-employerName"
            name="employerName"
            value={data.employerName}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ps-ec-employerAddress">Employer Address</Label>
          <Input
            id="ps-ec-employerAddress"
            name="employerAddress"
            value={data.employerAddress}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ps-ec-contact">Employer Contact Info</Label>
          <Input
            id="ps-ec-contact"
            name="employerContactInfo"
            value={data.employerContactInfo}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ps-ec-city">City of Work</Label>
          <Input
            id="ps-ec-city"
            name="cityOfWork"
            value={data.cityOfWork}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ps-ec-prevEmployers">
          Number of Previous Employers in Croatia
        </Label>
        <Input
          id="ps-ec-prevEmployers"
          name="numberOfPreviousEmployersInCroatia"
          type="number"
          min={0}
          value={data.numberOfPreviousEmployersInCroatia}
          onChange={handleChange}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-3">Work Address</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ps-ec-wa-street">Street</Label>
            <Input
              id="ps-ec-wa-street"
              name="street"
              value={data.workAddress.street}
              onChange={handleAddressChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ps-ec-wa-house">House Number</Label>
            <Input
              id="ps-ec-wa-house"
              name="houseNumber"
              value={data.workAddress.houseNumber}
              onChange={handleAddressChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ps-ec-wa-city">City</Label>
            <Input
              id="ps-ec-wa-city"
              name="city"
              value={data.workAddress.city}
              onChange={handleAddressChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ps-ec-wa-postal">Postal Code</Label>
            <Input
              id="ps-ec-wa-postal"
              name="postalCode"
              value={data.workAddress.postalCode}
              onChange={handleAddressChange}
            />
          </div>
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
