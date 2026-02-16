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
import type { Accommodation } from "@/lib/cv-types"
import {
  ACCOMMODATION_PROVIDER_OPTIONS,
  ACCOMMODATION_TYPE_OPTIONS,
  PEOPLE_COUNT_OPTIONS,
} from "@/lib/cv-types"
import { saveAccommodation } from "@/lib/cv-api"

interface AccommodationSectionProps {
  data: Accommodation
  onSaved: (data: Accommodation) => void
}

export function AccommodationSection({
  data: initialData,
  onSaved,
}: AccommodationSectionProps) {
  const [data, setData] = useState<Accommodation>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      address: { ...data.address, [e.target.name]: e.target.value },
    })
  }

  const handleSelect = (name: keyof Accommodation, value: string) => {
    setData({ ...data, [name]: value })
  }

  const formatOption = (opt: string) =>
    opt
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ")

  async function handleSave() {
    try {
      setIsSaving(true)
      setMessage("")
      await saveAccommodation(data)
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
    <div className="space-y-5">
      <div>
        <h4 className="text-sm font-semibold text-card-foreground mb-3">
          Address
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="p-street">Street</Label>
            <Input
              id="p-street"
              name="street"
              value={data.address.street}
              onChange={handleAddressChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-houseNumber">House Number</Label>
            <Input
              id="p-houseNumber"
              name="houseNumber"
              value={data.address.houseNumber}
              onChange={handleAddressChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-city">City</Label>
            <Input
              id="p-city"
              name="city"
              value={data.address.city}
              onChange={handleAddressChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-postalCode">Postal Code</Label>
            <Input
              id="p-postalCode"
              name="postalCode"
              value={data.address.postalCode}
              onChange={handleAddressChange}
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-card-foreground mb-3">
          Accommodation Details
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select
              value={data.provider}
              onValueChange={(v) => handleSelect("provider", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {ACCOMMODATION_PROVIDER_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {formatOption(opt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={data.type}
              onValueChange={(v) => handleSelect("type", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {ACCOMMODATION_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {formatOption(opt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>People in Accommodation</Label>
            <Select
              value={data.peopleInAccommodation}
              onValueChange={(v) =>
                handleSelect("peopleInAccommodation", v)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                {PEOPLE_COUNT_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {formatOption(opt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>People in Room</Label>
            <Select
              value={data.peopleInRoom}
              onValueChange={(v) => handleSelect("peopleInRoom", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                {PEOPLE_COUNT_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {formatOption(opt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
