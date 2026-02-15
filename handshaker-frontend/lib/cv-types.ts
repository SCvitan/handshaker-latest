export interface PersonalInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  stateOfOrigin: string
  mobilePhoneNumber: string
  maritalStatus: string
  numberOfChildren: number | ""
}

export interface LegalStatus {
  hasCroatianWorkPermit: boolean
  workPermitExpirationDate: string
  currentlyEmployedInCroatia: boolean
  dateOfArrivalInCroatia: string
  passportExpirationDate: string
  oib: string
}

export interface JobPreferences {
  desiredIndustry: string
  desiredPosition: string
  expectedMonthlyIncome: number | ""
  accommodationRequired: boolean
  transportationRequired: boolean
  desiredWorkingHoursPerDay: number | ""
  desiredWorkingDaysPerMonth: number | ""
  yearsOfExperience: number | ""
  experienceLevel: string
}

export interface Language {
  language: string
  written: number
  spoken: number
  reading: number
  understanding: number
}

export interface Accommodation {
  address: {
    postalCode: string
    city: string
    street: string
    houseNumber: string
  }
  provider: string
  type: string
  peopleInAccommodation: string
  peopleInRoom: string
}

export interface CVData {
  personalInfo: PersonalInfo
  legalStatus: LegalStatus
  jobPreferences: JobPreferences
  languages: Language[]
  accommodation: Accommodation
}

export const INITIAL_CV_DATA: CVData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    stateOfOrigin: "",
    mobilePhoneNumber: "",
    maritalStatus: "",
    numberOfChildren: "",
  },
  legalStatus: {
    hasCroatianWorkPermit: false,
    workPermitExpirationDate: "",
    currentlyEmployedInCroatia: false,
    dateOfArrivalInCroatia: "",
    passportExpirationDate: "",
    oib: "",
  },
  jobPreferences: {
    desiredIndustry: "",
    desiredPosition: "",
    expectedMonthlyIncome: "",
    accommodationRequired: false,
    transportationRequired: false,
    desiredWorkingHoursPerDay: "",
    desiredWorkingDaysPerMonth: "",
    yearsOfExperience: "",
    experienceLevel: "",
  },
  languages: [
    { language: "", written: 1, spoken: 1, reading: 1, understanding: 1 },
  ],
  accommodation: {
    address: {
      postalCode: "",
      city: "",
      street: "",
      houseNumber: "",
    },
    provider: "",
    type: "",
    peopleInAccommodation: "",
    peopleInRoom: "",
  },
}

export const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"]
export const MARITAL_STATUS_OPTIONS = ["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]
export const EXPERIENCE_LEVEL_OPTIONS = [
  "BEGINNER",
  "EXPERIENCED_NOT_INDEPENDENT",
  "EXPERIENCED_INDEPENDENT",
  "EXPERIENCED_CAN_TEACH",
]
export const LANGUAGE_OPTIONS = [
  "CROATIAN",
  "ENGLISH",
]
export const ACCOMMODATION_PROVIDER_OPTIONS = ["EMPLOYER", "SELF"]
export const ACCOMMODATION_TYPE_OPTIONS = ["ALONE", "WITH_FAMILY", "WITH_WORKERS", "SHARED"]
export const PEOPLE_COUNT_OPTIONS = ["ONE", "TWO", "THREE", "FOUR", "FIVE_OR_MORE"]
