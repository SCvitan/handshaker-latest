"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Loader2 } from "lucide-react"
import type { LegalStatus } from "@/lib/cv-types"
import { saveLegalStatus } from "@/lib/cv-api"

interface LegalStatusSectionProps {
  data: LegalStatus
  onSaved: (data: LegalStatus) => void
}

export function LegalStatusSection({
  data: initialData,
  onSaved,
}: LegalStatusSectionProps) {
  const [data, setData] = useState<LegalStatus>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSwitch = (name: keyof LegalStatus, checked: boolean) => {
    setData({ ...data, [name]: checked })
  }

  async function handleSave() {
    try {
      setIsSaving(true)
      setMessage("")
      await saveLegalStatus(data)
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
      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div>
          <Label htmlFor="p-hasWorkPermit" className="text-sm font-medium">
            Has Work Permit
          </Label>
          <p className="text-xs text-muted-foreground">
            Do you currently hold a valid work permit?
          </p>
        </div>
        <Switch
          id="p-hasWorkPermit"
          checked={data.hasCroatianWorkPermit}
          onCheckedChange={(c) => handleSwitch("hasCroatianWorkPermit", c)}
        />
      </div>

      {data.hasCroatianWorkPermit && (
        <div className="space-y-2">
          <Label htmlFor="p-workPermitExp">
            Work Permit Expiration Date
          </Label>
          <Input
            id="p-workPermitExp"
            name="workPermitExpirationDate"
            type="date"
            value={data.workPermitExpirationDate}
            onChange={handleChange}
          />
        </div>
      )}

      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div>
          <Label
            htmlFor="p-currentlyEmployed"
            className="text-sm font-medium"
          >
            Currently Employed in Croatia
          </Label>
          <p className="text-xs text-muted-foreground">
            Are you currently employed in Croatia?
          </p>
        </div>
        <Switch
          id="p-currentlyEmployed"
          checked={data.currentlyEmployedInCroatia}
          onCheckedChange={(c) =>
            handleSwitch("currentlyEmployedInCroatia", c)
          }
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="p-arrivalDate">Date of Arrival in Croatia</Label>
          <Input
            id="p-arrivalDate"
            name="dateOfArrivalInCroatia"
            type="date"
            value={data.dateOfArrivalInCroatia}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-passportExp">Passport Expiration Date</Label>
          <Input
            id="p-passportExp"
            name="passportExpirationDate"
            type="date"
            value={data.passportExpirationDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="p-oib">OIB (Personal Identification Number)</Label>
        <Input
          id="p-oib"
          name="oib"
          maxLength={11}
          value={data.oib}
          onChange={handleChange}
        />
        <p className="text-xs text-muted-foreground">
          11-digit Croatian personal identification number
        </p>
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
