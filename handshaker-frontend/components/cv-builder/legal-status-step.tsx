"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, ArrowRight, Home, Shield, Calendar } from "lucide-react"
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...data, [e.target.name]: e.target.value })
  }

  const handleSwitch = (name: keyof LegalStatus, checked: boolean) => {
    onUpdate({ ...data, [name]: checked })
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
              value={data.workPermitExpirationDate}
              onChange={handleChange}
            />
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
            <Input
              id="dateOfArrivalInCroatia"
              name="dateOfArrivalInCroatia"
              type="date"
              value={data.dateOfArrivalInCroatia}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="passportExpirationDate"
              className="flex items-center gap-2"
            >
              <Calendar className="size-4 text-muted-foreground" />
              Passport Expiration Date
            </Label>
            <Input
              id="passportExpirationDate"
              name="passportExpirationDate"
              type="date"
              value={data.passportExpirationDate}
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
            placeholder="11-number unique ID number"
            maxLength={11}
            minLength={11}
            value={data.oib}
            onChange={handleChange}
          />
          <p className="text-xs text-muted-foreground">
            11-digit Croatian personal identification number
          </p>
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
        <Button onClick={onNext} disabled={isSaving} className="gap-2">
          {isSaving ? "Saving..." : "Continue"}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
