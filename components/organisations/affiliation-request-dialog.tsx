"use client"

import { useState, useEffect } from "react"
import { Search, Building2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { searchOrganisationsForAffiliation } from "@/lib/data/organisations"
import { useCreateAffiliationRequest } from "@/hooks/use-affiliation-requests"
import { useQueryClient } from "@tanstack/react-query"
import type { Database } from "@/types/db"

type Organisation = Database['public']['Tables']['organisations']['Row']

interface AffiliationRequestDialogProps {
  userId: string
  trigger?: React.ReactNode
}

export function AffiliationRequestDialog({ userId, trigger }: AffiliationRequestDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Partial<Organisation>[]>([])
  const [selectedOrganisation, setSelectedOrganisation] = useState<Partial<Organisation> | null>(null)
  const [requestMessage, setRequestMessage] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const createAffiliationRequestMutation = useCreateAffiliationRequest()
  const queryClient = useQueryClient()

  // Search organisations when search term changes
  useEffect(() => {
    const searchOrganisations = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      setError("")
      
      try {
        const results = await searchOrganisationsForAffiliation(searchTerm, 8)
        setSearchResults(results)
      } catch (err) {
        setError("Failed to search organisations. Please try again.")
        console.error("Search error:", err)
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchOrganisations, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const handleOrganisationSelect = (org: Partial<Organisation>) => {
    setSelectedOrganisation(org)
    setSearchTerm(org.name || "")
    setSearchResults([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedOrganisation?.id) {
      setError("Please select an organisation")
      return
    }

    setError("")
    setSuccess("")

    createAffiliationRequestMutation.mutate(
      {
        userId,
        requestData: {
          organisation_id: selectedOrganisation.id,
          request_message: requestMessage.trim() || undefined
        }
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            setSuccess("Affiliation request submitted successfully!")
            setRequestMessage("")
            setSelectedOrganisation(null)
            setSearchTerm("")
            
            // Invalidate user organization state queries to reflect the new state
            queryClient.invalidateQueries({ queryKey: ['user-profile', userId] })
            queryClient.invalidateQueries({ queryKey: ['affiliation-request', userId] })
            
            // Close dialog after a short delay
            setTimeout(() => setOpen(false), 2000)
          } else {
            setError(result.error || "Failed to submit request")
          }
        },
        onError: (err) => {
          setError("An unexpected error occurred. Please try again.")
          console.error("Submit error:", err)
        }
      }
    )
  }

  const resetForm = () => {
    setSearchTerm("")
    setSearchResults([])
    setSelectedOrganisation(null)
    setRequestMessage("")
    setError("")
    setSuccess("")
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      resetForm()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Building2 className="h-4 w-4 mr-2" />
            Join Organisation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Organisation Affiliation</DialogTitle>
          <DialogDescription>
            Search for an organisation you&apos;d like to join and submit an affiliation request.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organisation Search */}
          <div className="space-y-3">
            <Label htmlFor="organisation-search">Search Organisation</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="organisation-search"
                placeholder="Type organisation name or mission..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={createAffiliationRequestMutation.isPending}
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && !selectedOrganisation && (
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {searchResults.map((org) => (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => handleOrganisationSelect(org)}
                    className="w-full p-3 text-left hover:bg-muted transition-colors border-b last:border-b-0"
                  >
                    <div className="flex items-start space-x-3">
                      {org.logo_url ? (
                        <img
                          src={org.logo_url}
                          alt={`${org.name} logo`}
                          className="h-10 w-10 rounded-lg object-cover bg-muted"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium  text-sm">{org.name}</h4>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {org.city ? `${org.city}, ${org.country}` : org.country}
                        </div>
                        <p className="text-xs text-muted-foreground capitalize mt-1">{org.type}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {isSearching && (
              <div className="text-sm text-muted-foreground text-center py-2">
                Searching organisations...
              </div>
            )}
          </div>

          {/* Selected Organisation Display */}
          {selectedOrganisation && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-start space-x-3">
                {selectedOrganisation.logo_url ? (
                  <img
                    src={selectedOrganisation.logo_url}
                    alt={`${selectedOrganisation.name} logo`}
                    className="h-12 w-12 rounded-lg object-cover bg-background"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-background flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold">{selectedOrganisation.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {selectedOrganisation.type}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {selectedOrganisation.city ? `${selectedOrganisation.city}, ${selectedOrganisation.country}` : selectedOrganisation.country}
                    </div>
                  </div>
                  {selectedOrganisation.mission && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {selectedOrganisation.mission}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrganisation(null)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            </div>
          )}

          {/* Request Message */}
          <div className="space-y-3">
            <Label htmlFor="request-message">
              Request Message (Optional)
            </Label>
            <Textarea
              id="request-message"
              placeholder="Tell the organisation why you'd like to join and how you can contribute..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              rows={4}
              disabled={createAffiliationRequestMutation.isPending}
            />
            <p className="text-xs text-muted-foreground">
              A brief message explaining your interest in joining this organisation can help your request get approved.
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              {success}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createAffiliationRequestMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedOrganisation?.id || createAffiliationRequestMutation.isPending}
            >
              {createAffiliationRequestMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
