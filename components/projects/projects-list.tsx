/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchIcon, PlusIcon } from 'lucide-react';
import { ProjectCard } from './project-card';
import Link from 'next/link';
import { deleteProject, getProjectsForUserOrganisation, type ProjectFilters } from '@/lib/data/projects';
import type { Database } from '@/types/db';
import { CreateProjectModal } from './create-project-modal';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ProjectsListProps {
  showCreateButton?: boolean;
  organisationId: string;
}

export function ProjectsList({ showCreateButton = true, organisationId }: ProjectsListProps) {
  const t = useTranslations('projects.list')
  const [filters, setFilters] = useState<ProjectFilters>({
    search: '',
    status: undefined,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });
  const queryClient  = useQueryClient()
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    projectId: string | null;
    projectTitle: string;
  }>({
    isOpen: false,
    projectId: null,
    projectTitle: '',
  });
  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ['projects', 'user-organisation', filters],
    queryFn: () => getProjectsForUserOrganisation(organisationId),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      setDeleteModal({ projectId: null, projectTitle: '', isOpen: false });
      toast.success('Project deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['projects', 'user-organisation', filters] });
    },
    onError: (error) => {
      toast.error('Failed to delete project:', {
        description: error.message,
      });
    },
  });

  const handleDeleteProject = (projectId: string) => {
    deleteProjectMutation.mutate(projectId);
  };  

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      status: value === 'all' ? undefined : value as Database["public"]["Enums"]["project_status_enum"]
    }));
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    setFilters(prev => ({ 
      ...prev, 
      sortBy: sortBy as ProjectFilters['sortBy'],
      sortOrder: sortOrder as 'asc' | 'desc'
    }));
  };

  // Filter projects based on current filters
  const filteredProjects = projects?.filter(project => {
    const matchesSearch = !filters.search || 
      project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.summary?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = !filters.status || project.status === filters.status;

    return matchesSearch && matchesStatus;
  }) || [];

  // Sort filtered projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const { sortBy = 'created_at', sortOrder = 'desc' } = filters;
    
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];

    // Handle date fields
    if (sortBy === 'created_at' || sortBy === 'updated_at' || sortBy === 'start_date') {
      aValue = new Date(aValue || 0).getTime();
      bValue = new Date(bValue || 0).getTime();
    }

    // Handle string fields
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{t('failedToLoad')}</p>
        <Button onClick={() => refetch()} variant="outline">
          {t('tryAgain')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>
        {showCreateButton && (
          <CreateProjectModal organisationId={organisationId}>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              {t('createProject')}
            </Button>
          </CreateProjectModal>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchProjects')}
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t('filterByStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allStatus')}</SelectItem>
            <SelectItem value="planning">{t('planning')}</SelectItem>
            <SelectItem value="ongoing">{t('ongoing')}</SelectItem>
            <SelectItem value="completed">{t('completed')}</SelectItem>
            <SelectItem value="on_hold">{t('onHold')}</SelectItem>
            <SelectItem value="cancelled">{t('cancelled')}</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={`${filters.sortBy}-${filters.sortOrder}`} 
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t('sortBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at-desc">{t('newestFirst')}</SelectItem>
            <SelectItem value="created_at-asc">{t('oldestFirst')}</SelectItem>
            <SelectItem value="title-asc">{t('titleAZ')}</SelectItem>
            <SelectItem value="title-desc">{t('titleZA')}</SelectItem>
            <SelectItem value="start_date-desc">{t('startDateLatest')}</SelectItem>
            <SelectItem value="start_date-asc">{t('startDateEarliest')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : sortedProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <div className="mb-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <PlusIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {filters.search || filters.status ? t('noProjectsFound') : t('noProjectsYet')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {filters.search || filters.status 
                ? t('adjustCriteria')
                : t('getStarted')
              }
            </p>
            {showCreateButton && !filters.search && !filters.status && (
              <Link href="/dashboard/projects/create">
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  {t('createFirstProject')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onDelete={({projectId, projectTitle}) => setDeleteModal({ projectId, projectTitle, isOpen: true })} />
          ))}
        </div>
      )}
    <Dialog open={deleteModal.isOpen} onOpenChange={(open) => setDeleteModal({ ...deleteModal, isOpen: open })}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete &quot;{deleteModal.projectTitle}&quot;? This action cannot be undone.
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteModal({ projectId: null, projectTitle: '', isOpen: false })}>Cancel</Button>
          <Button variant="destructive" onClick={() => deleteModal.projectId && handleDeleteProject(deleteModal.projectId)}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
  );
}
