import { Metadata } from 'next';
import { ProjectFormPage } from '@/components/projects/project-form-page';

export const metadata: Metadata = {
  title: 'Create Project | CSO Platform',
  description: 'Create a new project with detailed information, media, events, and milestones.',
};

export default function CreateProjectPage() {
  return (
    <ProjectFormPage 
      mode="create" 
      isEditing={false}
    />
  );
}
