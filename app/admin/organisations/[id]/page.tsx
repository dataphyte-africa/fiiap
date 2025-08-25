import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getAdminOrganisation } from '@/lib/data/organisations'
import { AdminOrganisationView } from '@/components/admin/admin-organisation-view'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface AdminOrganisationPageProps {
  params: Promise<{ id: string }>
}

async function AdminOrganisationContent({ id }: { id: string }) {
  try {
    const organisation = await getAdminOrganisation(id)
    
    if (!organisation) {
      notFound()
    }

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <div>
          <Link 
            href="/admin/organisations" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Organisations
          </Link>
        </div>

        {/* Organisation View */}
        <AdminOrganisationView 
          organisation={organisation}
        />
      </div>
    )
  } catch (error) {
    console.error('Error fetching organisation:', error)
    notFound()
  }
}

function AdminOrganisationSkeleton() {
  return (
    <div className="space-y-6">
      {/* Back Button Skeleton */}
      <div>
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Header Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-64" />
              <div className="flex gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function AdminOrganisationPage({ params }: AdminOrganisationPageProps) {
  const { id } = await params

  return (
    <div className="container mx-auto py-6 px-4">
      <Suspense fallback={<AdminOrganisationSkeleton />}>
        <AdminOrganisationContent id={id} />
      </Suspense>
    </div>
  )
}
