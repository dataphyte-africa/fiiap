'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Calendar, MapPin, Users, DollarSign, Target, ImageIcon, Clock, CheckCircle, AlertCircle, Loader2, ExternalLink, Phone, Mail, User, FileText, Globe, Eye, EyeOff, Star, Building2, Link } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import type { Database } from '@/types/db';
import { getProjectsByOrganisationId } from '@/lib/data/projects';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('organisationProjectsList');
  const [expandedProjects, setExpandedProjects] = useState<{ [key: string]: boolean }>({});

  // Get current locale from the browser or use 'en' as fallback
  const getCurrentLocale = () => {
    if (typeof window !== 'undefined') {
      const cookieLocale = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];
      return cookieLocale || navigator.language.split('-')[0] || 'en';
    }
    return 'en';
  };

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
    if (!amount) return t('project.notSpecified');
    const locale = getCurrentLocale();
    const localeMap: Record<string, string> = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR'
    };
    const fullLocale = localeMap[locale] || 'en-US';
    
    // Use Intl.NumberFormat for proper currency formatting
    if (currency) {
      try {
        return new Intl.NumberFormat(fullLocale, {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(amount);
      } catch {
        // Fallback to simple format if currency is not supported
        const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency || '';
        return `${currencySymbol}${amount.toLocaleString(fullLocale)}`;
      }
    }
    
    return amount.toLocaleString(fullLocale);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t('project.notSet');
    const locale = getCurrentLocale();
    // Map locale codes to full locale strings for better date formatting
    const localeMap: Record<string, string> = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR'
    };
    const fullLocale = localeMap[locale] || 'en-US';
    
    return new Date(dateString).toLocaleDateString(fullLocale, {
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
          <h3 className="text-lg font-semibold mb-2 text-red-900">{t('error.failedToLoad')}</h3>
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : t('error.errorMessage')}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <Loader2 className="h-4 w-4 mr-2" />
            {t('error.tryAgain')}
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
          <h3 className="text-lg font-semibold mb-2">{t('empty.noProjectsYet')}</h3>
          <p className="text-muted-foreground">
            {t('empty.noProjectsMessage')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{t('header.projectsCount', { count: projects.length })}</h2>
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
                      {project.summary || project.description || t('project.noDescriptionAvailable')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                                      <Badge variant="secondary" className={getStatusColor(project.status)}>
                    {project.status ? t(`status.${project.status}`) : t('status.unknown')}
                  </Badge>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground ml-7 mt-2">
                  {project.start_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{t('project.started', { date: formatDate(project.start_date) })}</span>
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
                      <span>{t('project.beneficiaries', { count: project.beneficiaries_count.toLocaleString() })}</span>
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
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('details.projectDetails')}</h4>
                      <div className="space-y-3 text-sm">
                        {project.description && (
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {project.description}
                          </p>
                        )}
                        
                        {/* Project Status Indicators */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.featured && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              <Star className="w-3 h-3 mr-1" />
                              {t('details.featured')}
                            </Badge>
                          )}
                          {project.public_visibility !== null && (
                            <Badge variant="outline" className={project.public_visibility ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"}>
                              {project.public_visibility ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                              {project.public_visibility ? t('details.public') : t('details.private')}
                            </Badge>
                          )}
                          {project.language && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              <Globe className="w-3 h-3 mr-1" />
                              {project.language}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">{t('details.startDate')}</span>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(project.start_date)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">{t('details.endDate')}</span>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(project.end_date)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Objectives */}
                    {project.objectives && project.objectives.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          {t('details.objectives')}
                        </h4>
                        <ul className="space-y-2">
                          {project.objectives.map((objective, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Project Outcomes */}
                    {project.outcomes && project.outcomes.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          {t('details.expectedOutcomes')}
                        </h4>
                        <ul className="space-y-2">
                          {project.outcomes.map((outcome, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Contact Information */}
                    {(project.contact_person || project.contact_email || project.contact_phone) && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {t('details.contactInformation')}
                        </h4>
                        <div className="space-y-2 text-sm">
                          {project.contact_person && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-300">{project.contact_person}</span>
                            </div>
                          )}
                          {project.contact_email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <a 
                                href={`mailto:${project.contact_email}`}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                {project.contact_email}
                              </a>
                            </div>
                          )}
                          {project.contact_phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <a 
                                href={`tel:${project.contact_phone}`}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                {project.contact_phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* External Links */}
                    {(project.project_website || (project.documents_urls && project.documents_urls.length > 0)) && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Link className="w-4 h-4" />
                          {t('details.externalResources')}
                        </h4>
                        <div className="space-y-2">
                          {project.project_website && (
                            <a
                              href={project.project_website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <Globe className="w-4 h-4" />
                              {t('details.projectWebsite')}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {project.documents_urls && project.documents_urls.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4" />
                                {t('details.documents', { count: project.documents_urls.length })}
                              </span>
                              <div className="space-y-1 ml-6">
                                {project.documents_urls.slice(0, 3).map((docUrl, index) => (
                                  <a
                                    key={index}
                                    href={docUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                  >
                                    {t('details.documentNumber', { number: index + 1 })}
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                ))}
                                {project.documents_urls.length > 3 && (
                                  <p className="text-xs text-gray-500">
                                    {t('details.moreDocuments', { count: project.documents_urls.length - 3 })}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Secondary Sectors */}
                    {project.secondary_sectors && project.secondary_sectors.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          {t('details.secondarySectors')}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.secondary_sectors.map((sector, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                              {sector}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SDG Goals */}
                    {project.sdg_goals && project.sdg_goals.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('details.sustainableDevelopmentGoals')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.sdg_goals.map((goal) => (
                            <Badge key={goal} variant="outline" className="text-xs">
                              SDG {goal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Featured Image */}
                    {project.featured_image_url && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          {t('details.featuredImage')}
                        </h4>
                        <div className="relative group">
                          <Image
                            src={project.featured_image_url}
                            alt="Featured project image"
                            width={400}
                            height={200}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    )}

                    {/* Gallery Images */}
                    {project.gallery_images && project.gallery_images.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          {t('details.gallery', { count: project.gallery_images.length })}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {project.gallery_images.slice(0, 4).map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <Image
                                src={imageUrl}
                                alt={`Gallery image ${index + 1}`}
                                width={200}
                                height={96}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                        {project.gallery_images.length > 4 && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {t('details.moreGalleryImages', { count: project.gallery_images.length - 4 })}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Project Media */}
                    {project.project_media && project.project_media.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          {t('details.mediaFiles', { count: project.project_media.length })}
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
                                <Badge className="absolute top-1 left-1 text-xs">{t('details.featured')}</Badge>
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
                            {t('details.moreMediaFiles', { count: project.project_media.length - 4 })}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Impact Metrics */}
                    {project.impact_metrics && Object.keys(project.impact_metrics).length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          {t('details.impactMetrics')}
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(project.impact_metrics as Record<string, unknown>).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {key.replace(/_/g, ' ')}
                              </div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {typeof value === 'number' ? value.toLocaleString() : String(value)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Beneficiaries Demographics */}
                    {project.beneficiaries_demographics && Object.keys(project.beneficiaries_demographics).length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {t('details.beneficiariesDemographics')}
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(project.beneficiaries_demographics as Record<string, unknown>).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 dark:text-gray-400 capitalize">
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className="text-gray-900 dark:text-gray-100 font-medium">
                                {typeof value === 'number' ? value.toLocaleString() : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}


                    {/* Project Events */}
                    {project.project_events && project.project_events.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {t('details.recentEvents', { count: project.project_events.length })}
                        </h4>
                        <div className="space-y-3">
                          {project.project_events.slice(0, 3).map((event) => (
                            <div key={event.id} className="border-l-2 border-blue-200 pl-3 py-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
                                      {event.title}
                                    </h5>
                                    {event.is_virtual && (
                                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                        {t('details.virtual')}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {formatDate(event.event_date)}
                                    {event.event_end_date && event.event_end_date !== event.event_date && (
                                      <span> - {formatDate(event.event_end_date)}</span>
                                    )}
                                  </p>
                                  {event.event_location && (
                                    <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 mt-1">
                                      <MapPin className="w-3 h-3" />
                                      {event.event_location}
                                    </p>
                                  )}
                                  {event.event_type && (
                                    <p className="text-xs text-gray-500 dark:text-gray-500 capitalize mt-1">
                                      {t('details.eventType', { type: event.event_type.replace(/_/g, ' ') })}
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
                                  {event.event_status ? t(`eventStatus.${event.event_status}`) : event.event_status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                        {project.project_events.length > 3 && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {t('details.moreEvents', { count: project.project_events.length - 3 })}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Project Milestones */}
                    {project.project_milestones && project.project_milestones.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          {t('details.milestones', { count: project.project_milestones.length })}
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
                                  {milestone.status ? t(`milestoneStatus.${milestone.status}`) : t('milestoneStatus.unknown')}
                                </Badge>
                              </div>
                              
                              {milestone.description && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                  {milestone.description}
                                </p>
                              )}

                              {milestone.deliverables && milestone.deliverables.length > 0 && (
                                <div className="mb-2">
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    {t('details.deliverables')}
                                  </span>
                                  <ul className="mt-1 space-y-1">
                                    {milestone.deliverables.slice(0, 2).map((deliverable, index) => (
                                      <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                                        <div className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                                        {deliverable}
                                      </li>
                                    ))}
                                    {milestone.deliverables.length > 2 && (
                                      <li className="text-xs text-gray-500">
                                        {t('details.moreDeliverables', { count: milestone.deliverables.length - 2 })}
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              )}
                              
                              {(milestone.progress_percentage || 0) > 0 && (
                                <div className="mb-2">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">{t('details.progress')}</span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                      {milestone.progress_percentage || 0}%
                                    </span>
                                  </div>
                                  <Progress value={milestone.progress_percentage || 0} className="h-2" />
                                </div>
                              )}

                              
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {t('details.due', { date: formatDate(milestone.due_date) })}
                                {milestone.completion_date && (
                                  <span className="ml-2">
                                    • {t('details.completed', { date: formatDate(milestone.completion_date) })}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {project.project_milestones.length > 4 && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {t('details.moreMilestones', { count: project.project_milestones.length - 4 })}
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
