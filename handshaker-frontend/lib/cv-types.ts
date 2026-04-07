export const POSITION_OPTIONS: Record<string, string[]> = {
  TRANSPORTATION: [
    "Truck driver (cat. C)",
    "Taxi driver",
    "Van driver cat. B (up to 3.5t)",
    "Bus driver (cat. D)",
    "Forklift operator",
    "Warehouse worker",
    "Delivery person",
    "Loading operator",
    "Other",
  ],
  CONSTRUCTION: [
    "Mason/Bricklayer",
    "Carpenter (formwork)",
    "Rebar worker",
    "Facade worker",
    "Tile layer",
    "Painter",
    "Plumber",
    "Electrician",
    "Roofer",
    "Concrete worker",
    "Joiner/Carpenter",
    "Metalworker",
    "Drywall worker",
    "Chimney sweep",
    "Other",
  ],
  HOSPITALITY: [
    "Cook/Chef",
    "Kitchen helper",
    "Waiter/Waitress",
    "Bartender",
    "Receptionist",
    "Housekeeper",
    "Pizza maker",
    "Pastry chef",
    "Baker",
    "Barista",
    "Other",
  ],
  MANUFACTURING: [
    "Welder",
    "Assembly worker",
    "CNC operator",
    "Mechanical technician",
    "Quality controller",
    "Production line worker",
    "Electromechanician",
    "Other",
  ],
  CLEANING: [
    "Cleaner",
    "Window cleaner",
    "Industrial cleaner",
    "Municipal worker",
    "Gardener",
    "Handyman",
    "Other",
  ],
  AGRICULTURE: [
    "Picker (fruit/veg)",
    "Greenhouse worker",
    "Farm worker",
    "Tractor operator",
    "Vineyard worker",
    "Livestock worker",
    "Other",
  ],
} as const

export const INDUSTRIES = [
  { value: "TRANSPORTATION", label: "Transportation" },
  { value: "CONSTRUCTION", label: "Construction" },
  { value: "HOSPITALITY", label: "Hospitality" },
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "CLEANING", label: "Cleaning" },
  { value: "AGRICULTURE", label: "Agriculture" },
  { value: "OTHER", label: "Other" },
] as const

export const COUNTRIES = [
  { value: "CROATIA", label: "Croatia" },
  { value: "INDIA", label: "India" },
  { value: "NEPAL", label: "Nepal" },
  { value: "PHILIPPINES", label: "Philippines" },
  { value: "EGYPT", label: "Egypt" },
  { value: "BANGLADESH", label: "Bangladesh" },
  { value: "PAKISTAN", label: "Pakistan" },
  { value: "BOSNIA_AND_HERZEGOVINA", label: "Bosnia and Herzegovina" },
  { value: "SERBIA", label: "Serbia" },
  { value: "NORTH_MACEDONIA", label: "North Macedonia" },
  { value: "ALBANIA", label: "Albania" },
  { value: "KOSOVO", label: "Kosovo" },
  { value: "UKRAINE", label: "Ukraine" },
  { value: "TURKEY", label: "Turkey" },
  { value: "VIETNAM", label: "Vietnam" },
  { value: "INDONESIA", label: "Indonesia" },
  { value: "SRI_LANKA", label: "Sri Lanka" },
  { value: "OTHER", label: "Other" },
] as const

export interface PersonalInfo {
  firstName: string
  lastName: string
  dateOfBirth: string | null
  gender: string | null
  stateOfOrigin: string | null
  countryOfResidence: string | null
  mobilePhoneNumber: string
  maritalStatus: string | null
  profilePictureUrl: string | null
}

export interface LegalStatus {
  hasCroatianWorkPermit: boolean
  workPermitExpirationDate: string | null
  workPermitNoExpiration: boolean
  currentlyEmployedInCroatia: boolean
  dateOfArrivalInCroatia: string | null
  passportExpirationDate: string | null
  oib: string
}

export interface JobPreferences {
  desiredIndustry: string | null
  desiredPosition: string | null
  expectedMonthlyIncome: number | null
  expectedHourlyPay: number | null
  accommodationRequired: boolean
  transportationRequired: boolean
  desiredWorkingHoursPerDay: number | null
  desiredWorkingDaysPerMonth: number | null
  experienceLevel: string | null
  preferredWorkTypes: string[] // "FULL_TIME", "PART_TIME", "SEASONAL"
}

