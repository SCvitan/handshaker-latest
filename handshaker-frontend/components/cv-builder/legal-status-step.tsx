"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, Home, Shield, Calendar, AlertCircle } from "lucide-react"
import type { LegalStatus } from "@/lib/cv-types"

interface LegalStatusStepProps {
  data: LegalStatus
  onUpdate: (data: LegalStatus) => void
  onNext: () => void
  onBack: () => void
  onSaveAndHome: () => void
  isSaving: boolean
}

export function LegalStatusStep({
  data,
  onUpdate,
  onNext,
  onBack,
  onSaveAndHome,
  isSaving,
}: LegalStatusStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const today = new Date().toISOString().split("T")[0]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const dateFields = ["workPermitExpirationDate", "dateOfArrivalInCroatia", "passportExpirationDate"]
    
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: "" }))

    if (dateFields.includes(name)) {
      onUpdate({ ...data, [name]: value === "" ? null : value })
    } else if (name === "oib") {
      // Only allow digits
      const digits = value.replace(/\D/g, "").slice(0, 11)
      onUpdate({ ...data, [name]: digits })
    } else {
      onUpdate({ ...data, [name]: value })
    }
  }

  const handleSwitch = (name: keyof LegalStatus, checked: boolean) => {
    setErrors((prev) => ({ ...prev, [name]: "" }))
    if (name === "hasCroatianWorkPermit" && !checked) {
      // Reset expiration fields when turning off work permit
      onUpdate({ 
        ...data, 
        [name]: checked,
        workPermitExpirationDate: null,
        workPermitNoExpiration: false 
      })
    } else {
      onUpdate({ ...data, [name]: checked })
    }
  }

  const handleNoExpirationChange = (checked: boolean) => {
    onUpdate({ 
      ...data, 
      workPermitNoExpiration: checked,
      workPermitExpirationDate: checked ? null : data.workPermitExpirationDate
    })
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Work permit expiration cannot be in the past
    if (data.hasCroatianWorkPermit && !data.workPermitNoExpiration && data.workPermitExpirationDate) {
      if (data.workPermitExpirationDate < today) {
        newErrors.workPermitExpirationDate = "Expiration date cannot be in the past"
      }
    }

    // Date of arrival cannot be in the future
    if (data.dateOfArrivalInCroatia && data.dateOfArrivalInCroatia > today) {
      newErrors.dateOfArrivalInCroatia = "Arrival date cannot be in the future"
    }

    // OIB must be exactly 11 digits
    if (data.oib && data.oib.length !== 11) {
      newErrors.oib = "OIB must be exactly 11 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">
          Legal Status
        </h2>
        <p className="text-sm text-muted-foreground">
          Work permits, employment status, and identification
        </p>
      </div>

      <div className="grid gap-5">
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <Shield className="size-5 text-muted-foreground" />
            <div>
              <Label htmlFor="hasCroatianWorkPermit" className="text-sm font-medium">
                Has Work Permit
              </Label>
              <p className="text-xs text-muted-foreground">
                Do you currently hold a valid work permit?
              </p>
            </div>
          </div>
          <Switch
            id="hasCroatianWorkPermit"
            checked={data.hasCroatianWorkPermit}
            onCheckedChange={(c) => handleSwitch("hasCroatianWorkPermit", c)}
          />
        </div>

        {data.hasCroatianWorkPermit && (
          <div className="space-y-3 pl-4 border-l-2 border-primary/20">
            <div className="flex items-center gap-2">
              <Checkbox
                id="workPermitNoExpiration"
                checked={data.workPermitNoExpiration}
                onCheckedChange={handleNoExpirationChange}
              />
              <Label htmlFor="workPermitNoExpiration" className="text-sm font-normal cursor-pointer">
                No expiration date (Croatian origin / permanent permit)
              </Label>
            </div>

            {!data.workPermitNoExpiration && (
              <div className="space-y-2">
                <Label
                  htmlFor="workPermitExpirationDate"
                  className="flex items-center gap-2"
                >
                  <Calendar className="size-4 text-muted-foreground" />
                  Work Permit Expiration Date
                </Label>
                <Input
                  id="workPermitExpirationDate"
                  name="workPermitExpirationDate"
                  type="date"
                  min={today}
                  value={data.workPermitExpirationDate ?? ""}
                  onChange={handleChange}
                  className={errors.workPermitExpirationDate ? "border-destructive" : ""}
                />
                {errors.workPermitExpirationDate && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {errors.workPermitExpirationDate}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <Shield className="size-5 text-muted-foreground" />
            <div>
              <Label
                htmlFor="currentlyEmployedInCroatia"
                className="text-sm font-medium"
              >
                Currently Employed in Croatia
              </Label>
              <p className="text-xs text-muted-foreground">
                Are you currently employed in Croatia?
              </p>
            </div>
          </div>
          <Switch
            id="currentlyEmployedInCroatia"
            checked={data.currentlyEmployedInCroatia}
            onCheckedChange={(c) =>
              handleSwitch("currentlyEmployedInCroatia", c)
            }
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="dateOfArrivalInCroatia"
              className="flex items-center gap-2"
            >
              <Calendar className="size-4 text-muted-foreground" />
              Date of Arrival in Croatia
            </Label>
            <p className="text-xs text-muted-foreground">
                Leave empty if you are from Croatia
              </p>
            <Input
              id="dateOfArrivalInCroatia"
              name="dateOfArrivalInCroatia"
              type="date"
              max={today}
              value={data.dateOfArrivalInCroatia ?? ""}
              onChange={handleChange}
              className={errors.dateOfArrivalInCroatia ? "border-destructive" : ""}
            />
            {errors.dateOfArrivalInCroatia && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="size-3" />
                {errors.dateOfArrivalInCroatia}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="passportExpirationDate"
              className="flex items-center gap-2"
            >
              <Calendar className="size-4 text-muted-foreground" />
              Passport Expiration Date
            </Label>
            <p className="text-xs text-muted-foreground">
                Skip this if you are from Croatia
              </p>
            <Input
              id="passportExpirationDate"
              name="passportExpirationDate"
              type="date"
              value={data.passportExpirationDate ?? ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="oib" className="flex items-center gap-2">
            OIB (Personal Identification Number)
          </Label>
          <Input
            id="oib"
            name="oib"
            placeholder="12345678901"
            maxLength={11}
            value={data.oib}
            onChange={handleChange}
            className={errors.oib ? "border-destructive" : ""}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              11-digit Croatian personal identification number
            </p>
            {data.oib && (
              <p className={`text-xs ${data.oib.length === 11 ? "text-green-600" : "text-muted-foreground"}`}>
                {data.oib.length}/11 digits
              </p>
            )}
          </div>
          {errors.oib && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="size-3" />
              {errors.oib}
            </p>
          )}
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
        <Button onClick={handleNext} disabled={isSaving} className="gap-2">
          {isSaving ? "Saving..." : "Continue"}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
