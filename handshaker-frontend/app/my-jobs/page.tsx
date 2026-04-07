"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Home,
  Car,
  Plus,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react"
import { fetchCompanyJobs, deleteJobAd } from "@/lib/cv-api"
import type { JobAd } from "@/lib/cv-types"
import { INDUSTRIES, POSITION_OPTIONS } from "@/lib/cv-types"

export default function MyJobsPage() {
  const { user, isLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const [jobs, setJobs] = useState<JobAd[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && user?.role === "COMPANY") {
      fetchCompanyJobs()
        .then(setJobs)
        .catch(console.error)
        .finally(() => setIsFetching(false))
    }
  }, [isLoading, user])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteJobAd(id)
      setJobs(jobs.filter((j) => j.id !== id))
    } catch (err) {
      console.error("Failed to delete job:", err)
    } finally {
      setDeletingId(null)
    }
  }

  const getIndustryLabel = (value: string) => {
    return INDUSTRIES.find((i) => i.value === value)?.label || value
  }

  if (isLoading || !user || user.role !== "COMPANY" || isFetching) {
    return (
      <>
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
            <span>Loading jobs...</span>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Job Ads</h1>
              <p className="text-muted-foreground">
                Manage your job postings and create new ones
              </p>
            </div>
            <Button asChild>
              <Link href="/create-job">
                <Plus className="mr-2 size-4" />
                Create New Job
              </Link>
            </Button>
          </div>

          {/* Jobs List */}
          {jobs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Briefcase className="size-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No job ads yet
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                  Create your first job ad to start attracting candidates.
                </p>
                <Button asChild>
                  <Link href="/create-job">
                    <Plus className="mr-2 size-4" />
                    Create Job Ad
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      {/* Job Info */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {job.position}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {getIndustryLabel(job.industry)}
                          </p>
                        </div>

                        {job.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {job.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {/* Location */}
                          <Badge variant="secondary" className="gap-1">
                            <MapPin className="size-3" />
                            {job.location.city}, {job.location.country}
                          </Badge>

                          {/* Salary */}
                          <Badge variant="secondary" className="gap-1">
                            <DollarSign className="size-3" />
                            EUR {job.salaryAmount}
                            {job.salaryType === "MONTHLY" ? "/mo" : "/hr"}
                          </Badge>

                          {/* Hours */}
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="size-3" />
                            {job.workingHoursPerDay}h/day, {job.workingDaysPerMonth} days/mo
                          </Badge>

                          {/* Accommodation */}
                          {job.accommodationProvided && (
                            <Badge variant="outline" className="gap-1 text-green-600 border-green-200 bg-green-50">
                              <Home className="size-3" />
                              Accommodation
                            </Badge>
                          )}

                          {/* Transportation */}
                          {job.transportationProvided && (
                            <Badge variant="outline" className="gap-1 text-blue-600 border-blue-200 bg-blue-50">
                              <Car className="size-3" />
                              Transportation
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex sm:flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/create-job?edit=${job.id}`)}
                        >
                          <Pencil className="mr-2 size-4" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              disabled={deletingId === job.id}
                            >
                              {deletingId === job.id ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                              ) : (
                                <Trash2 className="mr-2 size-4" />
                              )}
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Job Ad?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete
                                the job ad for &quot;{job.position}&quot;.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(job.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
