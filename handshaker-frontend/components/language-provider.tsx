"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"
import en from "@/lib/i18n/en.json"
import hr from "@/lib/i18n/hr.json"

export type Locale = "en" | "hr"

const translations: Record<Locale, Record<string, unknown>> = { en, hr }

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".")
  let current: unknown = obj
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return path
    }
    current = (current as Record<string, unknown>)[key]
  }
  return typeof current === "string" ? current : path
}

const defaultT = (key: string): string => getNestedValue(translations.en, key)

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: defaultT,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  useEffect(() => {
    const saved = localStorage.getItem("cvbuilder-lang") as Locale | null
    if (saved === "en" || saved === "hr") {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("cvbuilder-lang", newLocale)
  }, [])

  const t = useCallback(
    (key: string): string => getNestedValue(translations[locale], key),
    [locale],
  )

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
