import { Building2, Users, MapPin, ExternalLink, UserPlus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { AffiliationRequestDialog } from "@/components/organisations/affiliation-request-dialog"



interface OrganisationSummaryCardProps {
  userId: string
  className?: string
}



export async function OrganisationSummaryCard({
  userId,
  className
}: OrganisationSummaryCardProps) {
  const supabase = await createClient()
  const { data: organisation, error } = await supabase.from('organisations').select('*').eq('created_by', userId).single()

  if (!organisation && error) {
    return (
      <Card className={cn(
        "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
        className
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Organisation</CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-sm mb-2">No Organisation Linked</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Register your organisation or join an existing one to start collaborating with other CSOs in the region.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild size="sm">
              <Link href={`/dashboard/organisation/`}>Register Organisation</Link>
            </Button>
            <AffiliationRequestDialog 
              userId={userId}
              trigger={
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join Organisation
                </Button>
              }
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  const statusColor = {
    active: "bg-green-100 text-green-800",
    pending_approval: "bg-yellow-100 text-yellow-800",
    flagged: "bg-red-100 text-red-800",
    inactive: "bg-gray-100 text-gray-800"
  }[organisation.status || "inactive"] || "bg-gray-100 text-gray-800"

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Organisation</CardTitle>
          <Building2 className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          {organisation.logo_url ? (
            <Image 
              src={organisation.logo_url} 
              alt={`${organisation.name} logo`}
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg object-cover bg-muted"
            />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate mb-1">{organisation.name}</h3>
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <MapPin className="h-3 w-3 mr-1" />
              {organisation.city ? `${organisation.city}, ${organisation.country}` : organisation.country}
            </div>
            <p className="text-xs text-muted-foreground capitalize">{organisation.type}</p>
          </div>
        </div>

        {organisation.staff_count && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>{organisation.staff_count} staff members</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={cn("text-xs", statusColor)}>
            {organisation.status?.replace('_', ' ')}
          </Badge>
          <div className="flex space-x-2">
            {organisation.website_url && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  if (!organisation.website_url) return
                  e.stopPropagation()
                  window.open(organisation.website_url, '_blank')
                }}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={`/dashboard/organisation`}>View Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 