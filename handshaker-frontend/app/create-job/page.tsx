"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Home,
  Car,
  ArrowLeft,
  Loader2,
  Check,
} from "lucide-react"
import { createJobAd, updateJobAd, fetchCompanyJobs } from "@/lib/cv-api"
import { INDUSTRIES, POSITION_OPTIONS, COUNTRIES, WORK_TYPE_OPTIONS } from "@/lib/cv-types"
import type { JobAdCreate } from "@/lib/cv-types"

export default function CreateJobPage() {
  return (
    <Suspense
      fallback={
        <>
          
          <div className="flex min-h-[80vh] items-center justify-center">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
              <span>Loading...</span>
            </div>
          </div>
        </>
      }
    >
      <CreateJobContent />
    </Suspense>
  )
}

function CreateJobContent() {
  const { user, isLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")

  // Form state
  const [industry, setIndustry] = useState("")
  const [position, setPosition] = useState("")
  const [description, setDescription] = useState("")
  const [street, setStreet] = useState("")
  const [streetNumber, setStreetNumber] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("")
  const [workType, setWorkType] = useState<"FULL_TIME" | "PART_TIME" | "SEASONAL">("FULL_TIME")
  const [salaryType, setSalaryType] = useState<"MONTHLY" | "HOURLY">("MONTHLY")
  const [salaryAmount, setSalaryAmount] = useState<number | "">("")
  const [workingHoursPerDay, setWorkingHoursPerDay] = useState<number | "">("")
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState<number | "">("")
  const [accommodationProvided, setAccommodationProvided] = useState(false)
  const [transportationProvided, setTransportationProvided] = useState(false)

  const [isFetching, setIsFetching] = useState(!!editId)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  // Load job data if editing
  useEffect(() => {
    if (editId && !isLoading && user?.role === "COMPANY") {
      fetchCompanyJobs()
        .then((jobs) => {
          const job = jobs.find((j) => j.id === editId)
          if (job) {
            setIndustry(job.industry)
            setPosition(job.position)
            setDescription(job.description || "")
            setStreet(job.location.street)
            setStreetNumber(job.location.streetNumber)
            setCity(job.location.city)
            setPostalCode(job.location.postalCode)
            setCountry(job.location.country)
            setWorkType(job.workType)
            setSalaryType(job.salaryType)
            setSalaryAmount(job.salaryAmount)
            setWorkingHoursPerDay(job.workingHoursPerDay)
            setWorkingDaysPerMonth(job.workingDaysPerMonth)
            setAccommodationProvided(job.accommodationProvided)
            setTransportationProvided(job.transportationProvided)
          }
        })
        .catch(console.error)
        .finally(() => setIsFetching(false))
    }
  }, [editId, isLoading, user])

  // Reset position when industry changes
  useEffect(() => {
    if (!editId) {
      setPosition("")
    }
  }, [industry, editId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSaved(false)

    const payload: JobAdCreate = {
      industry,
      position,
      description,
      workType,
      location: {
        street,
        streetNumber,
        city,
        postalCode,
        country,
      },
      salaryType,
      salaryAmount: Number(salaryAmount),
      workingHoursPerDay: Number(workingHoursPerDay),
      workingDaysPerMonth: Number(workingDaysPerMonth),
      accommodationProvided,
      transportationProvided,
    }

    try {
      if (editId) {
        await updateJobAd(editId, payload)
      } else {
        await createJobAd(payload)
      }
      setSaved(true)
      setTimeout(() => {
        router.push("/my-jobs")
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save job ad.")
    } finally {
      setIsSaving(false)
    }
  }

  const isValid =
    industry &&
    position &&
    city &&
    country &&
    salaryAmount &&
    workingHoursPerDay &&
    workingDaysPerMonth

  if (isLoading || !user || user.role !== "COMPANY" || isFetching) {
    return (
      <>
        
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      
      <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/my-jobs")}
              className="mb-4 -ml-2"
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to My Jobs
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              {editId ? "Edit Job Ad" : "Create Job Ad"}
            </h1>
            <p className="text-muted-foreground">
              {editId
                ? "Update your job posting details"
                : "Fill in the details to create a new job posting"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Industry & Position */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="size-5 text-primary" />
                  Job Details
                </CardTitle>
                <CardDescription>
                  Select the industry and position for this job
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger id="industry">
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
                    <Label htmlFor="position">Position *</Label>
                    {industry ? (
                      <Select value={position} onValueChange={setPosition}>
                        <SelectTrigger id="position">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          {(
                            POSITION_OPTIONS[industry as keyof typeof POSITION_OPTIONS] || []
                          ).map((pos) => (
                            <SelectItem key={pos} value={pos}>
                              {pos}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="text-sm text-muted-foreground p-2 rounded border border-dashed h-10 flex items-center">
                        Select an industry first
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Work Type *</Label>
                  <RadioGroup
                    value={workType}
                    onValueChange={(v) => setWorkType(v as "FULL_TIME" | "PART_TIME" | "SEASONAL")}
                    className="flex flex-wrap gap-4"
                  >
                    {WORK_TYPE_OPTIONS.map((opt) => (
                      <div key={opt.value} className="flex items-center gap-2">
                        <RadioGroupItem value={opt.value} id={`work-type-${opt.value}`} />
                        <Label
                          htmlFor={`work-type-${opt.value}`}
                          className="font-normal cursor-pointer"
                        >
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the job responsibilities, requirements, and benefits..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="size-5 text-primary" />
                  Work Location
                </CardTitle>
                <CardDescription>
                  Where will the employee be working?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street</Label>
                    <Input
                      id="street"
                      placeholder="Main Street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="streetNumber">Street Number</Label>
                    <Input
                      id="streetNumber"
                      placeholder="123"
                      value={streetNumber}
                      onChange={(e) => setStreetNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Zagreb"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="10000"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Salary & Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="size-5 text-primary" />
                  Compensation & Schedule
                </CardTitle>
                <CardDescription>
                  Set the salary and working hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Salary Type *</Label>
                    <RadioGroup
                      value={salaryType}
                      onValueChange={(v) => setSalaryType(v as "MONTHLY" | "HOURLY")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="MONTHLY" id="salary-monthly" />
                        <Label htmlFor="salary-monthly" className="font-normal cursor-pointer">
                          Monthly
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="HOURLY" id="salary-hourly" />
                        <Label htmlFor="salary-hourly" className="font-normal cursor-pointer">
                          Hourly
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryAmount">
                      {salaryType === "MONTHLY" ? "Monthly Salary (EUR) *" : "Hourly Rate (EUR) *"}
                    </Label>
                    <Input
                      id="salaryAmount"
                      type="number"
                      min={0}
                      placeholder={salaryType === "MONTHLY" ? "2000" : "12"}
                      value={salaryAmount}
                      onChange={(e) =>
                        setSalaryAmount(e.target.value === "" ? "" : Number(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workingHoursPerDay" className="flex items-center gap-2">
                      <Clock className="size-4 text-muted-foreground" />
                      Working Hours / Day *
                    </Label>
                    <Input
                      id="workingHoursPerDay"
                      type="number"
                      min={1}
                      max={24}
                      placeholder="8"
                      value={workingHoursPerDay}
                      onChange={(e) =>
                        setWorkingHoursPerDay(e.target.value === "" ? "" : Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workingDaysPerMonth" className="flex items-center gap-2">
                      <Clock className="size-4 text-muted-foreground" />
                      Working Days / Month *
                    </Label>
                    <Input
                      id="workingDaysPerMonth"
                      type="number"
                      min={1}
                      max={31}
                      placeholder="22"
                      value={workingDaysPerMonth}
                      onChange={(e) =>
                        setWorkingDaysPerMonth(e.target.value === "" ? "" : Number(e.target.value))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Benefits Provided</CardTitle>
                <CardDescription>
                  What benefits does this position offer?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <Home className="size-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="accommodation" className="text-sm font-medium">
                          Accommodation
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Housing provided by employer
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="accommodation"
                      checked={accommodationProvided}
                      onCheckedChange={setAccommodationProvided}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <Car className="size-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="transportation" className="text-sm font-medium">
                          Transportation
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Transport to/from work provided
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="transportation"
                      checked={transportationProvided}
                      onCheckedChange={setTransportationProvided}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between">
              {error && <p className="text-sm text-destructive">{error}</p>}
              {saved && (
                <p className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="size-4" />
                  {editId ? "Job updated successfully!" : "Job created successfully!"}
                </p>
              )}
              {!error && !saved && <div />}
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/my-jobs")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!isValid || isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : editId ? (
                    "Update Job"
                  ) : (
                    "Create Job"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
