'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, Save, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogPostForm, type BlogPostFormData } from './blog-post-form';
import { BlogPostEditor } from './blog-post-editor';
import { EnhancedBlogViewer } from './enhanced-blog-viewer';
import { 
 
  updateBlogPost, 
  type BlogPostWithAuthor, 
 
  type UpdateBlogPostData 
} from '@/lib/data/blogs';
import { Block, PartialBlock } from '@blocknote/core';

interface BlogPostEditPageProps {
  blogPost?: BlogPostWithAuthor;
  organisationId: string;
  userId: string;
  mode: 'create' | 'edit';
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isEmptyObject(obj: any) {
  return Object.keys(obj).length === 0;
}

export function BlogPostEditPage({ 
  blogPost, 
  organisationId, 
  mode 
}: BlogPostEditPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('settings');
  const [blogContent, setBlogContent] = useState<(Block | PartialBlock)[] | undefined>( blogPost?.content && !isEmptyObject(blogPost?.content) ? (JSON.parse(blogPost?.content as string) as Block[]) : undefined);
  const [blogContentHtml, setBlogContentHtml] = useState<string>(blogPost?.content_html || '');
 
  const [formData, setFormData] = useState<BlogPostFormData | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  

  // Update blog post mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateBlogPostData) => {
      return updateBlogPost(data);
    },
    onSuccess: () => {
      toast.success('Blog post updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setHasUnsavedChanges(false);
    },
    onError: (error) => {
      console.error('Error updating blog post:', error);
      toast.error('Failed to update blog post. Please try again.');
    },
  });

  // Handle form submission
  const handleFormSubmit = async (data: BlogPostFormData) => {
    setFormData(data);
    
    const updateData: UpdateBlogPostData = {
      ...data,
      id: blogPost?.id || '',
      content: JSON.stringify(blogContent),
      content_html: blogContentHtml,
    };
    
    updateMutation.mutate(updateData);
  };

  // Handle content changes
  const handleContentChange = (content: PartialBlock[], html: string) => {
    setBlogContent(content);
    setBlogContentHtml(html);
    setHasUnsavedChanges(true);
  };

  // Handle quick save (content only)
  const handleQuickSave = async () => {
    if (mode === 'edit' && blogPost) {
      const updateData: UpdateBlogPostData = {
        id: blogPost.id,
        content: JSON.stringify(blogContent),
        content_html: blogContentHtml,
      };
      
      updateMutation.mutate(updateData);
    }
  };

  // Warn about unsaved changes
//   useEffect(() => {
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       if (hasUnsavedChanges) {
//         e.preventDefault();
//         e.returnValue = '';
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
//     return () => window.removeEventListener('beforeunload', handleBeforeUnload);
//   }, [hasUnsavedChanges]);

  const isLoading = updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/blogs')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
            </h1>
            {blogPost && (
              <p className="text-gray-600">
                Last updated:
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-sm text-amber-600 mr-2">Unsaved changes</span>
          )}
          {mode === 'edit' && (
            <Button
              variant="outline"
              onClick={handleQuickSave}
              disabled={isLoading || !hasUnsavedChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              Quick Save
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Content Editor
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Blog Post Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <BlogPostForm
                organisationId={organisationId}
                initialData={blogPost}
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
                mode={mode}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Editor Tab */}
        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <CardTitle>Content Editor</CardTitle>
              <p className="text-sm text-gray-600">
                Write your blog post content using the rich text editor below.
              </p>
            </CardHeader>
            <CardContent>
              <BlogPostEditor
                initialContent={blogContent}
                onChange={handleContentChange}
               
                className="min-h-[600px]"
              />
              
              {hasUnsavedChanges && mode === 'edit' && (
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleQuickSave}
                    disabled={isLoading}
                    variant="outline"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Content
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <p className="text-sm text-gray-600">
                This is how your blog post will appear to readers.
              </p>
            </CardHeader>
            <CardContent>
              {/* Blog Post Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">
                  {formData?.title || blogPost?.title || 'Untitled Blog Post'}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>
                    By {blogPost?.profiles?.name || 'Author'}
                  </span>
                  <span>•</span>
                  <span>
                    {blogPost?.created_at 
                      ? new Date(blogPost.created_at).toLocaleDateString()
                      : 'Today'
                    }
                  </span>
                  {blogPost?.reading_time_minutes && (
                    <>
                      <span>•</span>
                      <span>{blogPost.reading_time_minutes} min read</span>
                    </>
                  )}
                </div>

                {(formData?.excerpt || blogPost?.excerpt) && (
                  <p className="text-lg text-gray-700 mb-6">
                    {formData?.excerpt || blogPost?.excerpt}
                  </p>
                )}

                {(formData?.featured_image_url || blogPost?.featured_image_url) && (
                  <div className="mb-6">
                    <img
                      src={formData?.featured_image_url || blogPost?.featured_image_url || ''}
                      alt={formData?.featured_image_alt || blogPost?.featured_image_alt || 'Featured image'}
                      className="w-full h-64 object-cover rounded-lg"
                      width={400}
                      height={192}
                    />
                  </div>
                )}
              </div>

              {/* Blog Content */}
              <div className="prose prose-lg max-w-none">
                <EnhancedBlogViewer
                  content={blogContent}
                  contentHtml={blogContentHtml}
                  className="min-h-[200px]"
                />
              </div>

              {/* Tags */}
              {((formData?.tags && formData.tags.length > 0) || (blogPost?.tags && blogPost.tags.length > 0)) && (
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {(formData?.tags || blogPost?.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
