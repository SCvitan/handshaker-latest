"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, SlidersHorizontal, X, Users, MapPin, Briefcase, Clock, Languages, Shield } from "lucide-react"
import { FilterSidebar } from "./filter-sidebar"
import { ProfileCard } from "./profile-card"
import { ProfileDetailSheet } from "./profile-detail-sheet"
import type { UserProfile } from "@/lib/cv-types"
import {
  GENDER_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/lib/cv-types"

export interface SearchFilters {
  searchQuery: string
  // Personal
  gender: string[]
  maritalStatus: string[]
  stateOfOrigin: string
  ageMin: number | ""
  ageMax: number | ""
  // Legal
  hasWorkPermit: "any" | "yes" | "no"
  currentlyEmployed: "any" | "yes" | "no"
  // Job Preferences
  industry: string
  position: string
  experienceLevel: string[]
  yearsOfExperienceMin: number | ""
  yearsOfExperienceMax: number | ""
  incomeMin: number | ""
  incomeMax: number | ""
  accommodationProvided: "any" | "yes" | "no"
  transportationProvided: "any" | "yes" | "no"
  // Languages
  languages: string[]
  minProficiency: number
  // Location
  city: string
  // Profile Completion
  minProfileCompletion: number
}

export const INITIAL_FILTERS: SearchFilters = {
  searchQuery: "",
  gender: [],
  maritalStatus: [],
  stateOfOrigin: "",
  ageMin: "",
  ageMax: "",
  hasWorkPermit: "any",
  currentlyEmployed: "any",
  industry: "",
  position: "",
  experienceLevel: [],
  yearsOfExperienceMin: "",
  yearsOfExperienceMax: "",
  incomeMin: "",
  incomeMax: "",
  accommodationProvided: "any",
  transportationProvided: "any",
  languages: [],
  minProficiency: 1,
  city: "",
  minProfileCompletion: 0,
}

// Mock data for demonstration (no backend call yet)
const MOCK_PROFILES: UserProfile[] = [
  {
    id: "1417a625-f2e7-4f66-a5f3-9c3077fb083f",
    email: "sime.cvitan@email.com",
    profileCompletion: 1.0,
    personalInfo: {
      firstName: "Sime",
      lastName: "Cvitan",
      dateOfBirth: "1993-01-02",
      gender: "MALE",
      stateOfOrigin: "Croatia",
      mobilePhoneNumber: "0914508995",
      maritalStatus: "MARRIED",
      numberOfChildren: 3,
    },
    legalStatus: {
      hasCroatianWorkPermit: true,
      workPermitExpirationDate: "2028-01-01",
      currentlyEmployedInCroatia: true,
      dateOfArrivalInCroatia: "2023-03-05",
      passportExpirationDate: "2030-01-01",
      oib: "12345678901",
    },
    jobPreferences: {
      desiredIndustry: "Transportation",
      desiredPosition: "Driver",
      expectedMonthlyIncome: 2000,
      accommodationRequired: true,
      transportationRequired: false,
      desiredWorkingHoursPerDay: 8,
      desiredWorkingDaysPerMonth: 20,
      yearsOfExperience: 5,
      experienceLevel: "EXPERIENCED_INDEPENDENT",
    },
    languages: [
      { language: "CROATIAN", written: 6, spoken: 7, reading: 8, understanding: 7 },
      { language: "ENGLISH", written: 5, spoken: 6, reading: 7, understanding: 6 },
    ],
    accommodation: {
      address: { postalCode: "10000", city: "Zagreb", street: "Ilica", houseNumber: "15A" },
      provider: "EMPLOYER",
      type: "WITH_WORKERS",
      peopleInAccommodation: "THREE",
      peopleInRoom: "TWO",
    },
    employmentCurrent: {
      industry: "Transportation",
      jobTitleInCroatia: "Driver",
      employerName: "FirmaZ",
      employerAddress: "ulica 3",
      employerContactInfo: "nekaadresa@email.com",
      cityOfWork: "Daruvar",
      numberOfPreviousEmployersInCroatia: 2,
      workAddress: { postalCode: "10000", city: "Zagreb", street: "Ilica", houseNumber: "15A" },
    },
  },
  {
    id: "a2b3c4d5-e6f7-8901-2345-6789abcdef01",
    email: "ana.horvat@email.com",
    profileCompletion: 0.85,
    personalInfo: {
      firstName: "Ana",
      lastName: "Horvat",
      dateOfBirth: "1988-07-15",
      gender: "FEMALE",
      stateOfOrigin: "Bosnia",
      mobilePhoneNumber: "0921234567",
      maritalStatus: "SINGLE",
      numberOfChildren: 0,
    },
    legalStatus: {
      hasCroatianWorkPermit: true,
      workPermitExpirationDate: "2027-06-01",
      currentlyEmployedInCroatia: false,
      dateOfArrivalInCroatia: "2022-09-10",
      passportExpirationDate: "2029-03-15",
      oib: "98765432101",
    },
    jobPreferences: {
      desiredIndustry: "Healthcare",
      desiredPosition: "Nurse",
      expectedMonthlyIncome: 1800,
      accommodationRequired: false,
      transportationRequired: true,
      desiredWorkingHoursPerDay: 8,
      desiredWorkingDaysPerMonth: 22,
      yearsOfExperience: 10,
      experienceLevel: "EXPERT",
    },
    languages: [
      { language: "CROATIAN", written: 8, spoken: 9, reading: 9, understanding: 9 },
      { language: "GERMAN", written: 4, spoken: 5, reading: 6, understanding: 5 },
      { language: "ENGLISH", written: 7, spoken: 7, reading: 8, understanding: 8 },
    ],
    accommodation: {
      address: { postalCode: "21000", city: "Split", street: "Vukovarska", houseNumber: "8" },
      provider: "SELF",
      type: "ALONE",
      peopleInAccommodation: "ONE",
      peopleInRoom: "ONE",
    },
    employmentCurrent: {
      industry: "Healthcare",
      jobTitleInCroatia: "Nurse",
      employerName: "KBC Split",
      employerAddress: "Spinciceva 1",
      employerContactInfo: "info@kbc-split.hr",
      cityOfWork: "Split",
      numberOfPreviousEmployersInCroatia: 1,
      workAddress: { postalCode: "21000", city: "Split", street: "Spinciceva", houseNumber: "1" },
    },
  },
  {
    id: "b3c4d5e6-f7a8-9012-3456-789abcdef012",
    email: "marko.petrovic@email.com",
    profileCompletion: 0.6,
    personalInfo: {
      firstName: "Marko",
      lastName: "Petrovic",
      dateOfBirth: "1995-11-20",
      gender: "MALE",
      stateOfOrigin: "Serbia",
      mobilePhoneNumber: "0987654321",
      maritalStatus: "SINGLE",
      numberOfChildren: 0,
    },
    legalStatus: {
      hasCroatianWorkPermit: false,
      workPermitExpirationDate: "",
      currentlyEmployedInCroatia: false,
      dateOfArrivalInCroatia: "2024-01-15",
      passportExpirationDate: "2028-08-20",
      oib: "",
    },
    jobPreferences: {
      desiredIndustry: "Construction",
      desiredPosition: "Builder",
      expectedMonthlyIncome: 1500,
      accommodationRequired: true,
      transportationRequired: true,
      desiredWorkingHoursPerDay: 10,
      desiredWorkingDaysPerMonth: 24,
      yearsOfExperience: 3,
      experienceLevel: "EXPERIENCED_WITH_SUPERVISION",
    },
    languages: [
      { language: "SERBIAN", written: 9, spoken: 10, reading: 9, understanding: 10 },
      { language: "CROATIAN", written: 3, spoken: 4, reading: 4, understanding: 5 },
    ],
    accommodation: {
      address: { postalCode: "31000", city: "Osijek", street: "Europska", houseNumber: "22B" },
      provider: "EMPLOYER",
      type: "WITH_WORKERS",
      peopleInAccommodation: "FIVE_OR_MORE",
      peopleInRoom: "THREE",
    },
    employmentCurrent: {
      industry: "",
      jobTitleInCroatia: "",
      employerName: "",
      employerAddress: "",
      employerContactInfo: "",
      cityOfWork: "",
      numberOfPreviousEmployersInCroatia: "",
      workAddress: { postalCode: "", city: "", street: "", houseNumber: "" },
    },
  },
  {
    id: "c4d5e6f7-a8b9-0123-4567-89abcdef0123",
    email: "ivana.matic@email.com",
    profileCompletion: 0.92,
    personalInfo: {
      firstName: "Ivana",
      lastName: "Matic",
      dateOfBirth: "1990-04-10",
      gender: "FEMALE",
      stateOfOrigin: "Croatia",
      mobilePhoneNumber: "0911112233",
      maritalStatus: "MARRIED",
      numberOfChildren: 1,
    },
    legalStatus: {
      hasCroatianWorkPermit: true,
      workPermitExpirationDate: "2029-12-01",
      currentlyEmployedInCroatia: true,
      dateOfArrivalInCroatia: "2020-01-01",
      passportExpirationDate: "2031-06-01",
      oib: "11223344556",
    },
    jobPreferences: {
      desiredIndustry: "Cleaning",
      desiredPosition: "Cleaner",
      expectedMonthlyIncome: 3500,
      accommodationRequired: false,
      transportationRequired: false,
      desiredWorkingHoursPerDay: 8,
      desiredWorkingDaysPerMonth: 20,
      yearsOfExperience: 8,
      experienceLevel: "EXPERT",
    },
    languages: [
      { language: "CROATIAN", written: 10, spoken: 10, reading: 10, understanding: 10 },
      { language: "ENGLISH", written: 9, spoken: 9, reading: 10, understanding: 10 },
      { language: "GERMAN", written: 6, spoken: 7, reading: 7, understanding: 8 },
    ],
    accommodation: {
      address: { postalCode: "10000", city: "Zagreb", street: "Savska", houseNumber: "45" },
      provider: "SELF",
      type: "WITH_FAMILY",
      peopleInAccommodation: "THREE",
      peopleInRoom: "TWO",
    },
    employmentCurrent: {
      industry: "IT",
      jobTitleInCroatia: "Software Developer",
      employerName: "TechCo d.o.o.",
      employerAddress: "Heinzelova 55",
      employerContactInfo: "hr@techco.hr",
      cityOfWork: "Zagreb",
      numberOfPreviousEmployersInCroatia: 3,
      workAddress: { postalCode: "10000", city: "Zagreb", street: "Heinzelova", houseNumber: "55" },
    },
  },
  {
    id: "d5e6f7a8-b9c0-1234-5678-9abcdef01234",
    email: "ahmed.selim@email.com",
    profileCompletion: 0.45,
    personalInfo: {
      firstName: "Ahmed",
      lastName: "Selim",
      dateOfBirth: "1998-02-28",
      gender: "MALE",
      stateOfOrigin: "Turkey",
      mobilePhoneNumber: "0995556677",
      maritalStatus: "SINGLE",
      numberOfChildren: 0,
    },
    legalStatus: {
      hasCroatianWorkPermit: true,
      workPermitExpirationDate: "2026-04-01",
      currentlyEmployedInCroatia: false,
      dateOfArrivalInCroatia: "2025-06-01",
      passportExpirationDate: "2033-11-15",
      oib: "",
    },
    jobPreferences: {
      desiredIndustry: "Hospitality",
      desiredPosition: "Chef",
      expectedMonthlyIncome: 1600,
      accommodationRequired: true,
      transportationRequired: false,
      desiredWorkingHoursPerDay: 10,
      desiredWorkingDaysPerMonth: 25,
      yearsOfExperience: 2,
      experienceLevel: "BEGINNER",
    },
    languages: [
      { language: "TURKISH", written: 10, spoken: 10, reading: 10, understanding: 10 },
      { language: "ENGLISH", written: 4, spoken: 5, reading: 5, understanding: 6 },
    ],
    accommodation: {
      address: { postalCode: "51000", city: "Rijeka", street: "Korzo", houseNumber: "12" },
      provider: "AGENCY",
      type: "WITH_WORKERS",
      peopleInAccommodation: "FOUR",
      peopleInRoom: "TWO",
    },
    employmentCurrent: {
      industry: "",
      jobTitleInCroatia: "",
      employerName: "",
      employerAddress: "",
      employerContactInfo: "",
      cityOfWork: "",
      numberOfPreviousEmployersInCroatia: "",
      workAddress: { postalCode: "", city: "", street: "", houseNumber: "" },
    },
  },
]

function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

function applyFilters(profiles: UserProfile[], filters: SearchFilters): UserProfile[] {
  return profiles.filter((p) => {
    // Free text search
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      const searchableText = [
        p.personalInfo.firstName,
        p.personalInfo.lastName,
        p.personalInfo.stateOfOrigin,
        p.jobPreferences.desiredIndustry,
        p.jobPreferences.desiredPosition,
        p.employmentCurrent.cityOfWork,
        p.accommodation.address.city,
        p.email,
      ]
        .join(" ")
        .toLowerCase()
      if (!searchableText.includes(q)) return false
    }

    // Gender
    if (filters.gender.length > 0 && !filters.gender.includes(p.personalInfo.gender)) return false

    // Marital status
    if (filters.maritalStatus.length > 0 && !filters.maritalStatus.includes(p.personalInfo.maritalStatus)) return false

    // State of origin
    if (filters.stateOfOrigin && p.personalInfo.stateOfOrigin.toLowerCase() !== filters.stateOfOrigin.toLowerCase())
      return false

    // Age range
    if (p.personalInfo.dateOfBirth) {
      const age = calculateAge(p.personalInfo.dateOfBirth)
      if (filters.ageMin !== "" && age < filters.ageMin) return false
      if (filters.ageMax !== "" && age > filters.ageMax) return false
    }

    // Work permit
    if (filters.hasWorkPermit === "yes" && !p.legalStatus.hasCroatianWorkPermit) return false
    if (filters.hasWorkPermit === "no" && p.legalStatus.hasCroatianWorkPermit) return false

    // Currently employed
    if (filters.currentlyEmployed === "yes" && !p.legalStatus.currentlyEmployedInCroatia) return false
    if (filters.currentlyEmployed === "no" && p.legalStatus.currentlyEmployedInCroatia) return false

    // Industry
    if (filters.industry && p.jobPreferences.desiredIndustry.toLowerCase() !== filters.industry.toLowerCase()) return false

    // Position
    if (filters.position && !p.jobPreferences.desiredPosition.toLowerCase().includes(filters.position.toLowerCase()))
      return false

    // Experience level
    if (filters.experienceLevel.length > 0 && !filters.experienceLevel.includes(p.jobPreferences.experienceLevel))
      return false

    // Years of experience
    const yoe = typeof p.jobPreferences.yearsOfExperience === "number" ? p.jobPreferences.yearsOfExperience : 0
    if (filters.yearsOfExperienceMin !== "" && yoe < filters.yearsOfExperienceMin) return false
    if (filters.yearsOfExperienceMax !== "" && yoe > filters.yearsOfExperienceMax) return false

    // Income range
    const income =
      typeof p.jobPreferences.expectedMonthlyIncome === "number" ? p.jobPreferences.expectedMonthlyIncome : 0
    if (filters.incomeMin !== "" && income < filters.incomeMin) return false
    if (filters.incomeMax !== "" && income > filters.incomeMax) return false

    // Accommodation provided
    if (filters.accommodationProvided === "yes" && !p.jobPreferences.accommodationRequired) return false
    if (filters.accommodationProvided === "no" && p.jobPreferences.accommodationRequired) return false

    // Transportation provided
    if (filters.transportationProvided === "yes" && !p.jobPreferences.transportationRequired) return false
    if (filters.transportationProvided === "no" && p.jobPreferences.transportationRequired) return false

    // Languages
    if (filters.languages.length > 0) {
      const profileLangs = p.languages.map((l) => l.language)
      const hasAll = filters.languages.every((lang) => profileLangs.includes(lang))
      if (!hasAll) return false

      // Proficiency check
      if (filters.minProficiency > 1) {
        const meetsProf = filters.languages.every((lang) => {
          const match = p.languages.find((l) => l.language === lang)
          if (!match) return false
          const avg = (match.written + match.spoken + match.reading + match.understanding) / 4
          return avg >= filters.minProficiency
        })
        if (!meetsProf) return false
      }
    }

    // City
    if (filters.city) {
      const profileCity = (p.accommodation.address.city || p.employmentCurrent.cityOfWork || "").toLowerCase()
      if (!profileCity.includes(filters.city.toLowerCase())) return false
    }

    // Profile completion
    if (filters.minProfileCompletion > 0 && (p.profileCompletion || 0) * 100 < filters.minProfileCompletion)
      return false

    return true
  })
}

