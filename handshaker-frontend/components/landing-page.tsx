"use client"

import React from "react"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Shield,
  Zap,
} from "lucide-react"

export function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center px-4 pb-20 pt-24 text-center sm:px-6 lg:pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5">
            <Zap className="size-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Build your professional CV in minutes
            </span>
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Create a standout CV tailored to your profession
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Our step-by-step builder guides you through creating a professional CV with
            fields specific to your industry. From drivers to developers, we have you
            covered.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {user ? (
              <Button
                size="lg"
                className="gap-2"
                onClick={() => router.push("/cv-builder")}
              >
                Start Building
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => router.push("/auth?mode=register")}
                >
                  Get Started Free
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/auth?mode=login")}
                >
                  Log in
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Everything you need to build a great CV
            </h2>
            <p className="mt-3 text-muted-foreground">
              Designed to make the process simple, fast, and professional.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Briefcase className="size-6" />}
              title="Profession-Specific"
              description="Select your profession and get fields tailored to your industry. Drivers, nurses, chefs, and more."
            />
            <FeatureCard
              icon={<CheckCircle2 className="size-6" />}
              title="Step-by-Step Guide"
              description="Follow a simple wizard that walks you through each section of your CV, one step at a time."
            />
            <FeatureCard
              icon={<Shield className="size-6" />}
              title="User & Company Accounts"
              description="Register as an individual or a company. Manage your CV profiles with a secure account."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground">How it works</h2>
            <p className="mt-3 text-muted-foreground">
              Three simple steps to your professional CV.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <StepCard
              number="01"
              title="Fill in your details"
              description="Enter your profile information like name, email, phone, and a personal summary."
            />
            <StepCard
              number="02"
              title="Choose your profession"
              description="Pick from a range of professions. Specify which professions are you interested in."
            />
            <StepCard
              number="03"
              title="Sit back & relax"
              description="Sit back while employers find YOU, not the other way around."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <FileText className="mx-auto mb-4 size-10 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">
            Ready to build your profile?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Join thousands of professionals who have created their profiles with our builder.
          </p>
          <div className="mt-8">
            {user ? (
              <Button
                size="lg"
                className="gap-2"
                onClick={() => router.push("/profile")}
              >
                Go to your profile
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                size="lg"
                className="gap-2"
                onClick={() => router.push("/auth?mode=register")}
              >
                Create Free Account
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">HandShaker</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {"Built to help you land your next opportunity."}
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <span className="text-sm font-bold">{number}</span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
