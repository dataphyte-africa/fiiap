import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BlogPostEditPage } from '@/components/blogs/blog-post-edit-page';
import { getServerUser } from '@/lib/data/server-user';

interface EditBlogPostPageProps {
  params:Promise< {
    id: string;
  }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const supabase = await createClient();
  const user = await getServerUser();
  
  // Get current user
 

  // Check if user has permission to edit this blog post
  if (!user.profile.organisation_id || !user.sub) {
    notFound();
  }
  const { id } = await params;
  const {data: blogPost} = await supabase.from('blog_posts').select('*, profiles!blog_posts_author_id_fkey(id, name, avatar_url), organisations!blog_posts_organisation_id_fkey(id, name, logo_url)').eq('id', id).single();
  if (!blogPost) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <BlogPostEditPage
        blogPost={blogPost}
        organisationId={user.profile.organisation_id}
        userId={user.sub}
        mode="edit"
      />
    </div>
  );
}
