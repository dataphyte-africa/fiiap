'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Calendar, MapPin, Users, DollarSign, Target, ImageIcon, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import type { Database } from '@/types/db';
import { getProjectsByOrganisationId } from '@/lib/data/projects';

// Types based on database schema
type ProjectStatus = Database['public']['Enums']['project_status_enum'];
type MilestoneStatus = Database['public']['Enums']['milestone_status_enum'];

interface OrganisationProjectsListProps {
  organisationId: string;
}

// Loading skeleton component
function ProjectsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-32" />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-4 w-full ml-7" />
                <Skeleton className="h-4 w-3/4 ml-7 mt-1" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex flex-wrap gap-4 text-sm ml-7 mt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}



export function OrganisationProjectsList({ organisationId }: OrganisationProjectsListProps) {
  const [expandedProjects, setExpandedProjects] = useState<{ [key: string]: boolean }>({});

  const { 
    data: projects = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['organisation-projects', organisationId],
    queryFn: () => getProjectsByOrganisationId(organisationId),
    enabled: !!organisationId,
  });

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount) return 'Not specified';
    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency || '';
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: ProjectStatus | null) => {
    switch (status) {
      case 'ongoing':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100';
      case 'planning':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getMilestoneStatusColor = (status: MilestoneStatus | null) => {
    switch (status) {
      case 'achieved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
        return 'bg-gray-100 text-gray-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneIcon = (status: MilestoneStatus | null) => {
    switch (status) {
      case 'achieved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'planned':
        return <Target className="w-4 h-4 text-gray-600" />;
      case 'delayed':
        return <Clock className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  // Loading state
  if (isLoading) {
    return <ProjectsLoadingSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto max-w-md">
          <div className="mb-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-red-900">Failed to load projects</h3>
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : 'An error occurred while fetching projects'}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <Loader2 className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto max-w-md">
          <div className="mb-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Target className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground">
            This organisation hasn&apos;t published any projects yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Projects ({projects.length})</h2>
      </div>

      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden">
          <Collapsible 
            open={expandedProjects[project.id]} 
            onOpenChange={() => toggleProject(project.id)}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {expandedProjects[project.id] ? (
                        <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500 shrink-0" />
                      )}
                      <CardTitle className="text-lg font-semibold line-clamp-1">
                        {project.title}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 ml-7">
                      {project.summary || project.description || 'No description available'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                                      <Badge variant="secondary" className={getStatusColor(project.status)}>
                    {project.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                  </Badge>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground ml-7 mt-2">
                  {project.start_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Started: {formatDate(project.start_date)}</span>
                    </div>
                  )}
                  {project.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                  )}
                  {project.beneficiaries_count && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{project.beneficiaries_count.toLocaleString()} beneficiaries</span>
                    </div>
                  )}
                  {project.budget && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{formatCurrency(project.budget, project.currency)}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Project Details */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Project Details</h4>
                      <div className="space-y-3 text-sm">
                        {project.description && (
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {project.description}
                          </p>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Start Date:</span>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(project.start_date)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">End Date:</span>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(project.end_date)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SDG Goals */}
                    {project.sdg_goals && project.sdg_goals.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Sustainable Development Goals</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.sdg_goals.map((goal) => (
                            <Badge key={goal} variant="outline" className="text-xs">
                              SDG {goal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Project Media */}
                    {project.project_media && project.project_media.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          Media ({project.project_media.length})
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {project.project_media.slice(0, 4).map((media) => (
                            <div key={media.id} className="relative group">
                              <Image
                                src={media.file_url}
                                alt={media.caption || media.file_name || 'Project media'}
                                width={200}
                                height={96}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              {media.is_featured && (
                                <Badge className="absolute top-1 left-1 text-xs">Featured</Badge>
                              )}
                              {media.caption && (
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end p-2">
                                  <p className="text-white text-xs">{media.caption}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {project.project_media.length > 4 && (
                          <p className="text-sm text-muted-foreground mt-2">
                            +{project.project_media.length - 4} more media files
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Project Events */}
                    {project.project_events && project.project_events.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Recent Events ({project.project_events.length})
                        </h4>
                        <div className="space-y-3">
                          {project.project_events.slice(0, 3).map((event) => (
                            <div key={event.id} className="border-l-2 border-blue-200 pl-3 py-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
                                    {event.title}
                                  </h5>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {formatDate(event.event_date)}
                                  </p>
                                  {event.event_location && (
                                    <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 mt-1">
                                      <MapPin className="w-3 h-3" />
                                      {event.event_location}
                                    </p>
                                  )}
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs shrink-0 ${
                                    event.event_status === 'completed' ? 'bg-green-50 text-green-700' :
                                    event.event_status === 'scheduled' ? 'bg-blue-50 text-blue-700' :
                                    'bg-gray-50 text-gray-700'
                                  }`}
                                >
                                  {event.event_status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                        {project.project_events.length > 3 && (
                          <p className="text-sm text-muted-foreground mt-2">
                            +{project.project_events.length - 3} more events
                          </p>
                        )}
                      </div>
                    )}

                    {/* Project Milestones */}
                    {project.project_milestones && project.project_milestones.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Milestones ({project.project_milestones.length})
                        </h4>
                        <div className="space-y-4">
                          {project.project_milestones.slice(0, 4).map((milestone) => (
                            <div key={milestone.id} className="border rounded-lg p-3">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  {getMilestoneIcon(milestone.status)}
                                  <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
                                    {milestone.title}
                                  </h5>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs shrink-0 ${getMilestoneStatusColor(milestone.status)}`}
                                >
                                  {milestone.status?.replace('_', ' ') || 'unknown'}
                                </Badge>
                              </div>
                              
                              {(milestone.progress_percentage || 0) > 0 && (
                                <div className="mb-2">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                      {milestone.progress_percentage || 0}%
                                    </span>
                                  </div>
                                  <Progress value={milestone.progress_percentage || 0} className="h-2" />
                                </div>
                              )}
                              
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Due: {formatDate(milestone.due_date)}
                                {milestone.completion_date && (
                                  <span className="ml-2">
                                    • Completed: {formatDate(milestone.completion_date)}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {project.project_milestones.length > 4 && (
                          <p className="text-sm text-muted-foreground mt-2">
                            +{project.project_milestones.length - 4} more milestones
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
}
