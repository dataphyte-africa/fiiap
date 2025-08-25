'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, X, Save, InfoIcon } from 'lucide-react';
import { ProjectFormData, ProjectFullFormData, SDG_GOALS } from './project-form-schemas';
import { useMutation } from '@tanstack/react-query';
import { storage } from '@/lib/supabase/storage-client';
import { STORAGE_BUCKETS } from '@/lib/supabase/storage-config';
import { updateProject } from '@/lib/data/projects';
import { toast } from 'sonner';

interface ProjectBasicInfoSectionProps {
  onSave?: (data: Partial<ProjectFormData>) => Promise<void>;
  isEditing?: boolean;
  projectId: string
  userId: string;
  organisationId: string;
}

export function ProjectBasicInfoSection({ onSave, projectId, userId, organisationId }: ProjectBasicInfoSectionProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useFormContext<ProjectFullFormData>();

 
  const statusRegister = register('project.status');
  const statusValue = watch('project.status');
  const currencyRegister = register('project.currency');
  const currencyValue = watch('project.currency');
  const {fields:objectives, append:appendObjective, remove:removeObjective} = useFieldArray({
    name: 'project.objectives',
  });
  const {fields:outcomes, append:appendOutcome, remove:removeOutcome} = useFieldArray({
    name: 'project.outcomes',
  });
  const sdgGoals = watch('project.sdg_goals') || [];
  const [, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(watch('project.featured_image_url') || null);

  const saveBasicInfoMutation = useMutation({
    mutationFn: async (data: Partial<ProjectFormData>) => {
      if (onSave) {
        await onSave(data);
      } else{
         await updateProject(projectId, {
          ...data,
          sdg_goals: sdgGoals,
         })
      }
    },
    onSuccess: () => {
      console.log('Basic info saved successfully');
      toast.success('Basic info saved successfully');
    },
    onError: (error) => {
      console.error('Error saving basic info:', error);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      
      
      // Get current user and their organisation
     

      // Upload to storage
      const result = await storage.uploadFile(file, STORAGE_BUCKETS.PROJECT_MEDIA, {
        organisationId: organisationId,
        userId: userId,
        customPath: `${organisationId}/projects/${projectId}/featured_image.jpg`,
      });

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      return result.data!.publicUrl || result.data!.path;
    },
    onSuccess: (imageUrl) => {
      setValue('project.featured_image_url', imageUrl);
      setFeaturedImagePreview(imageUrl);
    },
    onError: (error) => {
      console.error('Error uploading image:', error);
    },
  });

  const handleSave = async () => {
    const currentData = getValues();
    const basicInfoData: Partial<ProjectFormData> = {
      title: currentData.project.title,
      summary: currentData.project.summary,
      description: currentData.project.description,
      status: currentData.project.status,
      location: currentData.project.location,
      start_date: currentData.project.start_date,
      end_date: currentData.project.end_date,
      budget: currentData.project.budget,
      currency: currentData.project.currency,
      beneficiaries_count: currentData.project.beneficiaries_count,
      contact_person: currentData.project.contact_person,
      contact_email: currentData.project.contact_email,
      contact_phone: currentData.project.contact_phone,
      project_website: currentData.project.project_website,
      public_visibility: currentData.project.public_visibility,
      objectives: currentData.project.objectives,
      outcomes:  currentData.project.outcomes,
      sdg_goals: sdgGoals,
      featured: currentData.project.featured,
      featured_image_url: currentData.project.featured_image_url,
    };


    await saveBasicInfoMutation.mutateAsync(basicInfoData);
  };

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFeaturedImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload image
      uploadImageMutation.mutate(file);
    }
  };

  const toggleSDG = (goalId: number) => {
    const newSelectedSDGs = sdgGoals.includes(goalId) 
      ? sdgGoals.filter(id => id !== goalId)
      : [...sdgGoals, goalId];
    setValue('project.sdg_goals', newSelectedSDGs);
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <InfoIcon className="h-5 w-5" />
            Basic Information
            
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={saveBasicInfoMutation.isPending}
                className="ml-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveBasicInfoMutation.isPending ? 'Saving...' : 'Save Section'}
              </Button>
          </CardTitle>
          <CardDescription>
            Provide the essential details about your project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                {...register('project.title')}
                placeholder="Enter project title"
              />
              {errors.project?.title && (
                <p className="text-sm text-red-600 mt-1">{errors.project?.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="summary">Project Summary</Label>
              <Textarea
                id="summary"
                {...register('project.summary')}
                placeholder="Brief summary of the project (max 500 characters)"
                rows={3}
              />
              {errors.project?.summary && (
                <p className="text-sm text-red-600 mt-1">{errors.project?.summary.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                {...register('project.description')}
                placeholder="Detailed description of the project"
                rows={4}
              />
              {errors.project?.description && (
                <p className="text-sm text-red-600 mt-1">{errors.project?.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Project Status</Label>
                <Select defaultValue={statusValue} onValueChange={(value) => statusRegister.onChange({target: {value: value as ProjectFormData['status']}})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register('project.location')}
                  placeholder="Project location"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline and Budget */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline & Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                {...register('project.start_date')}
              />
            </div>

            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                {...register('project.end_date')}
              />
            </div>

            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                {...register('project.budget', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.project?.budget && (
                <p className="text-sm text-red-600 mt-1">{errors.project?.budget.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue={currencyValue} onValueChange={(value) => currencyRegister.onChange({target: {value: value as ProjectFormData['currency']}})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="XOF">XOF (CFA Franc)</SelectItem>
                  <SelectItem value="NGN">NGN (₦)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="beneficiaries_count">Number of Beneficiaries</Label>
              <Input
                id="beneficiaries_count"
                type="number"
                {...register('project.beneficiaries_count', { valueAsNumber: true })}
                placeholder="Expected number of beneficiaries"
              />
              {errors.project?.beneficiaries_count && (
                <p className="text-sm text-red-600 mt-1">{errors.project?.beneficiaries_count.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Image */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Featured Image</CardTitle>
          <CardDescription>
            Upload a featured image for your project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="featured_image">Featured Image</Label>
            <Input
              id="featured_image"
              type="file"
              accept="image/*"
              onChange={handleFeaturedImageChange}
              disabled={uploadImageMutation.isPending}
            />
            {uploadImageMutation.isPending && (
              <p className="text-sm text-blue-600 mt-1">Uploading image...</p>
            )}
          </div>
          
          {featuredImagePreview && (
            <div className="mt-4">
              <Image
                src={featuredImagePreview}
                alt="Featured image preview"
                width={400}
                height={192}
                className="w-full max-w-md h-48 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={watch('project.featured')}
              onCheckedChange={(checked) => setValue('project.featured', !!checked)}
            />
            <Label htmlFor="featured" className="text-sm">
              Mark as featured project
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Project Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Objectives</CardTitle>
          <CardDescription>
            List the main objectives of your project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {objectives.map((objective, index) => (
            <div key={index} className="flex gap-2">
              <Input
                {...register(`project.objectives.${index}`)}
                placeholder={`Objective ${index + 1}`}
              />
              {objectives.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeObjective(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendObjective('')}
            className="w-full"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Objective
          </Button>
        </CardContent>
      </Card>

      {/* Project Outcomes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expected Outcomes</CardTitle>
          <CardDescription>
            List the expected outcomes of your project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {outcomes.map((outcome, index) => (
            <div key={index} className="flex gap-2">
              <Input
                {...register(`project.outcomes.${index}`)}
              />
              {outcomes.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeOutcome(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendOutcome('')}
            className="w-full"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Outcome
          </Button>
        </CardContent>
      </Card>

      {/* SDG Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sustainable Development Goals</CardTitle>
          <CardDescription>
            Select the SDG goals that align with your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {SDG_GOALS.map((goal) => (
              <div
                key={goal.id}
                className={`p-2 border rounded transition-colors cursor-pointer ${
                  sdgGoals.includes(goal.id)
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                    : 'hover:bg-muted'
                }`}
               //  onClick={() => toggleSDG(goal.id)}
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={sdgGoals.includes(goal.id)}
                    onCheckedChange={() => toggleSDG(goal.id)}
                  />
                  <span className="text-sm font-medium">SDG {goal.id}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{goal.title}</p>
              </div>
            ))}
          </div>
          {sdgGoals.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-2">Selected SDGs:</p>
              <div className="flex flex-wrap gap-1">
                {sdgGoals.map((goalId) => (
                  <Badge key={goalId} variant="secondary">
                    SDG {goalId}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
          <CardDescription>
            Optional contact details for this project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                {...register('project.contact_person')}
                placeholder="Project contact person"
              />
            </div>

            <div>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                {...register('project.contact_email')}
                placeholder="project@example.com"
              />
              {errors.project?.contact_email && (
                <p className="text-sm text-red-600 mt-1">{errors.project?.contact_email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                {...register('project.contact_phone')}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="project_website">Project Website</Label>
              <Input
                id="project_website"
                type="url"
                {...register('project.project_website')}
                placeholder="https://project-website.com"
              />
              {errors.project?.project_website && (
                <p className="text-sm text-red-600 mt-1">{errors.project?.project_website.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="public_visibility"
              checked={watch('project.public_visibility')}
              onCheckedChange={(checked) => setValue('project.public_visibility', !!checked)}
            />
            <Label htmlFor="public_visibility" className="text-sm">
              Make this project publicly visible
            </Label>
          </div>
        </CardContent>
      </Card>

      {saveBasicInfoMutation.error && (
        <div className="text-sm text-red-600 mt-2">
          Error: {saveBasicInfoMutation.error.message}
        </div>
      )}
    </div>
  );
}
