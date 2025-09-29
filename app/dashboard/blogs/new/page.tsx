
import { TextSlot } from '@/components/ui/text-slot';
import { BlogPostForm } from '@/components/blogs/blog-post-form';
import { getServerUser } from '@/lib/data/server-user';
import { getTranslations } from 'next-intl/server';

export default async function NewBlogPostPage() {
  const t = await getTranslations('dashboard.blogs');
  const {profile} = await getServerUser();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <TextSlot title={t('createNewBlogPost')} subtitle={t('createNewBlogPostDescription')} />
      <BlogPostForm
        organisationId={profile.organisation_id || ''}
        profile={profile}
        mode="create"
      />
    </div>
  );
}
