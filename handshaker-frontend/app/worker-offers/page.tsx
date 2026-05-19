"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Check,
  X,
  Loader2,
} from "lucide-react"

import {
  fetchWorkerOffers,
  markInterested,
  rejectOffer,
} from "@/lib/cv-api"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"

import type { JobOffer } from "@/lib/cv-types"

export default function WorkerOffersPage() {
  const { user, isLoading } = useAuth()

  const [offers, setOffers] = useState<JobOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null)

  useEffect(() => {
    if (!isLoading && user?.role === "USER") {
      fetchWorkerOffers()
        .then(setOffers)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [isLoading, user])

  const handleInterested = async (id: string) => {
    setActionLoading(id)
    try {
      await markInterested(id)

      setOffers((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status: "INTERESTED" } : o
        )
      )
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    setActionLoading(id)
    try {
      await rejectOffer(id)

      setOffers((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status: "REJECTED" } : o
        )
      )
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SENT":
        return "bg-yellow-100 text-yellow-700"
      case "VIEWED":
        return "bg-blue-100 text-blue-700"
      case "INTERESTED":
        return "bg-green-100 text-green-700"
      case "REJECTED":
        return "bg-red-100 text-red-700"
      default:
        return ""
    }
  }

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-8 px-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">My Job Offers</h1>
          <p className="text-muted-foreground">
            Offers sent to you by companies
          </p>
        </div>

        {/* Empty state */}
        {offers.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Briefcase className="mx-auto mb-4 size-10 text-muted-foreground" />
              <p className="text-muted-foreground">
                No offers yet
              </p>
            </CardContent>
          </Card>
        )}

        {/* Offers list */}
        <div className="space-y-4">
          {offers.map((offer) => (
            <Card key={offer.id}>
              <CardContent className="p-6 space-y-4">
                {/* Title */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {offer.position}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {offer.industry}
                    </p>
                  </div>

                  <Badge className={getStatusColor(offer.status)}>
                    {offer.status}
                  </Badge>
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <MapPin className="size-3" />
                    {offer.location.city}
                  </Badge>

                  <Badge variant="secondary" className="gap-1">
                    <DollarSign className="size-3" />
                    EUR {offer.salaryAmount}
                  </Badge>

                  <Badge variant="secondary" className="gap-1">
                    <Clock className="size-3" />
                    {offer.workingHoursPerDay}h/day
                  </Badge>
                </div>

                {/* Description */}
                {offer.description && (
                  <p className="text-sm text-muted-foreground">
                    {offer.description}
                  </p>
                )}

                {/* Actions */}
                {(offer.status === "SENT" ||
                  offer.status === "VIEWED") && (
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => handleInterested(offer.id)}
                      disabled={actionLoading === offer.id}
                    >
                      {actionLoading === offer.id ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <Check className="mr-2 size-4" />
                      )}
                      Interested
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleReject(offer.id)}
                      disabled={actionLoading === offer.id}
                    >
                      <X className="mr-2 size-4" />
                      Reject
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setSelectedOffer(offer)}
                    >
                    View Details
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Dialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
  <DialogContent className="max-w-2xl">
    {selectedOffer && (
      <>
        <DialogHeader>
          <DialogTitle className="text-xl">
            {selectedOffer.position}
          </DialogTitle>
          <p className="text-muted-foreground">
            {selectedOffer.industry}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="size-4 text-muted-foreground" />
            {selectedOffer.location.street} {selectedOffer.location.streetNumber},{" "}
            {selectedOffer.location.city}, {selectedOffer.location.country}
          </div>

          {/* Salary */}
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="size-4 text-muted-foreground" />
            EUR {selectedOffer.salaryAmount} /{" "}
            {selectedOffer.salaryType === "MONTHLY" ? "month" : "hour"}
          </div>

          {/* Schedule */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="size-4 text-muted-foreground" />
            {selectedOffer.workingHoursPerDay}h/day •{" "}
            {selectedOffer.workingDaysPerMonth} days/month
          </div>

          {/* Work type */}
          <div className="text-sm">
            <span className="font-medium">Work type:</span>{" "}
            {selectedOffer.workType.replace("_", " ")}
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap gap-2">
            {selectedOffer.accommodationProvided && (
              <Badge className="bg-green-100 text-green-700">
                Accommodation provided
              </Badge>
            )}
            {selectedOffer.transportationProvided && (
              <Badge className="bg-blue-100 text-blue-700">
                Transportation provided
              </Badge>
            )}
          </div>

          {/* Description */}
          {selectedOffer.description && (
            <div>
              <p className="font-medium mb-1">Job description</p>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {selectedOffer.description}
              </p>
            </div>
          )}

          {/* Actions */}
          {(selectedOffer.status === "SENT" ||
            selectedOffer.status === "VIEWED") && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => handleInterested(selectedOffer.id)}
                className="flex-1"
              >
                Interested
              </Button>

              <Button
                variant="outline"
                onClick={() => handleReject(selectedOffer.id)}
                className="flex-1"
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      </>
    )}
  </DialogContent>
</Dialog>
    </div>
  )
}