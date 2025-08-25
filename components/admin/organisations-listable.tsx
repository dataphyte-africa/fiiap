'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getAdminOrganisations, 
  updateOrganisationStatus, 
  toggleOrganisationVerification,
  getOrganisationStats,
  type AdminOrganisationFilters
} from '@/lib/data/organisations';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Flag, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import type { Database } from '@/types/db';
import Link from 'next/link';

type Organisation = Database['public']['Tables']['organisations']['Row'];
type OrganisationStatus = Database['public']['Enums']['organisation_status_enum'];
type OrganisationType = Database['public']['Enums']['organisation_type_enum'];
type Country = Database['public']['Enums']['country_enum'];

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800 border-green-200',
  pending_approval: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  flagged: 'bg-red-100 text-red-800 border-red-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
} as const;

const STATUS_LABELS = {
  active: 'Active',
  pending_approval: 'Pending',
  flagged: 'Flagged',
  inactive: 'Inactive',
} as const;

export default function OrganisationsListable() {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    flagged: 0,
    inactive: 0,
  });
  const [filters, setFilters] = useState<AdminOrganisationFilters>({
    page: 1,
    limit: 20,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    count: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<OrganisationStatus | 'all'>('all');
  const [selectedTypes, setSelectedTypes] = useState<OrganisationType | 'all'>('all');
  const [selectedCountries, setSelectedCountries] = useState<Country | 'all'>('all');

  const fetchOrganisations = useCallback(async () => {
    try {
       setLoading(true);
      const result = await getAdminOrganisations({
        ...filters,
        name: searchTerm || undefined,
        status: selectedStatuses === 'all' ? undefined : selectedStatuses,
        types: selectedTypes === 'all' ? undefined : selectedTypes,
        countries: selectedCountries === 'all' ? undefined : selectedCountries,
      });
      
      setOrganisations(result.data);
      setPagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        count: result.count,
      });
    } catch (error) {
      console.error('Error fetching organisations:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm, selectedStatuses, selectedTypes, selectedCountries]);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await getOrganisationStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchOrganisations();
    fetchStats();
  }, [fetchOrganisations, fetchStats]);

  const handleStatusUpdate = async (organisationId: string, newStatus: OrganisationStatus) => {
    setActionLoading(prev => new Set(prev).add(organisationId));
    try {
      const result = await updateOrganisationStatus(organisationId, newStatus);
      if (result.success) {
        // Update local state
        setOrganisations(prev => 
          prev.map(org => 
            org.id === organisationId 
              ? { ...org, status: newStatus }
              : org
          )
        );
        // Refresh stats
        fetchStats();
      } else {
        console.error('Failed to update status:', result.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(organisationId);
        return newSet;
      });
    }
  };

  const handleVerificationToggle = async (organisationId: string, verified: boolean) => {
    setActionLoading(prev => new Set(prev).add(organisationId));
    try {
      const result = await toggleOrganisationVerification(organisationId, verified);
      if (result.success) {
        setOrganisations(prev => 
          prev.map(org => 
            org.id === organisationId 
              ? { ...org, verified }
              : org
          )
        );
      } else {
        console.error('Failed to toggle verification:', result.error);
      }
    } catch (error) {
      console.error('Error toggling verification:', error);
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(organisationId);
        return newSet;
      });
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSort = (sortBy: AdminOrganisationFilters['sortBy']) => {
    if (!sortBy) return;
    
    setFilters(prev => ({ 
      ...prev, 
      sortBy, 
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1 
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatuses('all');
    setSelectedTypes('all');
    setSelectedCountries('all');
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && organisations.length === 0) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Flagged</p>
            <p className="text-2xl font-bold text-red-600">{stats.flagged}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Inactive</p>
            <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organisations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
              
                value={selectedStatuses}
                onValueChange={(value) => setSelectedStatuses(value as OrganisationStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending_approval">Pending Approval</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={selectedTypes}
                onValueChange={(value) => setSelectedTypes(value as OrganisationType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="NGO">NGO</SelectItem>
                  <SelectItem value="CBO">CBO</SelectItem>
                  <SelectItem value="Network">Network</SelectItem>
                  <SelectItem value="Foundation">Foundation</SelectItem>
                  <SelectItem value="Coalition">Coalition</SelectItem>
                  <SelectItem value="Association">Association</SelectItem>
                  <SelectItem value="Cooperative">Cooperative</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Select
                value={selectedCountries}
                onValueChange={(value) => setSelectedCountries(value as Country)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All countries</SelectItem>
                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                  <SelectItem value="Benin">Benin</SelectItem>
                  <SelectItem value="Gambia">Gambia</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button variant="ghost" onClick={fetchOrganisations} size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Organisations Table */}
      {
        loading ? 
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>:
        <Card>
        <CardHeader>
          <CardTitle>Organisations ({pagination.count})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50" 
                      onClick={() => handleSort('name')}>
                    Name
                  </th>
                  <th className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50" 
                      onClick={() => handleSort('type')}>
                    Type
                  </th>
                  <th className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50" 
                      onClick={() => handleSort('country')}>
                    Country
                  </th>
                  <th className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50" 
                      onClick={() => handleSort('status')}>
                    Status
                  </th>
                  <th className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50" 
                      onClick={() => handleSort('created_at')}>
                    Created
                  </th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organisations.map((organisation) => (
                  <tr key={organisation.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div className="flex flex-col">
                        <div className="font-medium">{organisation.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {organisation.country}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary">{organisation.type}</Badge>
                    </td>
                    <td className="p-3">{organisation.country}</td>
                    <td className="p-3">
                      <Badge className={STATUS_COLORS[organisation.status || 'inactive']}>
                        {STATUS_LABELS[organisation.status || 'inactive']}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {formatDate(organisation.created_at)}
                    </td>
                    <td className="p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/organisations/${organisation.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          
                          {organisation.status === 'pending_approval' && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(organisation.id, 'active')}
                              disabled={actionLoading.has(organisation.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {actionLoading.has(organisation.id) ? 'Updating...' : 'Approve'}
                            </DropdownMenuItem>
                          )}
                          
                          {organisation.status === 'active' && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(organisation.id, 'flagged')}
                                disabled={actionLoading.has(organisation.id)}
                              >
                                <Flag className="h-4 w-4 mr-2" />
                                {actionLoading.has(organisation.id) ? 'Updating...' : 'Flag'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(organisation.id, 'inactive')}
                                disabled={actionLoading.has(organisation.id)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                {actionLoading.has(organisation.id) ? 'Updating...' : 'Deactivate'}
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          {organisation.status === 'flagged' && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(organisation.id, 'active')}
                              disabled={actionLoading.has(organisation.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {actionLoading.has(organisation.id) ? 'Updating...' : 'Reactivate'}
                            </DropdownMenuItem>
                          )}
                          
                          {organisation.status === 'inactive' && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(organisation.id, 'active')}
                              disabled={actionLoading.has(organisation.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {actionLoading.has(organisation.id) ? 'Updating...' : 'Reactivate'}
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem 
                            onClick={() => handleVerificationToggle(organisation.id, !organisation.verified)}
                            disabled={actionLoading.has(organisation.id)}
                          >
                            {organisation.verified ? (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                {actionLoading.has(organisation.id) ? 'Updating...' : 'Unverify'}
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {actionLoading.has(organisation.id) ? 'Updating...' : 'Verify'}
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.currentPage - 1) * (filters.limit || 20)) + 1} to{' '}
                {Math.min(pagination.currentPage * (filters.limit || 20), pagination.count)} of{' '}
                {pagination.count} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      }
      
    </div>
  );
}
