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
import { ArrowLeft, Home, MapPin, Building, Save } from "lucide-react"
import type { Accommodation } from "@/lib/cv-types"
import {
  ACCOMMODATION_PROVIDER_OPTIONS,
  ACCOMMODATION_TYPE_OPTIONS,
  PEOPLE_COUNT_OPTIONS,
} from "@/lib/cv-types"

interface AccommodationStepProps {
  data: Accommodation
  onUpdate: (data: Accommodation) => void
  onBack: () => void
  onSaveAndHome: () => void
  onFinish: () => void
  isSaving: boolean
}

export function AccommodationStep({
  data,
  onUpdate,
  onBack,
  onSaveAndHome,
  onFinish,
  isSaving,
}: AccommodationStepProps) {
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...data,
      address: { ...data.address, [e.target.name]: e.target.value },
    })
  }

  const handleSelect = (name: keyof Accommodation, value: string) => {
    onUpdate({ ...data, [name]: value })
  }

  const formatOption = (opt: string) =>
    opt
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">
          Accommodation
        </h2>
        <p className="text-sm text-muted-foreground">
          Your current living arrangement details
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground" />
            Address
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                name="street"
                placeholder="Ilica"
                value={data.address.street}
                onChange={handleAddressChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="houseNumber">House Number</Label>
              <Input
                id="houseNumber"
                name="houseNumber"
                placeholder="15A"
                value={data.address.houseNumber}
                onChange={handleAddressChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="Zagreb"
                value={data.address.city}
                onChange={handleAddressChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                placeholder="10000"
                value={data.address.postalCode}
                onChange={handleAddressChange}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Building className="size-4 text-muted-foreground" />
            Accommodation Details
          </h3>
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
        <Button onClick={onFinish} disabled={isSaving} className="gap-2">
          <Save className="size-4" />
          {isSaving ? "Saving..." : "Save & Finish"}
        </Button>
      </div>
    </div>
  )
}
