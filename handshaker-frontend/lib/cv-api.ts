import type {
  PersonalInfo,
  LegalStatus,
  JobPreferences,
  Language,
  Accommodation,
  UserProfile,
  EmploymentCurrent,
  WorkExperience,
  Education,
  DocumentItem,
  ProfileSummary,
  CompanyDashboardResponse,
} from "./cv-types"

//const API_BASE = "http://142.132.181.45:8083"
const API_BASE = "http://localhost:8083/api"

/**
 * Authenticated fetch
 * - JWT is sent automatically via HttpOnly cookie
 * - NO Authorization header needed
 * - credentials: "include" is required for cookies
 */
async function authFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Not authenticated")
    }
    const errorText = await res.text()
    throw new Error(errorText || "Request failed")
  }

  return res
}

export async function fetchProfile(): Promise<UserProfile> {
  const res = await authFetch(`${API_BASE}/users/me`)
  const json = await res.json()
  // Server returns "employmentCurrentResponse", remap to our type
  if (json.employmentCurrentResponse && !json.employmentCurrent) {
    json.employmentCurrent = json.employmentCurrentResponse
    delete json.employmentCurrentResponse
  }
  return json as UserProfile
}

export async function savePersonalInfo(data: PersonalInfo) {
  return authFetch(`${API_BASE}/users/me/personal`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * Upload profile picture to R2 via backend
 * Endpoint: POST /users/me/profile-image
 * Format: multipart/form-data with "file" field
 * Returns: URL string of uploaded image
 */
export async function uploadProfilePicture(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`${API_BASE}/users/me/profile-image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  })

  if (!res.ok) {
    throw new Error("Failed to upload profile picture")
  }

  // Backend returns the URL directly as text or JSON
  const text = await res.text()
  // Handle both plain text URL and JSON { url: "..." } responses
  try {
    const json = JSON.parse(text)
    return json.url || json
  } catch {
    return text
  }
}

export async function saveWorkExperience(experiences: WorkExperience[]) {
  return authFetch(`${API_BASE}/users/me/work-experience`, {
    method: "PUT",
    body: JSON.stringify({ experiences }),
  })
}

export async function saveEducation(data: Education) {
  return authFetch(`${API_BASE}/users/me/education`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function saveLegalStatus(data: LegalStatus) {
  return authFetch(`${API_BASE}/users/me/legal`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function saveJobPreferences(data: JobPreferences) {
  return authFetch(`${API_BASE}/users/me/job-preferences`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function saveLanguages(data: Language[]) {
  return authFetch(`${API_BASE}/users/me/languages`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function saveAccommodation(data: Accommodation) {
  return authFetch(`${API_BASE}/users/me/accommodation`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function saveEmploymentCurrent(data: EmploymentCurrent) {
  return authFetch(`${API_BASE}/users/me/employment-current`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export interface DocumentUploadResult {
  fileUrl: string
  thumbnailUrl: string | null
  previewAvailable: boolean
}

/**
 * Upload document file to backend
 * Endpoint: POST /users/me/documents
 * Format: multipart/form-data with "file" and "type" fields
 * type: WORK_PERMIT, PASSPORT, RESIDENCE_CARD, PAY_SLIP, OTHER
 * Returns: DocumentUploadResult object
 */
export async function uploadDocument(
  type: "WORK_PERMIT" | "PASSPORT" | "RESIDENCE_CARD" | "PAY_SLIP" | "OTHER",
  file: File
): Promise<DocumentUploadResult & { type: typeof type; fileName: string }> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("type", type)

  const res = await fetch(`${API_BASE}/users/me/documents`, {
    method: "POST",
    credentials: "include",
    body: formData,
  })

  if (!res.ok) {
    throw new Error(`Failed to upload ${type}`)
  }

  const result: DocumentUploadResult = await res.json()
  return {
    ...result,
    type,
    fileName: file.name,
  }
}

/**
 * Delete a document
 * Endpoint: DELETE /users/me/documents/{id}
 */
export async function deleteDocument(documentId: string): Promise<void> {
  await authFetch(`${API_BASE}/users/me/documents/${documentId}`, {
    method: "DELETE",
  })
}

// ── Company endpoints (port 8082) ──

const COMPANY_API_BASE = "http://localhost:8082/api"
//const COMPANY_API_BASE = "http://142.132.181.45:8082"

export interface CompanyProfile {
  id: string
  email: string
  companyName: string
  description: string
  industry: string
  phoneNumber: string
  website: string
  address: string
  city: string
  postalCode: string
  country: string
  companySize: string
  oib: string
  bankAccount: string
  logoUrl: string | null
}

export type CompanyProfileUpdate = Omit<CompanyProfile, "id" | "email">

export async function fetchCompanyProfile(): Promise<CompanyProfile> {
  const res = await authFetch(`${COMPANY_API_BASE}/companies/me`)
  return res.json()
}

export async function saveCompanyProfile(data: CompanyProfileUpdate) {
  return authFetch(`${COMPANY_API_BASE}/companies/me`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function uploadCompanyLogo(file: File): Promise<{ logoUrl: string }> {
  const formData = new FormData()
  formData.append("file", file)
  const res = await fetch(`${COMPANY_API_BASE}/companies/me/logo`, {
    method: "POST",
    credentials: "include",
    body: formData,
  })
  if (!res.ok) throw new Error("Failed to upload logo")
  return res.json()
}

// ── Profile search endpoint (port 8083) ──

export interface ProfileSearchRequest {
  search?: string
  gender?: string
  maritalStatus?: string
  stateOfOrigin?: string
  countryOfResidence?: string
  minAge?: number
  maxAge?: number
  hasWorkPermit?: boolean
  currentlyEmployed?: boolean
  industry?: string
  position?: string
  experienceLevel?: string
  preferredWorkTypes?: string
  minExperienceYears?: number
  maxExperienceYears?: number
  minIncome?: number
  maxIncome?: number
  accommodationRequired?: boolean
  transportationRequired?: boolean
  language?: string
  minProficiency?: number
  city?: string
}

export interface ProfileSearchResponse {
  content: UserProfile[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export async function searchProfiles(
  filters: ProfileSearchRequest,
  page = 0,
  size = 20,
): Promise<ProfileSearchResponse> {
  const res = await authFetch(
    `${API_BASE}/users/search?page=${page}&size=${size}`,
    {
      method: "POST",
      body: JSON.stringify(filters),
    },
  )
  const json = await res.json()
  return json as ProfileSearchResponse
}

// ── Job Ad endpoints (company) ──

import type { JobAd, JobAdCreate } from "./cv-types"

export async function fetchCompanyJobs(): Promise<JobAd[]> {
  const res = await authFetch(`${COMPANY_API_BASE}/companies/me/jobs`)
  return res.json()
}

export async function createJobAd(data: JobAdCreate): Promise<JobAd> {
  const res = await authFetch(`${COMPANY_API_BASE}/companies/me/jobs`, {
    method: "POST",
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateJobAd(id: string, data: JobAdCreate): Promise<JobAd> {
  const res = await authFetch(`${COMPANY_API_BASE}/companies/me/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteJobAd(id: string): Promise<void> {
  await authFetch(`${COMPANY_API_BASE}/companies/me/jobs/${id}`, {
    method: "DELETE",
  })
}

// ── Favorites endpoints (company) ──

export async function addToFavorites(profileId: string): Promise<void> {
  await authFetch(`${COMPANY_API_BASE}/companies/me/favourites/${profileId}`, {
    method: "POST",
  })
}

export async function getFavorites(): Promise<ProfileSummary[]> {
  const res = await authFetch(`${COMPANY_API_BASE}/companies/me/favourites`)
  return res.json()
}

export async function removeFromFavorites(profileId: string): Promise<void> {
  await authFetch(`${COMPANY_API_BASE}/companies/me/favourites/${profileId}`, {
    method: "DELETE",
  })
}

export async function fetchProfileById(profileId: string): Promise<UserProfile> {
  const res = await authFetch(`${API_BASE}/users/${profileId}`)
  const json = await res.json()
  if (json.employmentCurrentResponse && !json.employmentCurrent) {
    json.employmentCurrent = json.employmentCurrentResponse
    delete json.employmentCurrentResponse
  }
  return json as UserProfile
}

// ── Subscription endpoint ──

export type SubscriptionPlan = "BASIC" | "PRO" | "AGENCY"

export async function activateSubscription(plan: SubscriptionPlan): Promise<void> {
  await authFetch(`${COMPANY_API_BASE}/subscription/activate?plan=${plan}`, {
    method: "POST",
  })
}

// ── Job Offers endpoints (company) ──

import type { JobOffer } from "./cv-types"

export async function fetchCompanyOffers(): Promise<JobOffer[]> {
  const res = await fetch(`${COMPANY_API_BASE}/company/offers`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch company offers")
  }

  return res.json()
}

export async function fetchWorkerOffers(): Promise<JobOffer[]> {
  const res = await fetch(`${COMPANY_API_BASE}/offers/me`, {
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch offers")
  }

  return res.json()
}

export async function markInterested(offerId: string) {
  await fetch(`${COMPANY_API_BASE}/offers/${offerId}/interested`, {
    method: "POST",
    credentials: "include",
  })
}

export async function rejectOffer(offerId: string) {
  await fetch(`${COMPANY_API_BASE}/offers/${offerId}/reject`, {
    method: "POST",
    credentials: "include",
  })
}

// ── Company Dashboard endpoints ──


export async function fetchCompanyDashboard(): Promise<CompanyDashboardResponse> {

  const res = await authFetch(
    `${COMPANY_API_BASE}/companies/dashboard`, {
      method: "GET",
      credentials: "include",
    }
  )

  return res.json()
}

export async function unlockCandidateContact(
  offerId: string
): Promise<void> {

  await authFetch(
    `${COMPANY_API_BASE}/offers/${offerId}/unlock-contact`,
    {
      method: "POST",
      credentials: "include"
    }
  )
}
