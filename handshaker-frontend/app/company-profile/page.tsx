"use client"

import React from "react"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Building2, Globe, MapPin, Phone, Loader2, Upload, X, CreditCard, Hash } from "lucide-react"
import {
  fetchCompanyProfile,
  saveCompanyProfile,
  uploadCompanyLogo,
  type CompanyProfileUpdate,
} from "@/lib/cv-api"

export default function CompanyProfilePage() {
  const { user, isLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const [companyName, setCompanyName] = useState("")
  const [industry, setIndustry] = useState("")
  const [companySize, setCompanySize] = useState("")
  const [website, setWebsite] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("")
  const [oib, setOib] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [description, setDescription] = useState("")
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)

  const [isFetching, setIsFetching] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth?mode=login")
    }
    if (!isLoading && user && user.role !== "COMPANY") {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!isLoading && user && user.role === "COMPANY") {
      fetchCompanyProfile()
        .then((profile) => {
          setCompanyName(profile.companyName || "")
          setIndustry(profile.industry || "")
          setCompanySize(profile.companySize || "")
          setWebsite(profile.website || "")
          setPhone(profile.phoneNumber || "")
          setAddress(profile.address || "")
          setCity(profile.city || "")
          setPostalCode(profile.postalCode || "")
          setCountry(profile.country || "")
          setOib(profile.oib || "")
          setBankAccount(profile.bankAccount || "")
          setDescription(profile.description || "")
          setLogoUrl(profile.logoUrl || null)
        })
        .catch((err) => {
          console.error("Failed to fetch company profile:", err)
          setError("Failed to load company profile.")
        })
        .finally(() => setIsFetching(false))
    }
  }, [isLoading, user])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingLogo(true)
    try {
      const result = await uploadCompanyLogo(file)
      setLogoUrl(result.logoUrl)
    } catch (err) {
      setError("Failed to upload logo.")
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSaved(false)

    const payload: CompanyProfileUpdate = {
      companyName,
      description,
      industry,
      companySize,
      phoneNumber: phone,
      website,
      address,
      city,
      postalCode,
      country,
      oib,
      bankAccount,
      logoUrl
    }

    try {
      await saveCompanyProfile(payload)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !user || user.role !== "COMPANY" || isFetching) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
          <span>{t("companyProfile.loadingProfile")}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="size-5" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("companyProfile.title")}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {t("companyProfile.subtitle")}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("companyProfile.basicInfo")}</CardTitle>
              <CardDescription>
                {t("companyProfile.basicInfoDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Acme Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                      <SelectItem value="MANUFACTURING">Manufacturing</SelectItem>
                      <SelectItem value="TRANSPORTATION">Transportation</SelectItem>
                      <SelectItem value="CONSTRUCTION">Construction</SelectItem>
                      <SelectItem value="HOSPITALITY">Hospitality</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                      <SelectItem value="CLEANING">Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select value={companySize} onValueChange={setCompanySize}>
                    <SelectTrigger id="companySize">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-250">51-250 employees</SelectItem>
                      <SelectItem value="250-500">250-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="oib" className="flex items-center gap-1.5">
                    <Hash className="size-3.5 text-muted-foreground" />
                    Company OIB
                  </Label>
                  <Input
                    id="oib"
                    placeholder="12345678901"
                    maxLength={11}
                    value={oib}
                    onChange={(e) => setOib(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bankAccount" className="flex items-center gap-1.5">
                    <CreditCard className="size-3.5 text-muted-foreground" />
                    Bank Account (IBAN)
                  </Label>
                  <Input
                    id="bankAccount"
                    placeholder="HR00 0000 0000 0000 0000 0"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Company Description</Label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Tell job seekers what your company does..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("companyProfile.contactInfo")}</CardTitle>
              <CardDescription>
                {t("companyProfile.contactInfoDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone" className="flex items-center gap-1.5">
                    <Phone className="size-3.5 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+385 91 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="website" className="flex items-center gap-1.5">
                  <Globe className="size-3.5 text-muted-foreground" />
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://www.acme.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("companyProfile.location")}</CardTitle>
              <CardDescription>{t("companyProfile.locationDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="address" className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-muted-foreground" />
                  Address
                </Label>
                <Input
                  id="address"
                  placeholder="123 Business St."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Zagreb"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="10000"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="Croatia"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Company Logo</CardTitle>
              <CardDescription>Upload your company logo. It will be visible to job seekers.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="flex size-24 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted overflow-hidden">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Company logo"
                      className="size-full object-contain"
                    />
                  ) : (
                    <Building2 className="size-8 text-muted-foreground" />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="logo-upload">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isUploadingLogo}
                      asChild
                    >
                      <span className="cursor-pointer">
                        {isUploadingLogo ? (
                          <><Loader2 className="mr-2 size-4 animate-spin" />Uploading...</>
                        ) : (
                          <><Upload className="mr-2 size-4" />Upload Logo</>
                        )}
                      </span>
                    </Button>
                  </label>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  {logoUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 w-fit"
                      onClick={() => setLogoUrl(null)}
                    >
                      <X className="mr-2 size-4" />
                      Remove
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">PNG, JPG or SVG. Max 2MB.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            {saved && (
              <p className="text-sm text-green-600">
                {t("companyProfile.savedSuccess")}
              </p>
            )}
            <Button type="submit" size="lg" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {t("companyProfile.saving")}
                </>
              ) : (
                t("companyProfile.saveProfile")
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