function countActiveFilters(filters: SearchFilters): number {
  let count = 0
  if (filters.gender.length > 0) count++
  if (filters.maritalStatus.length > 0) count++
  if (filters.stateOfOrigin) count++
  if (filters.ageMin !== "" || filters.ageMax !== "") count++
  if (filters.hasWorkPermit !== "any") count++
  if (filters.currentlyEmployed !== "any") count++
  if (filters.industry) count++
  if (filters.position) count++
  if (filters.experienceLevel.length > 0) count++
  if (filters.yearsOfExperienceMin !== "" || filters.yearsOfExperienceMax !== "") count++
  if (filters.incomeMin !== "" || filters.incomeMax !== "") count++
  if (filters.accommodationProvided !== "any") count++
  if (filters.transportationProvided !== "any") count++
  if (filters.languages.length > 0) count++
  if (filters.city) count++
  if (filters.minProfileCompletion > 0) count++
  return count
}

export function SearchProfilesView() {
  const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null)

  const filteredProfiles = useMemo(() => applyFilters(MOCK_PROFILES, filters), [filters])
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters])

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Search Profiles</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find candidates matching your requirements from the profile database.
        </p>
      </div>

      {/* Search bar + toggle */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, position, industry, city, email..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((f) => ({ ...f, searchQuery: e.target.value }))}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="gap-2"
          >
            <SlidersHorizontal className="size-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 size-5 justify-center rounded-full p-0 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
              <X className="size-3" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Active filter badges */}
      {activeFilterCount > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.gender.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Gender: {filters.gender.join(", ")}
              <button type="button" onClick={() => setFilters((f) => ({ ...f, gender: [] }))}><X className="size-3" /></button>
            </Badge>
          )}
          {filters.maritalStatus.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.maritalStatus.join(", ")}
              <button type="button" onClick={() => setFilters((f) => ({ ...f, maritalStatus: [] }))}><X className="size-3" /></button>
            </Badge>
          )}
          {filters.stateOfOrigin && (
            <Badge variant="secondary" className="gap-1">
              Origin: {filters.stateOfOrigin}
              <button type="button" onClick={() => setFilters((f) => ({ ...f, stateOfOrigin: "" }))}><X className="size-3" /></button>
            </Badge>
          )}
          {(filters.ageMin !== "" || filters.ageMax !== "") && (
            <Badge variant="secondary" className="gap-1">
              Age: {filters.ageMin || "?"}-{filters.ageMax || "?"}
              <button type="button" onClick={() => setFilters((f) => ({ ...f, ageMin: "", ageMax: "" }))}><X className="size-3" /></button>
            </Badge>
          )}
          {filters.hasWorkPermit !== "any" && (
            <Badge variant="secondary" className="gap-1">
              Work Permit: {filters.hasWorkPermit}
              <button type="button" onClick={() => setFilters((f) => ({ ...f, hasWorkPermit: "any" }))}><X className="size-3" /></button>
            </Badge>
          )}
          {filters.currentlyEmployed !== "any" && (
            <Badge variant="secondary" className="gap-1">
              Employed: {filters.currentlyEmployed}
              <button type="button" onClick={() => setFilters((f) => ({ ...f, currentlyEmployed: "any" }))}><X className="size-3" /></button>
            </Badge>
          )}
          {filters.industry && (
            <Badge variant="secondary" className="gap-1">
              Industry: {filters.industry}
              <button type="button" onClick={() => setFilters((f) => ({ ...f, industry: "" }))}><X className="size-3" /></button>
            </Badge>
          )}
          {filters.position && (
            <Badge variant="secondary" className="gap-1">
              Position: {filters.position}
              <button type="button" onClick={() => setFilters((f) => ({ ...f, position: "" }))}><X className="size-3" /></button>
            </Badge>
          )}
          {filters.experienceLevel.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Exp: {filters.experienceLevel.map((e) => e.replace(/_/g, " ")).join(", ")}
              <button type="button" onClick={() => setFilters((f) => ({ ...f, experienceLevel: [] }))}><X className="size-3" /></button>
            </Badge>
          )}
          {filters.languages.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Langs: {filters.languages.join(", ")}
              <button type="button" onClick={() => setFilters((f) => ({ ...f, languages: [] }))}><X className="size-3" /></button>
            </Badge>
          )}
          {filters.city && (
            <Badge variant="secondary" className="gap-1">
              City: {filters.city}
              <button type="button" onClick={() => setFilters((f) => ({ ...f, city: "" }))}><X className="size-3" /></button>
            </Badge>
          )}
        </div>
      )}

      {/* Main content */}
      <div className="flex gap-6">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="hidden w-80 shrink-0 lg:block">
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </div>
        )}

        {/* Results */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filteredProfiles.length}</span>{" "}
              {filteredProfiles.length === 1 ? "profile" : "profiles"} found
            </p>
          </div>

          {filteredProfiles.length === 0 ? (
            <Card className="py-16">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <Users className="mb-4 size-12 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold text-foreground">No profiles found</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try adjusting your filters or search query to find matching candidates.
                </p>
                {activeFilterCount > 0 && (
                  <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
                    Clear all filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onClick={() => setSelectedProfile(profile)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute bottom-0 left-0 top-0 w-80 overflow-y-auto border-r border-border bg-background p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </div>
        </div>
      )}

      {/* Profile detail sheet */}
      <ProfileDetailSheet
        profile={selectedProfile}
        open={!!selectedProfile}
        onOpenChange={(open) => {
          if (!open) setSelectedProfile(null)
        }}
      />
    </div>
  )
}