export interface WorkExperience {
  companyName: string
  position: string
  shortDescription: string
  yearsOfExperience: string // "LESS_THAN_1", "1", "2", "3", "4", "5_PLUS"
}

export interface Education {
  highestLevel: string | null // "NO_FORMAL", "PRIMARY", "SECONDARY", "VOCATIONAL", "BACHELOR", "MASTER", "DOCTORATE"
  schoolName: string
  titleAcquired: string
  country: string | null
  dateFinished: string | null
}

export interface DocumentItem {
  id: string
  documentType: "WORK_PERMIT" | "PASSPORT" | "RESIDENCE_CARD" | "PAY_SLIP" | "OTHER"
  fileUrl: string
  thumbnailUrl: string | null
  fileName: string
  contentType: string
  previewAvailable: boolean
  uploadedAt: string
}

export type Documentation = DocumentItem[]

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
  workExperience: WorkExperience[]
  education: Education
  jobPreferences: JobPreferences
  languages: Language[]
  accommodation: Accommodation
  documentation: Documentation
}

export interface UserProfile {
  id: string
  email: string
  profileImageUrl: string | null
  profileCompletion: number
  personalInfo: PersonalInfo
  legalStatus: LegalStatus
  jobPreferences: JobPreferences
  languages: Language[]
  accommodation: Accommodation
  education: Education
  workExperiences: WorkExperience[]
  documents: Documentation
}

export const INITIAL_CV_DATA: CVData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    gender: null,
    stateOfOrigin: null,
    countryOfResidence: null,
    mobilePhoneNumber: "",
    maritalStatus: null,
    profilePictureUrl: null,
  },
  legalStatus: {
    hasCroatianWorkPermit: false,
    workPermitExpirationDate: null,
    workPermitNoExpiration: false,
    currentlyEmployedInCroatia: false,
    dateOfArrivalInCroatia: null,
    passportExpirationDate: null,
    oib: "",
  },
  workExperience: [] as WorkExperience[],
  education: {
    highestLevel: null,
    schoolName: "",
    titleAcquired: "",
    country: null,
    dateFinished: null,
  },
  jobPreferences: {
    desiredIndustry: null,
    desiredPosition: null,
    expectedMonthlyIncome: null,
    expectedHourlyPay: null,
    accommodationRequired: false,
    transportationRequired: false,
    desiredWorkingHoursPerDay: null,
    desiredWorkingDaysPerMonth: null,
    experienceLevel: null,
    preferredWorkTypes: [],
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
  documentation: [] as Documentation,
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

export const YEARS_EXPERIENCE_OPTIONS = [
  { value: "LESS_THAN_1", label: "Less than 1 year" },
  { value: "1", label: "1 year" },
  { value: "2", label: "2 years" },
  { value: "3", label: "3 years" },
  { value: "4", label: "4 years" },
  { value: "5_PLUS", label: "5+ years" },
] as const

export const EDUCATION_LEVEL_OPTIONS = [
  { value: "NO_FORMAL", label: "No formal education" },
  { value: "PRIMARY", label: "Primary school" },
  { value: "SECONDARY", label: "Secondary school / High school" },
  { value: "VOCATIONAL", label: "Vocational / Trade school" },
  { value: "BACHELOR", label: "Bachelor's degree" },
  { value: "MASTER", label: "Master's degree" },
  { value: "DOCTORATE", label: "Doctorate / PhD" },
] as const

export const WORK_TYPE_OPTIONS = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "SEASONAL", label: "Seasonal work" },
] as const

// Job Ad types
export interface JobAd {
  id: string
  industry: string
  position: string
  description: string
  location: {
    street: string
    streetNumber: string
    city: string
    postalCode: string
    country: string
  }
  workType: "FULL_TIME" | "PART_TIME" | "SEASONAL"
  salaryType: "MONTHLY" | "HOURLY"
  salaryAmount: number
  workingHoursPerDay: number
  workingDaysPerMonth: number
  accommodationProvided: boolean
  transportationProvided: boolean
  createdAt: string
  updatedAt: string
}

export type JobAdCreate = Omit<JobAd, "id" | "createdAt" | "updatedAt">
