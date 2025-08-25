'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, X, CalendarIcon } from 'lucide-react';
import { createProjectSchema, transformFormDataToInsert, type CreateProjectFormData } from './create-project-schema';
import { createProject } from '@/lib/data/projects';
import { createClient } from '@/lib/supabase/client';

interface CreateProjectModalProps {
  children?: React.ReactNode;
  organisationId: string;
}

// SDG Goals with descriptions
const SDG_GOALS = [
  { id: 1, title: 'No Poverty' },
  { id: 2, title: 'Zero Hunger' },
  { id: 3, title: 'Good Health and Well-being' },
  { id: 4, title: 'Quality Education' },
  { id: 5, title: 'Gender Equality' },
  { id: 6, title: 'Clean Water and Sanitation' },
  { id: 7, title: 'Affordable and Clean Energy' },
  { id: 8, title: 'Decent Work and Economic Growth' },
  { id: 9, title: 'Industry, Innovation and Infrastructure' },
  { id: 10, title: 'Reduced Inequality' },
  { id: 11, title: 'Sustainable Cities and Communities' },
  { id: 12, title: 'Responsible Consumption and Production' },
  { id: 13, title: 'Climate Action' },
  { id: 14, title: 'Life Below Water' },
  { id: 15, title: 'Life on Land' },
  { id: 16, title: 'Peace and Justice Strong Institutions' },
  { id: 17, title: 'Partnerships to achieve the Goal' },
];

export function CreateProjectModal({ children }: CreateProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [objectives, setObjectives] = useState<string[]>(['']);
  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      status: 'planning',
      currency: 'USD',
      public_visibility: true,
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (formData: CreateProjectFormData) => {
      const supabase = createClient();
      
      // Get current user and their organisation
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organisation_id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile?.organisation_id) {
        throw new Error('User organisation not found');
      }

      // Transform form data and create project
      const projectData = transformFormDataToInsert(formData, profile.organisation_id, user.id);
      return createProject(projectData);
    },
    onSuccess: () => {
      // Invalidate projects queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setOpen(false);
      reset();
      setObjectives(['']);
      setSelectedSDGs([]);
    },
    onError: (error) => {
      console.error('Error creating project:', error);
    },
  });

  const onSubmit = async (data: CreateProjectFormData) => {
    // Add objectives and SDGs to form data
    const filteredObjectives = objectives.filter(obj => obj.trim() !== '');
    const formDataWithExtras = {
      ...data,
      objectives: filteredObjectives.length > 0 ? filteredObjectives : undefined,
      sdg_goals: selectedSDGs.length > 0 ? selectedSDGs : undefined,
    };

    await createProjectMutation.mutateAsync(formDataWithExtras);
  };

  const addObjective = () => {
    setObjectives([...objectives, '']);
  };

  const removeObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const updateObjective = (index: number, value: string) => {
    const updated = [...objectives];
    updated[index] = value;
    setObjectives(updated);
  };

  const toggleSDG = (goalId: number) => {
    setSelectedSDGs(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new project to your organisation&apos;s portfolio. Fill out the basic information to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PlusIcon className="h-5 w-5" />
                Basic Information
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
                    {...register('title')}
                    placeholder="Enter project title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="summary">Project Summary</Label>
                  <Textarea
                    id="summary"
                    {...register('summary')}
                    placeholder="Brief summary of the project (max 500 characters)"
                    rows={3}
                  />
                  {errors.summary && (
                    <p className="text-sm text-red-600 mt-1">{errors.summary.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Detailed description of the project"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Project Status</Label>
                    <Select onValueChange={(value) => setValue('status', value as CreateProjectFormData['status'])}>
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
                      {...register('location')}
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
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Timeline & Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    {...register('start_date')}
                  />
                </div>

                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    {...register('end_date')}
                  />
                </div>

                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    step="0.01"
                    {...register('budget', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {errors.budget && (
                    <p className="text-sm text-red-600 mt-1">{errors.budget.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select onValueChange={(value) => setValue('currency', value)}>
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
                    {...register('beneficiaries_count', { valueAsNumber: true })}
                    placeholder="Expected number of beneficiaries"
                  />
                  {errors.beneficiaries_count && (
                    <p className="text-sm text-red-600 mt-1">{errors.beneficiaries_count.message}</p>
                  )}
                </div>
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
                    value={objective}
                    onChange={(e) => updateObjective(index, e.target.value)}
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
                onClick={addObjective}
                className="w-full"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Objective
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
                    className={`p-2 border rounded transition-colors ${
                      selectedSDGs.includes(goal.id)
                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedSDGs.includes(goal.id)}
                        onCheckedChange={() => toggleSDG(goal.id)}
                      />
                      <span className="text-sm font-medium">SDG {goal.id}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{goal.title}</p>
                  </div>
                ))}
              </div>
              {selectedSDGs.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Selected SDGs:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedSDGs.map((goalId) => (
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
                    {...register('contact_person')}
                    placeholder="Project contact person"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    {...register('contact_email')}
                    placeholder="project@example.com"
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
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="project_website">Project Website</Label>
                  <Input
                    id="project_website"
                    type="url"
                    {...register('project_website')}
                    placeholder="https://project-website.com"
                  />
                  {errors.project_website && (
                    <p className="text-sm text-red-600 mt-1">{errors.project_website.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="public_visibility"
                  checked={watch('public_visibility')}
                  onCheckedChange={(checked) => setValue('public_visibility', !!checked)}
                />
                <Label htmlFor="public_visibility" className="text-sm">
                  Make this project publicly visible
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || createProjectMutation.isPending}
            >
              {isSubmitting || createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>

          {createProjectMutation.error && (
            <div className="text-sm text-red-600 mt-2">
              Error: {createProjectMutation.error.message}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
