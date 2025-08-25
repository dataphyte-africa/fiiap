'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Building2, Search, X } from 'lucide-react'
import { setUserOrganisation, getOrganisationsForSearch } from '@/lib/data/admin-users'
import type { Database } from '@/types/db'

type Organisation = Pick<Database['public']['Tables']['organisations']['Row'], 'id' | 'name' | 'type' | 'country'>

interface SetUserOrganisationModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    name: string
    avatar_url: string | null
    currentOrganisationId: string | null
    currentOrganisationName: string | null
  }
  onSuccess: () => void
}

export function SetUserOrganisationModal({ isOpen, onClose, user, onSuccess }: SetUserOrganisationModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [organisations, setOrganisations] = useState<Organisation[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedOrganisation, setSelectedOrganisation] = useState<Organisation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Search organisations when search term changes
  useEffect(() => {
    const searchOrganisations = async () => {
      if (searchTerm.trim().length < 2) {
        setOrganisations([])
        return
      }

      setIsSearching(true)
      try {
        const results = await getOrganisationsForSearch(searchTerm.trim())
        setOrganisations(results)
      } catch (error) {
        console.error('Error searching organisations:', error)
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchOrganisations, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  // Clear search when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('')
      setOrganisations([])
      setSelectedOrganisation(null)
      setError(null)
    }
  }, [isOpen])

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await setUserOrganisation(user.id, selectedOrganisation?.id || null)
      
      if (result) {
        onSuccess()
        onClose()
      } else {
        setError('Failed to update user organisation')
      }
    } catch (error) {
      setError('An error occurred while updating the user organisation')
      console.error('Error updating user organisation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setError(null)
      onClose()
    }
  }

  const clearSelection = () => {
    setSelectedOrganisation(null)
    setSearchTerm('')
    setOrganisations([])
  }

  const selectOrganisation = (org: Organisation) => {
    setSelectedOrganisation(org)
    setSearchTerm(org.name)
    setOrganisations([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Set User Organisation
          </DialogTitle>
          <DialogDescription>
            Assign this user to an organisation or remove their current assignment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              {user.currentOrganisationName && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {user.currentOrganisationName}
                </Badge>
              )}
            </div>
          </div>

          {/* Organisation Search */}
          <div className="space-y-2">
            <Label htmlFor="organisation-search">Search Organisations</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="organisation-search"
                placeholder="Type to search organisations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {selectedOrganisation && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Search Results */}
          {isSearching && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Searching...</span>
            </div>
          )}

          {!isSearching && organisations.length > 0 && (
            <div className="max-h-48 overflow-y-auto border rounded-lg">
              {organisations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => selectOrganisation(org)}
                  className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                >
                  <div className="font-medium">{org.name}</div>
                  <div className="text-sm text-gray-500">
                    {org.type} • {org.country}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Selected Organisation */}
          {selectedOrganisation && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">{selectedOrganisation.name}</p>
                  <p className="text-sm text-blue-700">
                    {selectedOrganisation.type} • {selectedOrganisation.country}
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  Selected
                </Badge>
              </div>
            </div>
          )}

          {/* Remove Organisation Option */}
          {user.currentOrganisationId && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                Or remove the user from their current organisation:
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrganisation(null)}
                className="w-full"
              >
                Remove from Organisation
              </Button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || (user.currentOrganisationId === selectedOrganisation?.id)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Organisation'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
