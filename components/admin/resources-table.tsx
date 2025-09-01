'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  BookOpen,
  Download,
  Edit,
  Eye,
  EyeOff,
  FileText,
  Plus,
  Search,
  Star,
  StarOff,
  Trash2,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { getResourceLibrary, deleteResource, updateResource, type ResourceLibraryFilters } from '@/lib/data/admin-content';
import { ResourceForm } from './resource-form';
import { Database } from '@/types/db';
import { ResourceLibraryFormData } from '@/lib/schemas/admin-content-schemas';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

export function ResourcesTable() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ResourceLibraryFilters>({
    page: 1,
    limit: 20,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState<string>('all');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('all');

  // Modal states
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    resourceData?: Database['public']['Tables']['resource_library']['Row'] | null;
  }>({
    isOpen: false,
    mode: 'create',
    resourceData: null,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    resourceId: string | null;
    resourceTitle: string;
  }>({
    isOpen: false,
    resourceId: null,
    resourceTitle: '',
  });

  // Fetch resources with React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['resources', filters, searchTerm, selectedResourceType, selectedVisibility],
    queryFn: () => getResourceLibrary({
      ...filters,
      search: searchTerm || undefined,
      resource_type: selectedResourceType === 'all' ? undefined : selectedResourceType,
      is_visible: selectedVisibility === 'all' ? undefined : selectedVisibility === 'visible',
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('Resource deleted successfully!');
      setDeleteModal({ isOpen: false, resourceId: null, resourceTitle: '' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete resource');
    },
  });

  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: ({ id, is_visible }: { id: string; is_visible: boolean }) =>
      updateResource(id, { is_visible }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('Resource visibility updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update visibility');
    },
  });

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, is_featured }: { id: string; is_featured: boolean }) =>
      updateResource(id, { is_featured }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('Resource featured status updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update featured status');
    },
  });

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleResourceTypeFilter = useCallback((resourceType: string) => {
    setSelectedResourceType(resourceType);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleVisibilityFilter = useCallback((visibility: string) => {
    setSelectedVisibility(visibility);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleSort = useCallback((sortBy: ResourceLibraryFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handleEdit = (resource: Database['public']['Tables']['resource_library']['Row']) => {
    setFormModal({
      isOpen: true,
      mode: 'edit',
      resourceData: resource,
    });
  };

  const handleDelete = (resource: Database['public']['Tables']['resource_library']['Row']) => {
    setDeleteModal({
      isOpen: true,
      resourceId: resource.id,
      resourceTitle: resource.title,
    });
  };

  const handleToggleVisibility = (resource: Database['public']['Tables']['resource_library']['Row']) => {
    toggleVisibilityMutation.mutate({
      id: resource.id,
      is_visible: !resource.is_visible,
    });
  };

  const handleToggleFeatured = (resource: Database['public']['Tables']['resource_library']['Row']) => {
    toggleFeaturedMutation.mutate({
      id: resource.id,
      is_featured: !resource.is_featured,
    });
  };

  const getResourceTypeBadge = (resourceType: string) => {
    const colors: Record<string, string> = {
      toolkit: 'bg-blue-100 text-blue-800',
      research_paper: 'bg-green-100 text-green-800',
      guide: 'bg-purple-100 text-purple-800',
      template: 'bg-orange-100 text-orange-800',
      video: 'bg-red-100 text-red-800',
      document: 'bg-yellow-100 text-yellow-800',
      report: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800',
    };

    const labels: Record<string, string> = {
      research_paper: 'Research Paper',
      other: 'Other',
    };

    return (
      <Badge className={colors[resourceType] || colors.other}>
        {labels[resourceType] || resourceType?.toUpperCase()}
      </Badge>
    );
  };

  const getResourceIcon = (resourceType: string) => {
    const icons: Record<string, React.ReactNode> = {
      toolkit: <BookOpen className="h-4 w-4" />,
      research_paper: <FileText className="h-4 w-4" />,
      guide: <BookOpen className="h-4 w-4" />,
      template: <FileText className="h-4 w-4" />,
      video: <FileText className="h-4 w-4" />,
      document: <FileText className="h-4 w-4" />,
      report: <FileText className="h-4 w-4" />,
      other: <FileText className="h-4 w-4" />,
    };

    return icons[resourceType] || icons.other;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-600 mb-4">Failed to load resources</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Resource Library</h2>
          <p className="text-muted-foreground">
            Manage toolkits, research papers, and educational materials
          </p>
        </div>
        <Button onClick={() => setFormModal({ isOpen: true, mode: 'create' })}>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedResourceType} onValueChange={handleResourceTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Resource Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="toolkit">Toolkit</SelectItem>
                <SelectItem value="research_paper">Research Paper</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedVisibility} onValueChange={handleVisibilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              {data?.count || 0} resources found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('title')}
                >
                  Title {filters.sortBy === 'title' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Author</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('created_at')}
                >
                  Created {filters.sortBy === 'created_at' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No resources found
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {resource.image_url ? (
                          <img
                            src={resource.image_url}
                            alt={resource.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                            {getResourceIcon(resource.resource_type)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{resource.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {resource.description?.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getResourceTypeBadge(resource.resource_type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {resource.author_name || 'Unknown'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {resource.created_at ? format(new Date(resource.created_at), 'MMM dd, yyyy') : 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={resource.is_visible ? 'default' : 'secondary'}>
                          {resource.is_visible ? 'Visible' : 'Hidden'}
                        </Badge>
                        {resource.is_featured && (
                            <Badge variant="outline" className="w-fit">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      
                        
                        <div className="flex items-center gap-2">
                          {resource.file_url && (
                            <Tooltip>
                              <TooltipContent>Download Resource</TooltipContent>
                              <TooltipTrigger asChild>
                              <Button asChild size="icon" variant="outline" >
                                <a 
                                  href={resource.file_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                </a>
                              </Button>
                              </TooltipTrigger>
                            </Tooltip>
                          )}
                          <Tooltip>
                            <TooltipContent>Edit Resource</TooltipContent>
                            <TooltipTrigger asChild>
                          <Button size="icon" variant="outline" className="border-blue-500" onClick={() => handleEdit(resource)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          </TooltipTrigger>
                          </Tooltip>
                          <Tooltip>
                            <TooltipContent>Toggle Visibility</TooltipContent>
                            <TooltipTrigger asChild>
                          <Button onClick={() => handleToggleVisibility(resource)} size="icon" variant="outline"    >
                            {resource.is_visible ? (
                                <><EyeOff className="h-4 w-4" /></>
                            ) : (
                              <><Eye className="h-4 w-4" /></>
                            )}
                          </Button>
                          </TooltipTrigger>
                          </Tooltip>
                          <Tooltip>
                            <TooltipContent>{resource.is_featured ? 'Unfeature' : 'Feature'} Resource</TooltipContent>
                            <TooltipTrigger asChild>
                          <Button onClick={() => handleToggleFeatured(resource)} size="icon" variant="outline"    >
                            {resource.is_featured ? (
                              <><StarOff className="h-4 w-4 mr-2" />  </>
                            ) : (
                              <><Star className="h-4 w-4 mr-2" /> </>
                            )}
                          </Button>
                          </TooltipTrigger>
                          </Tooltip>
                          <Tooltip>
                            <TooltipContent>Delete Resource</TooltipContent>
                            <TooltipTrigger asChild>
                          <Button 
                            onClick={() => handleDelete(resource)}
                            size="icon"
                            variant="outline"
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />                            
                          </Button>
                          </TooltipTrigger>
                          </Tooltip>
                        </div>
                      
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(filters.page! - 1)}
            disabled={!data.hasPrevPage}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {data.currentPage} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(filters.page! + 1)}
            disabled={!data.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}

      {/* Form Modal */}
      <Dialog open={formModal.isOpen} onOpenChange={(open) => setFormModal({ ...formModal, isOpen: open })}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ResourceForm
            initialData={formModal.resourceData as ResourceLibraryFormData || {
              title: '',
              resource_type: 'toolkit',
              is_visible: true,
              is_featured: false,
            }}
            mode={formModal.mode}
            onSuccess={() => setFormModal({ isOpen: false, mode: 'create', resourceData: null })}
            onCancel={() => setFormModal({ isOpen: false, mode: 'create', resourceData: null })}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal.isOpen} onOpenChange={(open) => setDeleteModal({ ...deleteModal, isOpen: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteModal.resourceTitle}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, resourceId: null, resourceTitle: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteModal.resourceId && deleteMutation.mutate(deleteModal.resourceId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
