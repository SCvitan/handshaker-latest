import type {
  PersonalInfo,
  LegalStatus,
  JobPreferences,
  Language,
  Accommodation,
  UserProfile,
  EmploymentCurrent,
} from "./cv-types"

const API_BASE = "http://142.132.181.45:8083"
//const API_BASE = "http://localhost:8083"

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
  return res.json()
}

export async function savePersonalInfo(data: PersonalInfo) {
  return authFetch(`${API_BASE}/users/me/personal`, {
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

// ── Company endpoints (port 8082) ──

//const COMPANY_API_BASE = "http://localhost:8082"
const COMPANY_API_BASE = "http://142.132.181.45:8082"

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
  country: string
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

// ── Profile search endpoint (port 8083) ──

export interface ProfileSearchRequest {
  search?: string
  gender?: string
  maritalStatus?: string
  stateOfOrigin?: string
  minAge?: number
  maxAge?: number
  hasWorkPermit?: boolean
  currentlyEmployed?: boolean
  industry?: string
  position?: string
  experienceLevel?: string
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
    `${API_BASE}/users/search`,
    {
      method: "POST",
      body: JSON.stringify(filters),
    },
  )
  const json = await res.json()
  // Remap employmentCurrentResponse -> employmentCurrent in each profile
  if (json.content) {
    for (const profile of json.content) {
      if (profile.employmentCurrentResponse && !profile.employmentCurrent) {
        profile.employmentCurrent = profile.employmentCurrentResponse
        delete profile.employmentCurrentResponse
      }
    }
  }
  return json as ProfileSearchResponse
}
