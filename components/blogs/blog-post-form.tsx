'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Upload, Hash } from 'lucide-react';
import { generateSlug, isSlugUnique, getBlogPostTags, createBlogPost } from '@/lib/data/blogs';
import type { BlogPost, CreateBlogPostData } from '@/lib/data/blogs';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Database } from '@/types/db';
import { storage } from '@/lib/supabase/storage-client';
import { STORAGE_BUCKETS } from '@/lib/supabase/storage-config';

const blogPostFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),
  featured_image_url: z.string().url().optional().or(z.literal('')),
  featured_image_alt: z.string().max(200, 'Alt text must be less than 200 characters').optional(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
  status: z.enum(['draft', 'published', 'archived',  'flagged']),
  language: z.enum(['English', 'French']),
  meta_title: z.string().max(60, 'Meta title must be less than 60 characters').optional(),
  meta_description: z.string().max(160, 'Meta description must be less than 160 characters').optional(),
  scheduled_for: z.string().optional(),
});

export type BlogPostFormData = z.infer<typeof blogPostFormSchema>;

interface BlogPostFormProps {
  organisationId: string;
  initialData?: Partial<BlogPost>;
  onSubmit?: (data: BlogPostFormData) => Promise<void>;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
  profile?: Database['public']['Tables']['profiles']['Row'];
}

