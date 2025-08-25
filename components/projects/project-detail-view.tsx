'use client';

import Link from 'next/link';
import { ArrowLeftIcon, CalendarIcon, MapPinIcon, UsersIcon, DollarSignIcon, ExternalLinkIcon, EditIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ProjectWithOrganisation } from '@/lib/data/projects';
import { formatProjectStatus } from '@/lib/data/projects';

interface ProjectDetailViewProps {
  project: ProjectWithOrganisation;
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount) return 'Not specified';
    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency || '';
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>

      {/* Title and Status */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={project.organisations?.logo_url || ''} alt={project.organisations?.name || ''} />
              <AvatarFallback>
                {project.organisations?.name?.charAt(0) || 'O'}
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground">{project.organisations?.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant="secondary" 
            className={`${
              project.status === 'ongoing' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
              project.status === 'completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100' :
              project.status === 'planning' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
              project.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' :
              project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
              ''
            }`}
          >
            {formatProjectStatus(project.status)}
          </Badge>
          <Link href={`/dashboard/projects/${project.id}/edit`}>
            <Button variant="outline">
              <EditIcon className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {(project.description || project.summary) && (
            <Card>
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {project.summary && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Summary</h4>
                      <p className="text-muted-foreground">{project.summary}</p>
                    </div>
                  )}
                  {project.description && (
                    <div>
                      <h4 className="font-semibold mb-2">Full Description</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Objectives and Outcomes */}
          {(project.objectives?.length || project.outcomes?.length) && (
            <Card>
              <CardHeader>
                <CardTitle>Objectives & Outcomes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.objectives?.length && (
                  <div>
                    <h4 className="font-semibold mb-2">Objectives</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {project.objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {project.outcomes?.length && (
                  <div>
                    <h4 className="font-semibold mb-2">Expected Outcomes</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {project.outcomes.map((outcome, index) => (
                        <li key={index}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* SDG Goals */}
          {project.sdg_goals?.length && (
            <Card>
              <CardHeader>
                <CardTitle>Sustainable Development Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.sdg_goals.map((goal) => (
                    <Badge key={goal} variant="outline">
                      SDG {goal}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Information */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.location && (
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{project.location}</p>
                  </div>
                </div>
              )}

              {project.start_date && (
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Start Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(project.start_date)}</p>
                  </div>
                </div>
              )}

              {project.end_date && (
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">End Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(project.end_date)}</p>
                  </div>
                </div>
              )}

              {project.budget && (
                <div className="flex items-center gap-3">
                  <DollarSignIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Budget</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(project.budget, project.currency)}
                    </p>
                  </div>
                </div>
              )}

              {project.beneficiaries_count && (
                <div className="flex items-center gap-3">
                  <UsersIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Beneficiaries</p>
                    <p className="text-sm text-muted-foreground">
                      {project.beneficiaries_count.toLocaleString()} people
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          {(project.contact_person || project.contact_email || project.contact_phone) && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.contact_person && (
                  <div>
                    <p className="text-sm font-medium">Contact Person</p>
                    <p className="text-sm text-muted-foreground">{project.contact_person}</p>
                  </div>
                )}
                {project.contact_email && (
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{project.contact_email}</p>
                  </div>
                )}
                {project.contact_phone && (
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{project.contact_phone}</p>
                  </div>
                )}
                {project.project_website && (
                  <div>
                    <p className="text-sm font-medium">Website</p>
                    <a 
                      href={project.project_website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      Visit Website
                      <ExternalLinkIcon className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Created</p>
                <p className="text-muted-foreground">{formatDate(project.created_at)}</p>
              </div>
              <div>
                <p className="font-medium">Last Updated</p>
                <p className="text-muted-foreground">{formatDate(project.updated_at)}</p>
              </div>
              {project.featured && (
                <div>
                  <Badge variant="secondary">Featured Project</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
