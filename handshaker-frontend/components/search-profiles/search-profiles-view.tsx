"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, SlidersHorizontal, X, Users, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { FilterSidebar } from "./filter-sidebar"
import { ProfileCard } from "./profile-card"
import { ProfileDetailSheet } from "./profile-detail-sheet"
import type { UserProfile } from "@/lib/cv-types"
import {
  searchProfiles,
  type ProfileSearchRequest,
  type ProfileSearchResponse,
} from "@/lib/cv-api"

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

function buildRequestBody(filters: SearchFilters): ProfileSearchRequest {
  const body: ProfileSearchRequest = {}

  if (filters.searchQuery) body.search = filters.searchQuery
  if (filters.gender.length === 1) body.gender = filters.gender[0]
  if (filters.maritalStatus.length === 1) body.maritalStatus = filters.maritalStatus[0]
  if (filters.stateOfOrigin) body.stateOfOrigin = filters.stateOfOrigin
  if (filters.ageMin !== "") body.minAge = filters.ageMin
  if (filters.ageMax !== "") body.maxAge = filters.ageMax
  if (filters.hasWorkPermit === "yes") body.hasWorkPermit = true
  if (filters.hasWorkPermit === "no") body.hasWorkPermit = false
  if (filters.currentlyEmployed === "yes") body.currentlyEmployed = true
  if (filters.currentlyEmployed === "no") body.currentlyEmployed = false
  if (filters.industry) body.industry = filters.industry
  if (filters.position) body.position = filters.position
  if (filters.experienceLevel.length === 1) body.experienceLevel = filters.experienceLevel[0]
  if (filters.yearsOfExperienceMin !== "") body.minExperienceYears = filters.yearsOfExperienceMin
  if (filters.yearsOfExperienceMax !== "") body.maxExperienceYears = filters.yearsOfExperienceMax
  if (filters.incomeMin !== "") body.minIncome = filters.incomeMin
  if (filters.incomeMax !== "") body.maxIncome = filters.incomeMax
  if (filters.accommodationProvided === "yes") body.accommodationRequired = true
  if (filters.accommodationProvided === "no") body.accommodationRequired = false
  if (filters.transportationProvided === "yes") body.transportationRequired = true
  if (filters.transportationProvided === "no") body.transportationRequired = false
  if (filters.languages.length === 1) body.language = filters.languages[0]
  if (filters.minProficiency > 1 && filters.languages.length > 0) body.minProficiency = filters.minProficiency
  if (filters.city) body.city = filters.city

  return body
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

const PAGE_SIZE = 20

export function SearchProfilesView() {
  const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null)

  // API state
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [page, setPage] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  const activeFilterCount = countActiveFilters(filters)

  const doSearch = useCallback(async (searchFilters: SearchFilters, pageNum: number) => {
    setLoading(true)
    setError("")
    try {
      const body = buildRequestBody(searchFilters)
      const res = await searchProfiles(body, pageNum, PAGE_SIZE)
      setProfiles(res.content)
      setTotalElements(res.totalElements)
      setTotalPages(res.totalPages)
      setPage(res.number)
      setHasSearched(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
      setProfiles([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount with empty filters (show all profiles)
  useEffect(() => {
    doSearch(INITIAL_FILTERS, 0)
  }, [doSearch])

  const handleSearch = () => {
    setPage(0)
    doSearch(filters, 0)
  }

  const handlePageChange = (newPage: number) => {
    doSearch(filters, newPage)
  }

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS)
    setPage(0)
    doSearch(INITIAL_FILTERS, 0)
  }

  // Search when pressing Enter in the search box
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
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
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSearch} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Search
          </Button>
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

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
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
              {hasSearched && (
                <>
                  <span className="font-medium text-foreground">{totalElements}</span>{" "}
                  {totalElements === 1 ? "profile" : "profiles"} found
                </>
              )}
            </p>
            {totalPages > 1 && (
              <p className="text-xs text-muted-foreground">
                Page {page + 1} of {totalPages}
              </p>
            )}
          </div>

          {loading ? (
            <Card className="py-16">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <Loader2 className="mb-4 size-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Searching profiles...</p>
              </CardContent>
            </Card>
          ) : profiles.length === 0 && hasSearched ? (
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
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {profiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onClick={() => setSelectedProfile(profile)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0 || loading}
                    onClick={() => handlePageChange(page - 1)}
                    className="gap-1"
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNum: number
                      if (totalPages <= 7) {
                        pageNum = i
                      } else if (page < 3) {
                        pageNum = i
                      } else if (page > totalPages - 4) {
                        pageNum = totalPages - 7 + i
                      } else {
                        pageNum = page - 3 + i
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? "default" : "outline"}
                          size="sm"
                          className="size-8 p-0"
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                        >
                          {pageNum + 1}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages - 1 || loading}
                    onClick={() => handlePageChange(page + 1)}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              )}
            </>
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
