"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Home, MapPin, Briefcase, Save } from "lucide-react"
import type { EmploymentCurrent } from "@/lib/cv-types"

interface EmploymentCurrentStepProps {
  data: EmploymentCurrent
  onUpdate: (data: EmploymentCurrent) => void
  onBack: () => void
  onSaveAndHome: () => void
  onFinish: () => void
  isSaving: boolean
}

export function EmploymentCurrentStep({
  data,
  onUpdate,
  onBack,
  onSaveAndHome,
  onFinish,
  isSaving,
}: EmploymentCurrentStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "numberOfPreviousEmployersInCroatia") {
      onUpdate({ ...data, [name]: value === "" ? "" : Number(value) })
    } else {
      onUpdate({ ...data, [name]: value })
    }
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...data,
      workAddress: { ...data.workAddress, [e.target.name]: e.target.value },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">
          Current Work Details
        </h2>
        <p className="text-sm text-muted-foreground">
          Information about your current employment in Croatia
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Briefcase className="size-4 text-muted-foreground" />
            Employment Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ec-industry">Industry</Label>
              <Input
                id="ec-industry"
                name="industry"
                placeholder="Transportation"
                value={data.industry}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ec-jobTitle">Job Title in Croatia</Label>
              <Input
                id="ec-jobTitle"
                name="jobTitleInCroatia"
                placeholder="Driver"
                value={data.jobTitleInCroatia}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ec-employerName">Employer Name</Label>
              <Input
                id="ec-employerName"
                name="employerName"
                placeholder="Company Ltd."
                value={data.employerName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ec-employerAddress">Employer Address</Label>
              <Input
                id="ec-employerAddress"
                name="employerAddress"
                placeholder="Ulica 3"
                value={data.employerAddress}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ec-employerContact">Employer Contact Info</Label>
              <Input
                id="ec-employerContact"
                name="employerContactInfo"
                placeholder="contact@company.com"
                value={data.employerContactInfo}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ec-cityOfWork">City of Work</Label>
              <Input
                id="ec-cityOfWork"
                name="cityOfWork"
                placeholder="Zagreb"
                value={data.cityOfWork}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="ec-prevEmployers">
                Number of Previous Employers in Croatia
              </Label>
              <Input
                id="ec-prevEmployers"
                name="numberOfPreviousEmployersInCroatia"
                type="number"
                min={0}
                placeholder="0"
                value={data.numberOfPreviousEmployersInCroatia}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground" />
            Work Address
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ec-street">Street</Label>
              <Input
                id="ec-street"
                name="street"
                placeholder="Ilica"
                value={data.workAddress.street}
                onChange={handleAddressChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ec-houseNumber">House Number</Label>
              <Input
                id="ec-houseNumber"
                name="houseNumber"
                placeholder="15A"
                value={data.workAddress.houseNumber}
                onChange={handleAddressChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ec-city">City</Label>
              <Input
                id="ec-city"
                name="city"
                placeholder="Zagreb"
                value={data.workAddress.city}
                onChange={handleAddressChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ec-postalCode">Postal Code</Label>
              <Input
                id="ec-postalCode"
                name="postalCode"
                placeholder="10000"
                value={data.workAddress.postalCode}
                onChange={handleAddressChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack} className="gap-2 bg-transparent">
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
        <Button onClick={onFinish} disabled={isSaving} className="gap-2">
          <Save className="size-4" />
          {isSaving ? "Saving..." : "Save & Finish"}
        </Button>
      </div>
    </div>
  )
}
