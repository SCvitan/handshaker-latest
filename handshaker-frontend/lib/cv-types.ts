export const INDUSTRIES = [
  { value: "HEALTHCARE", label: "Healthcare" },
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "TRANSPORTATION", label: "Transportation" },
  { value: "CONSTRUCTION", label: "Construction" },
  { value: "HOSPITALITY", label: "Hospitality" },
  { value: "CLEANING", label: "Cleaning" },
  { value: "OTHER", label: "Other" },
] as const

export const COUNTRIES = [
  { value: "CROATIA", label: "Croatia" },
  { value: "INDIA", label: "India" },
  { value: "NEPAL", label: "Nepal" },
  { value: "PHILIPPINES", label: "Philippines" },
  { value: "EGYPT", label: "Egypt" },
] as const

export interface PersonalInfo {
  firstName: string
  lastName: string
  dateOfBirth: string | null
  gender: string | null
  stateOfOrigin: string | null
  mobilePhoneNumber: string
  maritalStatus: string | null
  numberOfChildren: number | null
}

export interface LegalStatus {
  hasCroatianWorkPermit: boolean
  workPermitExpirationDate: string | null
  currentlyEmployedInCroatia: boolean
  dateOfArrivalInCroatia: string | null
  passportExpirationDate: string | null
  oib: string
}

export interface JobPreferences {
  desiredIndustry: string | null
  desiredPosition: string | null
  expectedMonthlyIncome: number | null
  accommodationRequired: boolean
  transportationRequired: boolean
  desiredWorkingHoursPerDay: number | null
  desiredWorkingDaysPerMonth: number | null
  yearsOfExperience: number | null
  experienceLevel: string | null
}

export interface Language {
  language: string | null
  written: number
  spoken: number
  reading: number
  understanding: number
}

export interface Accommodation {
  address: {
    postalCode: string | null
    city: string
    street: string
    houseNumber: string
  } | null
  provider: string | null
  type: string | null
  peopleInAccommodation: string | null
  peopleInRoom: string | null
}

export interface EmploymentCurrent {
  industry: string | null
  jobTitleInCroatia: string | null
  employerName: string
  employerAddress: string
  employerContactInfo: string
  cityOfWork: string
  numberOfPreviousEmployersInCroatia: number | null
  workAddress: {
    postalCode: string | null
    city: string
    street: string
    houseNumber: string | null
  } | null
}

export const DEFAULT_ADDRESS = {
  postalCode: null,
  city: "",
  street: "",
  houseNumber: "",
}

export const DEFAULT_WORK_ADDRESS = {
  postalCode: null,
  city: "",
  street: "",
  houseNumber: null,
}

export interface CVData {
  personalInfo: PersonalInfo
  legalStatus: LegalStatus
  jobPreferences: JobPreferences
  languages: Language[]
  accommodation: Accommodation
  employmentCurrent: EmploymentCurrent
}

export interface UserProfile extends CVData {
  id: string
  email: string
  profileCompletion: number
}

export const INITIAL_CV_DATA: CVData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    gender: null,
    stateOfOrigin: null,
    mobilePhoneNumber: "",
    maritalStatus: null,
    numberOfChildren: null,
  },
  legalStatus: {
    hasCroatianWorkPermit: false,
    workPermitExpirationDate: null,
    currentlyEmployedInCroatia: false,
    dateOfArrivalInCroatia: null,
    passportExpirationDate: null,
    oib: "",
  },
  jobPreferences: {
    desiredIndustry: null,
    desiredPosition: null,
    expectedMonthlyIncome: null,
    accommodationRequired: false,
    transportationRequired: false,
    desiredWorkingHoursPerDay: null,
    desiredWorkingDaysPerMonth: null,
    yearsOfExperience: null,
    experienceLevel: null,
  },
  languages: [
    { language: null, written: 1, spoken: 1, reading: 1, understanding: 1 },
  ],
  accommodation: {
    address: {
      postalCode: null,
      city: "",
      street: "",
      houseNumber: "",
    },
    provider: null,
    type: null,
    peopleInAccommodation: null,
    peopleInRoom: null,
  },
  employmentCurrent: {
    industry: null,
    jobTitleInCroatia: null,
    employerName: "",
    employerAddress: "",
    employerContactInfo: "",
    cityOfWork: "",
    numberOfPreviousEmployersInCroatia: null,
    workAddress: {
      postalCode: null,
      city: "",
      street: "",
      houseNumber: null,
    },
  },
}

export const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"]
export const MARITAL_STATUS_OPTIONS = ["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]
export const EXPERIENCE_LEVEL_OPTIONS = [
  "BEGINNER",
  "EXPERIENCED_NOT_INDEPENDENT",
  "EXPERIENCED_INDEPENDENT",
  "EXPERT",
]
export const LANGUAGE_OPTIONS = [
  "CROATIAN",
  "ENGLISH",
  "GERMAN",
  "FRENCH",
  "SPANISH",
  "ITALIAN",
  "PORTUGUESE",
  "RUSSIAN",
  "ARABIC",
  "CHINESE",
  "HINDI",
  "TURKISH",
  "SERBIAN",
  "BOSNIAN",
  "SLOVENIAN",
]
export const ACCOMMODATION_PROVIDER_OPTIONS = ["EMPLOYER", "SELF"]
export const ACCOMMODATION_TYPE_OPTIONS = ["ALONE", "WITH_FAMILY", "WITH_WORKERS", "WITH_FRIENDS"]
export const PEOPLE_COUNT_OPTIONS = ["ONE", "TWO", "THREE", "FOUR", "FIVE_OR_MORE"]
