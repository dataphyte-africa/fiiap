'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, MapPinIcon, UsersIcon, DollarSignIcon } from 'lucide-react';
import type { ProjectWithOrganisation } from '@/lib/data/projects';
import { formatProjectStatus } from '@/lib/data/projects';
import { useTranslations } from 'next-intl';

interface ProjectCardProps {
  project: ProjectWithOrganisation;
  onDelete: ({projectId, projectTitle}: {projectId: string, projectTitle: string}) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const t = useTranslations('projects.card')
  
  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount) return t('notSpecified');
    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency || '';
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t('notSet');
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">
              {project.title}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={project.organisations?.logo_url || ''} alt={project.organisations?.name || ''} />
                <AvatarFallback className="text-xs">
                  {project.organisations?.name?.charAt(0) || 'O'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate">
                {project.organisations?.name}
              </span>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className={`shrink-0 ${
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
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {project.summary || project.description || t('noDescription')}
        </p>

        <div className="space-y-2">
          {project.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPinIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
          )}

          {project.start_date && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4 shrink-0" />
              <span>{t('started')} {formatDate(project.start_date)}</span>
            </div>
          )}

          {project.beneficiaries_count && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UsersIcon className="h-4 w-4 shrink-0" />
              <span>{project.beneficiaries_count.toLocaleString()} {t('beneficiaries')}</span>
            </div>
          )}

          {project.budget && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSignIcon className="h-4 w-4 shrink-0" />
              <span>{t('budget')} {formatCurrency(project.budget, project.currency)}</span>
            </div>
          )}
        </div>

        {project.sdg_goals && project.sdg_goals.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {project.sdg_goals.slice(0, 3).map((goal) => (
                <Badge key={goal} variant="outline" className="text-xs">
                  SDG {goal}
                </Badge>
              ))}
              {project.sdg_goals.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  {t('sdgMore', { count: project.sdg_goals.length - 3 })}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 gap-2">
        <Link href={`/dashboard/projects/${project.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            {t('viewDetails')}
          </Button>
        </Link>
        <Button variant="destructive" className="w-full" onClick={() => onDelete({projectId: project.id, projectTitle: project.title})}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
