"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { CVBuilder } from "@/components/cv-builder"

export default function CVBuilderPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth?mode=login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">CV Builder</h1>
          <p className="text-muted-foreground">
            Build your professional CV in just a few steps
          </p>
        </div>
        <CVBuilder />
      </div>
    </main>
  )
}
