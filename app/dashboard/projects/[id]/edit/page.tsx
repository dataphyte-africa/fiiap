import { Metadata } from 'next';
import { ProjectFormPage } from '@/components/projects/project-form-page';
import { ServerDataFetcher } from '@/components/utils';
import { getServerUser } from '@/lib/data/server-user';
import { redirect } from 'next/navigation';

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export  function generateMetadata(): Metadata {
  return {
    title: 'Edit Project | CSO Platform',
    description: 'Edit project information, media, events, and milestones.',
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  

  return (
    <ServerDataFetcher fetchFn={ async () => {
      const {id:projectId} = await params;

      const user = await getServerUser();
      if(!user.profile.organisation_id) {
        redirect('/dashboard');
      }

      return {...user, projectId}
      
    }} render={(data) =>{
      
      return <ProjectFormPage 
      projectId={data.projectId}
      mode="edit" 
      isEditing={true}
      userId={data.sub}
      organisationId={data.profile.organisation_id!}
      
    />
    }} fallback={<> Loading...</>} />
    
  );
}
