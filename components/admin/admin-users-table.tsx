'use client'

import { useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Shield, 
  Building2, 
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Users
} from 'lucide-react'
import { getAdminUsers, type AdminUserFilters, type AdminUser } from '@/lib/data/admin-users'
import { SetUserRoleModal } from './set-user-role-modal'
import { SetUserOrganisationModal } from './set-user-organisation-modal'
import type { Database } from '@/types/db'
import { useTranslations } from 'next-intl'

type UserRole = Database['public']['Enums']['user_role_enum']

const getRoleLabels = (t: (key: string) => string): Record<UserRole, string> => ({
  admin: t('admin.common.administrator'),
  cso_rep: t('admin.common.csoRepresentative'),
  donor: t('admin.common.donor'),
  media: t('admin.common.media'),
  'policy_maker': t('admin.common.policyMaker'),
  public: t('admin.common.publicUser')
})

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-800 border-red-200',
  cso_rep: 'bg-blue-100 text-blue-800 border-blue-200',
  donor: 'bg-green-100 text-green-800 border-green-200',
  media: 'bg-purple-100 text-purple-800 border-purple-200',
  'policy_maker': 'bg-orange-100 text-orange-800 border-orange-200',
  public: 'bg-gray-100 text-gray-800 border-gray-200'
}

export function AdminUsersTable() {
  const queryClient = useQueryClient()
  const t = useTranslations()
  const [filters, setFilters] = useState<AdminUserFilters>({
    page: 1,
    limit: 20,
    sortBy: 'name',
    sortOrder: 'asc'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all')

  // Modal states
  const [roleModalUser, setRoleModalUser] = useState<AdminUser | null>(null)
  const [organisationModalUser, setOrganisationModalUser] = useState<AdminUser | null>(null)
  
  const ROLE_LABELS = getRoleLabels(t)

  // Fetch users with React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users', filters, searchTerm, selectedRole],
    queryFn: () => getAdminUsers({
      ...filters,
      search: searchTerm || undefined,
      role: selectedRole === 'all' ? undefined : selectedRole,
    }),
    staleTime: 0, // 5 minutes
  })

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
    setFilters(prev => ({ ...prev, page: 1 }))
  }, [])

  const handleRoleFilter = useCallback((role: UserRole | 'all') => {
    setSelectedRole(role)
    setFilters(prev => ({ ...prev, page: 1 }))
  }, [])

 

  const handleSort = useCallback((sortBy: AdminUserFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }))
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])

  const handleSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin-users'] })
  }, [queryClient])

  const openRoleModal = (user: AdminUser) => {
    setRoleModalUser(user)
  }

  const openOrganisationModal = (user: AdminUser) => {
    setOrganisationModalUser(user)
  }

  const closeRoleModal = () => {
    setRoleModalUser(null)
  }

  const closeOrganisationModal = () => {
    setOrganisationModalUser(null)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>{t('admin.errors.loading')}: {error instanceof Error ? error.message : 'Unknown error'}</p>
            <Button onClick={() => refetch()} className="mt-2">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('admin.common.refresh')}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('admin.pages.users.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('admin.common.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Role Filter */}
            <Select value={selectedRole} onValueChange={handleRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t('admin.common.filter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.common.all')}</SelectItem>
                {Object.entries(ROLE_LABELS).map(([role, label]) => (
                  <SelectItem key={role} value={role}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      {t('admin.common.name')}
                      {filters.sortBy === 'name' && (
                        <span className="text-xs text-gray-500">
                          {filters.sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>{t('admin.common.status')}</TableHead>
                  <TableHead>{t('admin.common.organisation')}</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-1">
                      {t('admin.common.created')}
                      {filters.sortBy === 'created_at' && (
                        <span className="text-xs text-gray-500">
                          {filters.sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>{t('admin.common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                        <span className="ml-2 text-gray-500">{t('admin.common.loading')}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-gray-500">
                        <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>{t('admin.common.noResults')}</p>
                        {searchTerm && <p className="text-sm">{t('admin.common.noResults')}</p>}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            {user.title && (
                              <div className="text-sm text-gray-500">{user.title}</div>
                            )}
                            {user.department && (
                              <div className="text-xs text-gray-400">{user.department}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.role ? (
                          <Badge className={ROLE_COLORS[user.role]}>
                            {ROLE_LABELS[user.role]}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            {t('admin.common.none')}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.organisation_name ? (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{user.organisation_name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">{t('admin.common.none')}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {formatDate(user.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openRoleModal(user)}
                            className="flex items-center gap-1"
                          >
                            <Shield className="h-4 w-4" />
                            {t('admin.forms.edit')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openOrganisationModal(user)}
                            className="flex items-center gap-1"
                          >
                            <Building2 className="h-4 w-4" />
                            {t('admin.forms.edit')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {t('admin.common.showing')} {((data.currentPage - 1) * filters.limit) + 1} to{' '}
                {Math.min(data.currentPage * filters.limit, data.count)} {t('admin.common.of')} {data.count} {t('admin.common.results')}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.currentPage - 1)}
                  disabled={!data.hasPrevPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('admin.common.previous')}
                </Button>
                <span className="text-sm text-gray-500">
                  {t('admin.common.page')} {data.currentPage} {t('admin.common.of')} {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.currentPage + 1)}
                  disabled={!data.hasNextPage}
                >
                  {t('admin.common.next')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      {roleModalUser && (
        <SetUserRoleModal
          isOpen={!!roleModalUser}
          onClose={closeRoleModal}
          user={{
            id: roleModalUser.id,
            name: roleModalUser.name,
            avatar_url: roleModalUser.avatar_url,
            currentRole: roleModalUser.role
          }}
          onSuccess={handleSuccess}
        />
      )}

      {organisationModalUser && (
        <SetUserOrganisationModal
          isOpen={!!organisationModalUser}
          onClose={closeOrganisationModal}
          user={{
            id: organisationModalUser.id,
            name: organisationModalUser.name,
            avatar_url: organisationModalUser.avatar_url,
            currentOrganisationId: organisationModalUser.organisation_id,
            currentOrganisationName: organisationModalUser.organisation_name
          }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}
