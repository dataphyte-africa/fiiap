'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { X, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { onlineCourseFormSchema, type OnlineCourseFormData } from '@/lib/schemas/admin-content-schemas';
import { createCourse, updateCourse } from '@/lib/data/admin-content';
import { storage } from '@/lib/supabase/storage-client';
import { STORAGE_BUCKETS } from '@/lib/supabase/storage-config';

interface CourseFormProps {
  initialData?: OnlineCourseFormData & { id?: string };
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
  onCancel?: () => void;
}

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export function CourseForm({ initialData, mode = 'create', onSuccess, onCancel }: CourseFormProps) {
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const form = useForm({
    resolver: zodResolver(onlineCourseFormSchema),
    defaultValues: {
      title: '',
      description: '',
      instructor_name: '',
      course_url: '',
      platform_name: 'FIAP Learning Platform',
      image_url: '',
      duration_hours: undefined,
      difficulty_level: undefined,
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

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setValue('image_url', '');
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file: File): Promise<string> => {
    const result = await storage.uploadFile(file, STORAGE_BUCKETS.PROJECT_MEDIA, {
      customPath: `courses/images/${file.name}`,
    });
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }
    return result.data!.publicUrl || result.data!.path;
  };

  const mutation = useMutation({
    mutationFn: async (data: OnlineCourseFormData) => {
      let imageUrl = data.image_url;

      // Upload image if file is selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const courseData = {
        ...data,
        image_url: imageUrl,
        duration_hours: data.duration_hours || null,
      };

      if (mode === 'edit' && initialData?.id) {
        return updateCourse(initialData.id, courseData);
      } else {
        return createCourse(courseData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success(`Course ${mode === 'edit' ? 'updated' : 'created'} successfully!`);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || `Failed to ${mode} course`);
    },
  });

  const onSubmit = (data: OnlineCourseFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'edit' ? 'Edit Course' : 'Create New Course'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter course title"
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
              placeholder="Enter course description"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Course URL */}
          <div>
            <Label htmlFor="course_url">Course URL *</Label>
            <div className="relative">
              <Input
                id="course_url"
                {...register('course_url')}
                placeholder="https://learning.fiap.org/course/123"
                className={errors.course_url ? 'border-red-500' : ''}
              />
              <ExternalLink className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            {errors.course_url && (
              <p className="text-sm text-red-600 mt-1">{errors.course_url.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Link to the external course platform where users will take the course
            </p>
          </div>

          {/* Instructor and Platform */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instructor_name">Instructor Name</Label>
              <Input
                id="instructor_name"
                {...register('instructor_name')}
                placeholder="Enter instructor name"
                className={errors.instructor_name ? 'border-red-500' : ''}
              />
              {errors.instructor_name && (
                <p className="text-sm text-red-600 mt-1">{errors.instructor_name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="platform_name">Platform Name</Label>
              <Input
                id="platform_name"
                {...register('platform_name')}
                placeholder="FIAP Learning Platform"
                className={errors.platform_name ? 'border-red-500' : ''}
              />
              {errors.platform_name && (
                <p className="text-sm text-red-600 mt-1">{errors.platform_name.message}</p>
              )}
            </div>
          </div>

          {/* Duration and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration_hours">Duration (hours)</Label>
              <Input
                id="duration_hours"
                type="number"
                min="0"
                step="0.5"
                {...register('duration_hours', { valueAsNumber: true })}
                placeholder="8"
                className={errors.duration_hours ? 'border-red-500' : ''}
              />
              {errors.duration_hours && (
                <p className="text-sm text-red-600 mt-1">{errors.duration_hours.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="difficulty_level">Difficulty Level</Label>
              <Select
                onValueChange={(value) => setValue('difficulty_level', value as OnlineCourseFormData['difficulty_level'])}
                defaultValue={watch('difficulty_level')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Upload */}
          <div className='mt-3 bg-muted rounded-lg p-3'>
            <Label className='text-sm font-medium mb-4'>Course Image</Label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Course preview"
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

              <div className="flex flex-col gap-4">
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
              placeholder="leadership, training, online-learning"
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
              <Label htmlFor="is_featured">Featured Course</Label>
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
          {mutation.isPending ? 'Saving...' : mode === 'edit' ? 'Update Course' : 'Create Course'}
        </Button>
      </div>
    </form>
  );
}
