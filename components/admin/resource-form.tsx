'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { X, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { resourceLibraryFormSchema, type ResourceLibraryFormData } from '@/lib/schemas/admin-content-schemas';
import { createResource, updateResource } from '@/lib/data/admin-content';
import { storage } from '@/lib/supabase/storage-client';
import { STORAGE_BUCKETS } from '@/lib/supabase/storage-config';

interface ResourceFormProps {
  initialData?: ResourceLibraryFormData & { id?: string };
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
  onCancel?: () => void;
}

const RESOURCE_TYPES = [
  { value: 'toolkit', label: 'Toolkit' },
  { value: 'research_paper', label: 'Research Paper' },
  { value: 'guide', label: 'Guide' },
  { value: 'template', label: 'Template' },
  { value: 'video', label: 'Video' },
  { value: 'document', label: 'Document' },
  { value: 'report', label: 'Report' },
  { value: 'other', label: 'Other' },
];

export function ResourceForm({ initialData, mode = 'create', onSuccess, onCancel }: ResourceFormProps) {
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const form = useForm({
    resolver: zodResolver(resourceLibraryFormSchema),
    defaultValues: {
      title: '',
      description: '',
      resource_type: 'document',
      file_url: '',
      image_url: '',
      author_name: '',
      tags: '',
      is_visible: true,
      is_featured: false,
      ...initialData,
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;

  // Watch for image_url changes to update preview
  const watchedImageUrl = watch('image_url');

  useEffect(() => {
    if (watchedImageUrl && !imageFile) {
      setImagePreview(watchedImageUrl);
    }
  }, [watchedImageUrl, imageFile]);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image file size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setValue('image_url', ''); // Clear URL when file is selected
    }
  };

  // Handle resource file selection
  const handleResourceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit for resources
        toast.error('Resource file size must be less than 50MB');
        return;
      }
      setResourceFile(file);
      setValue('file_url', ''); // Clear URL when file is selected
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setValue('image_url', '');
  };

  const removeResourceFile = () => {
    setResourceFile(null);
    setValue('file_url', '');
  };

  // Upload file to Supabase Storage
  const uploadFile = async (file: File, bucket: string, folder: string): Promise<string> => {
     const result = await storage.uploadFile(file, STORAGE_BUCKETS.PROJECT_MEDIA, {
      customPath: `${folder}/${file.name}`,
     });
     if (!result.success) {
      throw new Error(result.error || 'Upload failed');
     }
     return result.data!.publicUrl || result.data!.path;
  };

  const mutation = useMutation({
    mutationFn: async (data: ResourceLibraryFormData) => {
      let imageUrl = data.image_url;
      let fileUrl = data.file_url;

      // Upload image if file is selected
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'public-assets', 'resources/images');
      }

      // Upload resource file if file is selected
      if (resourceFile) {
        fileUrl = await uploadFile(resourceFile, 'public-assets', 'resources/files');
      }

      const resourceData = {
        ...data,
        image_url: imageUrl,
        file_url: fileUrl,
      };

      if (mode === 'edit' && initialData?.id) {
        return updateResource(initialData.id, resourceData);
      } else {
        return createResource(resourceData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success(`Resource ${mode === 'edit' ? 'updated' : 'created'} successfully!`);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || `Failed to ${mode} resource`);
    },
  });

  const onSubmit = (data: ResourceLibraryFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'edit' ? 'Edit Resource' : 'Create New Resource'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter resource title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter resource description"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Resource Type */}
          <div>
            <Label htmlFor="resource_type">Resource Type *</Label>
            <Select
              onValueChange={(value) => setValue('resource_type', value as ResourceLibraryFormData['resource_type'])}
              defaultValue={watch('resource_type')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resource type" />
              </SelectTrigger>
              <SelectContent>
                {RESOURCE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.resource_type && (
              <p className="text-sm text-red-600 mt-1">{errors.resource_type.message}</p>
            )}
          </div>

          {/* Author Name */}
          <div>
            <Label htmlFor="author_name">Author Name</Label>
            <Input
              id="author_name"
              {...register('author_name')}
              placeholder="Enter author name"
              className={errors.author_name ? 'border-red-500' : ''}
            />
            {errors.author_name && (
              <p className="text-sm text-red-600 mt-1">{errors.author_name.message}</p>
            )}
          </div>

          {/* Resource File Upload */}
          <div className='mt-3 bg-muted rounded-lg p-3'>
            <Label>Resource File</Label>
            <div className="space-y-4">
              {resourceFile && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="flex-1 text-sm text-ellipsis overflow-hidden">{resourceFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeResourceFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <div className="flex-1">
                  <Label htmlFor="resource_file">Upload File</Label>
                  <Input
                    id="resource_file"
                    type="file"
                    onChange={handleResourceFileChange}
                    className="mt-1"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.mp4,.mp3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported: PDF, DOC, XLS, PPT, TXT, ZIP, MP4, MP3 (max 50MB)
                  </p>
                </div>
                <div className="flex-1">
                  <Label htmlFor="file_url">Or File URL</Label>
                  <Input
                    id="file_url"
                    {...register('file_url')}
                    placeholder="https://example.com/file.pdf"
                    className={`mt-1 ${errors.file_url ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>
              {errors.file_url && (
                <p className="text-sm text-red-600 mt-1">{errors.file_url.message}</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className='mt-3 bg-muted rounded-lg p-3'>
            <Label>Cover Image</Label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Resource preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <div className="flex-1">
                  <Label htmlFor="image_file">Upload Image</Label>
                  <Input
                    id="image_file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="image_url">Or Image URL</Label>
                  <Input
                    id="image_url"
                    {...register('image_url')}
                    placeholder="https://example.com/image.jpg"
                    className={`mt-1 ${errors.image_url ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>
              {errors.image_url && (
                <p className="text-sm text-red-600 mt-1">{errors.image_url.message}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              {...register('tags')}
              placeholder="toolkit, guide, best-practices"
              className={errors.tags ? 'border-red-500' : ''}
            />
            {errors.tags && (
              <p className="text-sm text-red-600 mt-1">{errors.tags.message}</p>
            )}
          </div>

          {/* Visibility Options */}
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_visible"
                checked={watch('is_visible')}
                onCheckedChange={(checked) => setValue('is_visible', !!checked)}
              />
              <Label htmlFor="is_visible">Visible to Public</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={watch('is_featured')}
                onCheckedChange={(checked) => setValue('is_featured', !!checked)}
              />
              <Label htmlFor="is_featured">Featured Resource</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : mode === 'edit' ? 'Update Resource' : 'Create Resource'}
        </Button>
      </div>
    </form>
  );
}
