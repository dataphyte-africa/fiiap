
import { TextSlot } from '@/components/ui/text-slot';
import { BlogPostForm } from '@/components/blogs/blog-post-form';
import { getServerUser } from '@/lib/data/server-user';

export default async function NewBlogPostPage() {
 const {profile} = await getServerUser();
  
  
 

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <TextSlot title="Create New Blog Post" subtitle="Create a new blog post for your organisation" />
      <BlogPostForm
        organisationId={profile.organisation_id || ''}
        profile={profile}
        mode="create"
      />
    </div>
  );
}
