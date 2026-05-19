"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2, Sparkles } from "lucide-react"
import { activateSubscription, type SubscriptionPlan } from "@/lib/cv-api"

interface PlanFeature {
  text: string
  included: boolean
}

interface Plan {
  id: SubscriptionPlan
  name: string
  price: string
  period: string
  description: string
  features: PlanFeature[]
  recommended?: boolean
  buttonText: string
}

const PLANS: Plan[] = [
  {
    id: "BASIC",
    name: "Basic",
    price: "€29",
    period: "/month",
    description: "For small businesses getting started with hiring.",
    features: [
      { text: "Up to 5 job postings", included: true },
      { text: "Basic candidate search", included: true },
      { text: "Email support", included: true },
      { text: "10 profile views per month", included: true },
      { text: "Priority listing", included: false },
      { text: "Advanced filters", included: false },
    ],
    buttonText: "Start Basic",
  },
  {
    id: "PRO",
    name: "Pro",
    price: "€79",
    period: "/month",
    description: "For growing companies with regular hiring needs.",
    features: [
      { text: "Up to 25 job postings", included: true },
      { text: "Advanced candidate search", included: true },
      { text: "Priority email support", included: true },
      { text: "50 profile views per month", included: true },
      { text: "Priority listing", included: true },
      { text: "Advanced filters", included: true },
    ],
    recommended: true,
    buttonText: "Upgrade to Pro",
  },
  {
    id: "AGENCY",
    name: "Agency",
    price: "€199",
    period: "/month",
    description: "For agencies and enterprises with high-volume hiring.",
    features: [
      { text: "Unlimited job postings", included: true },
      { text: "Full candidate database access", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Unlimited profile views", included: true },
      { text: "Priority listing", included: true },
      { text: "API access & integrations", included: true },
    ],
    buttonText: "Contact Sales",
  },
]

export default function SubscriptionPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activatingPlan, setActivatingPlan] = useState<SubscriptionPlan | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  if (isLoading) {
    return (
      <>
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </>
    )
  }

  if (!user || user.role !== "COMPANY") {
    router.push("/")
    return null
  }

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    setActivatingPlan(plan)
    setError("")
    setSuccess("")

    try {
      await activateSubscription(plan)
      setSuccess(`Successfully activated ${plan} plan!`)
      setTimeout(() => {
        router.push("/company-profile")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate subscription.")
    } finally {
      setActivatingPlan(null)
    }
  }

  return (
    <>
      <main className="min-h-[calc(100vh-4rem)] bg-background py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Plans and Pricing
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Choose the perfect plan for your hiring needs. Upgrade anytime for more features and access.
            </p>
          </div>

          {/* Status messages */}
          {error && (
            <div className="mb-8 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive max-w-md mx-auto text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-8 rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400 max-w-md mx-auto text-center">
              {success}
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={`relative flex flex-col ${
                  plan.recommended
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground gap-1">
                      <Sparkles className="size-3" />
                      Recommended
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-3 text-sm">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check
                          className={`size-5 shrink-0 mt-0.5 ${
                            feature.included
                              ? "text-primary"
                              : "text-muted-foreground/40"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            feature.included
                              ? "text-foreground"
                              : "text-muted-foreground/60 line-through"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-6 w-full"
                    variant={plan.recommended ? "default" : "outline"}
                    disabled={activatingPlan !== null}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {activatingPlan === plan.id ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Activating...
                      </>
                    ) : (
                      plan.buttonText
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer note */}
          <p className="mt-10 text-center text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required to start.
          </p>
        </div>
      </main>
    </>
  )
}
