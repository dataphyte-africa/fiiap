
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProjectDetailView } from '@/components/projects/project-detail-view';
import { Skeleton } from '@/components/ui/skeleton';
import { ServerDataFetcher } from '@/components/utils/server-data-fetcher';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProject(id: string) {
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      organisations!projects_organisation_id_fkey (
        id,
        name,
        logo_url
      )
    `)
    .eq('id', id)
    .single();

  if (error || !project) {
    return null;
  }

  return project;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const {id} = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <ServerDataFetcher fetchFn={() => getProject(id)} render={(project) =>{
        if(!project) notFound();
        return <ProjectDetailView project={project} />
      }} fallback={<ProjectDetailSkeleton />} />
    </div>
  );
}

function ProjectDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}