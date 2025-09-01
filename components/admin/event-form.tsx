'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { eventFormSchema, type EventFormData } from '@/lib/schemas/admin-content-schemas';
import { createEvent, updateEvent } from '@/lib/data/admin-content';
import { storage } from '@/lib/supabase/storage-client';
import { STORAGE_BUCKETS } from '@/lib/supabase/storage-config';

interface EventFormProps {
  initialData?: EventFormData & { id?: string };
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EVENT_TYPES = [
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'training', label: 'Training' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'networking', label: 'Networking' },
  { value: 'fundraiser', label: 'Fundraiser' },
  { value: 'other', label: 'Other' },
];

export function EventForm({ initialData, mode = 'create', onSuccess, onCancel }: EventFormProps) {
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      event_date: '',
      event_end_date: '',
      location: '',
      venue_name: '',
      registration_url: '',
      meeting_url: '',
      event_website: '',
      image_url: '',
      event_type: undefined,
      is_virtual: false,
      contact_person: '',
      contact_email: '',
      contact_phone: '',
      tags: '',
      max_participants: undefined,
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
      customPath: `events/images/${file.name}`,
    });
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }
    return result.data!.publicUrl || result.data!.path;
  };

  const mutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      let imageUrl = data.image_url;

      // Upload image if file is selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const eventData = {
        ...data,
        image_url: imageUrl,
        event_date: new Date(data.event_date).toISOString(),
        event_end_date: data.event_end_date ? new Date(data.event_end_date).toISOString() : null,
        max_participants: data.max_participants || null,
      };

      if (mode === 'edit' && initialData?.id) {
        return updateEvent(initialData.id, eventData);
      } else {
        return createEvent(eventData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success(`Event ${mode === 'edit' ? 'updated' : 'created'} successfully!`);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || `Failed to ${mode} event`);
    },
  });

  const onSubmit = (data: EventFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'edit' ? 'Edit Event' : 'Create New Event'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter event title"
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
              placeholder="Enter event description"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Event Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event_date">Event Date *</Label>
              <Input
                id="event_date"
                type="datetime-local"
                {...register('event_date')}
                className={errors.event_date ? 'border-red-500' : ''}
              />
              {errors.event_date && (
                <p className="text-sm text-red-600 mt-1">{errors.event_date.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="event_end_date">End Date (Optional)</Label>
              <Input
                id="event_end_date"
                type="datetime-local"
                {...register('event_end_date')}
                className={errors.event_end_date ? 'border-red-500' : ''}
              />
              {errors.event_end_date && (
                <p className="text-sm text-red-600 mt-1">{errors.event_end_date.message}</p>
              )}
            </div>
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="Enter event location"
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && (
                <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="venue_name">Venue Name</Label>
              <Input
                id="venue_name"
                {...register('venue_name')}
                placeholder="Enter venue name"
                className={errors.venue_name ? 'border-red-500' : ''}
              />
              {errors.venue_name && (
                <p className="text-sm text-red-600 mt-1">{errors.venue_name.message}</p>
              )}
            </div>
          </div>

          {/* Event Type and Virtual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event_type">Event Type</Label>
                <Select onValueChange={(value) => setValue('event_type', value as EventFormData['event_type'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="is_virtual"
                checked={watch('is_virtual')}
                onCheckedChange={(checked) => setValue('is_virtual', !!checked)}
              />
              <Label htmlFor="is_virtual">Virtual Event</Label>
            </div>
          </div>

          {/* URLs */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="registration_url">Registration URL</Label>
              <Input
                id="registration_url"
                {...register('registration_url')}
                placeholder="https://example.com/register"
                className={errors.registration_url ? 'border-red-500' : ''}
              />
              {errors.registration_url && (
                <p className="text-sm text-red-600 mt-1">{errors.registration_url.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="meeting_url">Meeting URL (for virtual events)</Label>
              <Input
                id="meeting_url"
                {...register('meeting_url')}
                placeholder="https://zoom.us/j/123456789"
                className={errors.meeting_url ? 'border-red-500' : ''}
              />
              {errors.meeting_url && (
                <p className="text-sm text-red-600 mt-1">{errors.meeting_url.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="event_website">Event Website</Label>
              <Input
                id="event_website"
                {...register('event_website')}
                placeholder="https://example.com/event"
                className={errors.event_website ? 'border-red-500' : ''}
              />
              {errors.event_website && (
                <p className="text-sm text-red-600 mt-1">{errors.event_website.message}</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className='mt-3 bg-muted rounded-lg p-3'>
            <Label className='text-sm font-medium mb-4'>Event Image</Label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Event preview"
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

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  {...register('contact_person')}
                  placeholder="John Doe"
                  className={errors.contact_person ? 'border-red-500' : ''}
                />
                {errors.contact_person && (
                  <p className="text-sm text-red-600 mt-1">{errors.contact_person.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  {...register('contact_email')}
                  placeholder="john@example.com"
                  className={errors.contact_email ? 'border-red-500' : ''}
                />
                {errors.contact_email && (
                  <p className="text-sm text-red-600 mt-1">{errors.contact_email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  {...register('contact_phone')}
                  placeholder="+1234567890"
                  className={errors.contact_phone ? 'border-red-500' : ''}
                />
                {errors.contact_phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.contact_phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                {...register('tags')}
                placeholder="conference, tech, networking"
                className={errors.tags ? 'border-red-500' : ''}
              />
              {errors.tags && (
                <p className="text-sm text-red-600 mt-1">{errors.tags.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="max_participants">Max Participants</Label>
              <Input
                id="max_participants"
                type="number"
                {...register('max_participants', { valueAsNumber: true })}
                placeholder="100"
                className={errors.max_participants ? 'border-red-500' : ''}
              />
              {errors.max_participants && (
                <p className="text-sm text-red-600 mt-1">{errors.max_participants.message}</p>
              )}
            </div>
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
              <Label htmlFor="is_featured">Featured Event</Label>
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
          {mutation.isPending ? 'Saving...' : mode === 'edit' ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
}