export function BlogPostForm({ 
  organisationId, 
  initialData, 
  onSubmit, 
  isLoading = false, 
  mode = 'create',
  profile
}: BlogPostFormProps) {
  const [newTag, setNewTag] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
 
// Create blog post mutation
const createMutation = useMutation({
   mutationFn: async (data: CreateBlogPostData) => {
     return createBlogPost(data);
   },
   onSuccess: (data) => {
     toast.success('Blog post created successfully!');
     queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
     router.push(`/dashboard/blogs/${data.id}/edit`);
   },
   onError: (error) => {
     console.error('Error creating blog post:', error);
     toast.error('Failed to create blog post. Please try again.');
   },
 });  

 //Upload Mutation
 const uploadFile = async (file: File) => {
   return storage.uploadFile(file, STORAGE_BUCKETS.ORGANISATION_MEDIA, {
     organisationId: organisationId,
     userId: profile?.id,
   });
 };

 // Update blog post mutation
  const form = useForm({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      featured_image_url: initialData?.featured_image_url || '',
      featured_image_alt: initialData?.featured_image_alt || '',
      tags: initialData?.tags || [],
      status: initialData?.status || 'draft',
      language: initialData?.language || 'English',
      meta_title: initialData?.meta_title || '',
      meta_description: initialData?.meta_description || '',
      
    },
  });

  const { watch, setValue,  formState: { errors } } = form;

  const featured_image_url = watch('featured_image_url')
  const watchedTitle = watch('title');
  const watchedTags = watch('tags') || [];
  const loading = isLoading || createMutation.isPending;
  // Load available tags on mount
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await getBlogPostTags(organisationId);
        setAvailableTags(tags);
      } catch (error) {
        console.error('Error loading tags:', error);
      }
    };
    loadTags();
  }, [organisationId]);

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle && mode === 'create') {
      const slug = generateSlug(watchedTitle);
      setValue('slug', slug);
    }
  }, [watchedTitle, setValue, mode]);

  // Check slug uniqueness
  const checkSlugUniqueness = async (slug: string) => {
    if (!slug || isCheckingSlug) return;
    
    setIsCheckingSlug(true);
    try {
      const isUnique = await isSlugUnique(slug, organisationId, initialData?.id);
      if (!isUnique) {
        form.setError('slug', { message: 'This slug is already taken' });
      } else {
        form.clearErrors('slug');
      }
    } catch (error) {
      console.error('Error checking slug:', error);
    } finally {
      setIsCheckingSlug(false);
    }
  };

  // Auto-generate meta title and description from title and excerpt
  useEffect(() => {
    const title = watch('title');
    const excerpt = watch('excerpt');
    
    if (title && !watch('meta_title')) {
      setValue('meta_title', title.slice(0, 60));
    }
    
    if (excerpt && !watch('meta_description')) {
      setValue('meta_description', excerpt.slice(0, 160));
    }
  }, [watch, setValue]);

  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !watchedTags.includes(trimmedTag) && watchedTags.length < 10) {
      setValue('tags', [...watchedTags, trimmedTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', watchedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  const handleSubmit = async (data: BlogPostFormData) => {
    if (onSubmit) {
      onSubmit(data);
    } else{
       if(mode === 'create'){
         setSaving(true);
         try{
         if(featuredFile){
          const result = await uploadFile(featuredFile);
          if(result.success && result.data){
            setValue('featured_image_url', result.data.publicUrl || result.data.path);
            data.featured_image_url = result.data.publicUrl || result.data.path;
            setFeaturedFile(null);
          }else{
            toast.error('Error uploading file: ' + result.error);
          }

         }
        }catch(error){
            console.error('Error uploading file:', error);
            toast.error('Error uploading file: ' + error);
        }finally{
          setSaving(false);
        }
        createMutation.mutate({
          ...data,
          content: {},
          excerpt: data.excerpt || null,
         created_at: new Date().toISOString(),
         published_at: new Date().toISOString(),
          organisation_id: organisationId,
          author_id: profile?.id || '',
          featured_image_url: data.featured_image_url || null,
          featured_image_alt: data.featured_image_alt || null,
          tags: data.tags || [],
          status: data.status || 'draft',
          language: data.language || 'English',
          meta_title: data.meta_title || null,
          meta_description: data.meta_description || null,
         
        });
       }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...form.register('title')}
                  placeholder="Enter blog post title"
                  className="mt-1"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <div className="relative">
                  <Input
                    id="slug"
                    {...form.register('slug')}
                    placeholder="url-friendly-slug"
                    className="mt-1"
                    onBlur={(e) => checkSlugUniqueness(e.target.value)}
                  />
                  {isCheckingSlug && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                    </div>
                  )}
                </div>
                {errors.slug && (
                  <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  This will be used in the URL: /blogs/{watch('slug') || 'your-slug'}
                </p>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  {...form.register('excerpt')}
                  placeholder="Brief description of your blog post"
                  rows={3}
                  className="mt-1"
                />
                {errors.excerpt && (
                  <p className="text-sm text-red-600 mt-1">{errors.excerpt.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {watch('excerpt')?.length || 0}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Featured Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {
                  (featuredFile || featured_image_url)   && (
                     <img 
                      src={featuredFile ? URL.createObjectURL(featuredFile) : featured_image_url || ''}
                      alt="Featured file"
                      className="w-full h-48 object-cover"
                     />
                  ) 
               }
              <div>
                <Label htmlFor="featured_file ">Featured File</Label>
                <Input
                  id="featured_file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFeaturedFile(e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="featured_image_url">Image URL</Label>
                <Input
                  id="featured_image_url"
                  {...form.register('featured_image_url')}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
                {errors.featured_image_url && (
                  <p className="text-sm text-red-600 mt-1">{errors.featured_image_url.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="featured_image_alt">Alt Text</Label>
                <Input
                  id="featured_image_alt"
                  {...form.register('featured_image_alt')}
                  placeholder="Describe the image for accessibility"
                  className="mt-1"
                />
                {errors.featured_image_alt && (
                  <p className="text-sm text-red-600 mt-1">{errors.featured_image_alt.message}</p>
                )}
              </div>

              {watch('featured_image_url') && (
                <div className="mt-4">
                  <Label>Preview</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img
                      src={watch('featured_image_url')}
                      alt={watch('featured_image_alt') || 'Featured image preview'}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  {...form.register('meta_title')}
                  placeholder="SEO optimized title"
                  className="mt-1"
                />
                {errors.meta_title && (
                  <p className="text-sm text-red-600 mt-1">{errors.meta_title.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {watch('meta_title')?.length || 0}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  {...form.register('meta_description')}
                  placeholder="Brief description for search engines"
                  rows={2}
                  className="mt-1"
                />
                {errors.meta_description && (
                  <p className="text-sm text-red-600 mt-1">{errors.meta_description.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {watch('meta_description')?.length || 0}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value) => setValue('status', value as 'draft' | 'published')}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  value={watch('language')}
                  onValueChange={(value) => setValue('language', value as 'English' | 'French')}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              

            
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={addTag}
                  disabled={!newTag.trim() || watchedTags.includes(newTag.trim()) || watchedTags.length >= 10}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {availableTags.length > 0 && (
                <div>
                  <Label className="text-sm text-gray-600">Suggested tags:</Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {availableTags
                      .filter(tag => !watchedTags.includes(tag))
                      .slice(0, 10)
                      .map((tag) => (
                        <Button
                          key={tag}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (watchedTags.length < 10) {
                              setValue('tags', [...watchedTags, tag]);
                            }
                          }}
                          className="text-xs h-6"
                        >
                          {tag}
                        </Button>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {watchedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {watchedTags.length >= 10 && (
                <p className="text-sm text-amber-600">
                  Maximum of 10 tags reached
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        {mode === 'edit' && <Button
          type="button"
          variant="outline"
          onClick={() => setValue('status', 'draft')}
          disabled={loading || saving}
        >
          Save as Draft
        </Button>}
        <Button
          type="submit"
          disabled={loading || saving}
          onClick={() => setValue('status', 'published')}
        >
          {loading || saving ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
             {loading && (mode === 'create' ? 'Creating...' : 'Updating...')}
             {saving && ("Uploading...")}
            </div>
          ) : (   
            mode === 'create' ? 'Create Post' : 'Update Post'
          )}
        </Button>
      </div>
    </form>
  );
}
