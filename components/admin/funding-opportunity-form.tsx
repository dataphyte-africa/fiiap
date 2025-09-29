'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { X, Calendar, DollarSign, Globe, Users, Tag, Building2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import { fundingOpportunityFormSchema, type FundingOpportunityFormData } from '@/lib/schemas/admin-content-schemas';
import { createFundingOpportunity, updateFundingOpportunity } from '@/lib/data/admin-content';
import { storage } from '@/lib/supabase/storage-client';
import { STORAGE_BUCKETS } from '@/lib/supabase/storage-config';

interface FundingOpportunityFormProps {
  initialData?: FundingOpportunityFormData & { id?: string };
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
  onCancel?: () => void;
}

const OPPORTUNITY_TYPES = [
  { value: 'grant', label: 'Grant', icon: DollarSign },
  { value: 'fellowship', label: 'Fellowship', icon: Users },
  { value: 'donor_call', label: 'Donor Call', icon: Building2 },
  { value: 'scholarship', label: 'Scholarship', icon: Users },
  { value: 'award', label: 'Award', icon: Tag },
  { value: 'loan', label: 'Loan', icon: DollarSign },
  { value: 'other', label: 'Other', icon: Tag },
];

const OPPORTUNITY_STATUS = [
  { value: 'open', label: 'Open', color: 'bg-green-100 text-green-800' },
  { value: 'closing_soon', label: 'Closing Soon', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'closed', label: 'Closed', color: 'bg-red-100 text-red-800' },
  { value: 'postponed', label: 'Postponed', color: 'bg-gray-100 text-gray-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

const FUNDER_TYPES = [
  { value: 'government', label: 'Government' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'ngo', label: 'NGO' },
  { value: 'international_organization', label: 'International Organization' },
  { value: 'private_corporation', label: 'Private Corporation' },
  { value: 'multilateral_agency', label: 'Multilateral Agency' },
  { value: 'bilateral_agency', label: 'Bilateral Agency' },
  { value: 'university', label: 'University' },
  { value: 'research_institute', label: 'Research Institute' },
  { value: 'other', label: 'Other' },
];

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'NGN', label: 'NGN (₦)' },
  { value: 'XOF', label: 'XOF (CFA)' },
  { value: 'GMD', label: 'GMD (D)' },
];

const THEMATIC_AREAS = [
  'Governance & Democracy',
  'Human Rights',
  'Gender Equality',
  'Youth Development',
  'Education',
  'Health',
  'Environment & Climate',
  'Economic Development',
  'Media & Information',
  'Peace & Security',
  'Civil Society Strengthening',
  'Digital Rights',
  'Migration',
  'Social Justice',
];

const TARGET_POPULATIONS = [
  'Youth', 'Women', 'Children', 'Civil Society Organizations',
  'Media Professionals', 'Policy Makers', 'Researchers',
  'Community Leaders', 'Marginalized Communities', 'General Public'
];

export function FundingOpportunityForm({ initialData, mode = 'create', onSuccess, onCancel }: FundingOpportunityFormProps) {
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [logoPreview, setLogoPreview] = useState<string>('');

  const form = useForm({
    resolver: zodResolver(fundingOpportunityFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      summary: '',
      opportunity_type: 'grant',
      status: 'open',
      funding_amount_min: undefined,
      funding_amount_max: undefined,
      currency: 'USD',
      funding_duration_months: undefined,
      funding_period_start: '',
      funding_period_end: '',
      application_deadline: '',
      application_url: '',
      application_requirements: '',
      eligibility_criteria: '',
      selection_criteria: '',
      geographic_focus: '',
      target_countries: '',
      thematic_areas: '',
      target_populations: '',
      funder_name: '',
      funder_type: 'foundation',
      funder_website: '',
      funder_logo_url: '',
      funder_contact_email: '',
      funder_contact_person: '',
      funder_description: '',
      featured_image_url: '',
      tags: '',
      language: 'English',
      is_featured: false,
      is_visible: true,
      is_verified: false,
      ...initialData,
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;

  // Auto-generate slug from title
  const watchedTitle = watch('title');
  useEffect(() => {
    if (watchedTitle && mode === 'create') {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [watchedTitle, mode, setValue]);

  // Watch for image URL changes to update preview
  const watchedImageUrl = watch('featured_image_url');
  const watchedLogoUrl = watch('funder_logo_url');

  useEffect(() => {
    if (watchedImageUrl && !imageFile) {
      setImagePreview(watchedImageUrl);
    }
  }, [watchedImageUrl, imageFile]);

  useEffect(() => {
    if (watchedLogoUrl && !logoFile) {
      setLogoPreview(watchedLogoUrl);
    }
  }, [watchedLogoUrl, logoFile]);

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
      setValue('featured_image_url', '');
    }
  };

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Logo file size must be less than 2MB');
        return;
      }
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      setValue('funder_logo_url', '');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setValue('featured_image_url', '');
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setValue('funder_logo_url', '');
  };

  // Upload file to Supabase Storage
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const result = await storage.uploadFile(file, STORAGE_BUCKETS.PROJECT_MEDIA, {
      customPath: `funding/${folder}/${Date.now()}-${file.name}`,
    });
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }
    return result.data!.publicUrl || result.data!.path;
  };

  const mutation = useMutation({
    mutationFn: async (data: FundingOpportunityFormData) => {
      let featuredImageUrl = data.featured_image_url;
      let funderLogoUrl = data.funder_logo_url;

      // Upload featured image if file is selected
      if (imageFile) {
        featuredImageUrl = await uploadFile(imageFile, 'images');
      }

      // Upload funder logo if file is selected
      if (logoFile) {
        funderLogoUrl = await uploadFile(logoFile, 'logos');
      }

      const opportunityData = {
        ...data,
        funding_period_start: data.funding_period_start || null,
        funding_period_end: data.funding_period_end || null,
        application_deadline: data.application_deadline || null,
        application_requirements: data.application_requirements || null,
        eligibility_criteria: data.eligibility_criteria || null,
        selection_criteria: data.selection_criteria || null,
        geographic_focus: data.geographic_focus || null,
        target_countries: data.target_countries || undefined,
        thematic_areas: data.thematic_areas || null,
        target_populations: data.target_populations || null,
        funder_type: data.funder_type || null,
        funder_website: data.funder_website || null,
        funder_logo_url: funderLogoUrl,
        funder_contact_email: data.funder_contact_email || null,
        funder_contact_person: data.funder_contact_person || null,
        funder_description: data.funder_description || null,
        featured_image_url: featuredImageUrl,
      };

      if (mode === 'edit' && initialData?.id) {
        return updateFundingOpportunity(initialData.id, opportunityData);
      } else {
        return createFundingOpportunity(opportunityData as FundingOpportunityFormData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funding-opportunities'] });
      toast.success(`Funding opportunity ${mode === 'edit' ? 'updated' : 'created'} successfully!`);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || `Failed to ${mode} funding opportunity`);
    },
  });

  const onSubmit = (data: FundingOpportunityFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {mode === 'edit' ? 'Edit Funding Opportunity' : 'Create New Funding Opportunity'}
        </h2>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : mode === 'edit' ? 'Update Opportunity' : 'Create Opportunity'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="funding">Funding Details</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
          <TabsTrigger value="targeting">Targeting</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Enter opportunity title"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder="url-friendly-slug"
                  className={errors.slug ? 'border-red-500' : ''}
                />
                {errors.slug && (
                  <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
                )}
              </div>

              {/* Opportunity Type & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="opportunity_type">Opportunity Type *</Label>
                  <Select
                    onValueChange={(value) => setValue('opportunity_type', value as FundingOpportunityFormData['opportunity_type'])}
                    defaultValue={watch('opportunity_type')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {OPPORTUNITY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    onValueChange={(value) => setValue('status', value as FundingOpportunityFormData['status'])}
                    defaultValue={watch('status')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {OPPORTUNITY_STATUS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <Badge className={status.color}>{status.label}</Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Summary */}
              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  {...register('summary')}
                  placeholder="Brief summary of the opportunity"
                  rows={3}
                  className={errors.summary ? 'border-red-500' : ''}
                />
                {errors.summary && (
                  <p className="text-sm text-red-600 mt-1">{errors.summary.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Detailed description of the opportunity"
                  rows={6}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Featured Image */}
              <div className="bg-muted rounded-lg p-4">
                <Label>Featured Image</Label>
                <div className="space-y-4">
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Featured image preview"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="image_file">Upload Image</Label>
                      <Input
                        id="image_file"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
                    </div>
                    <div>
                      <Label htmlFor="featured_image_url">Or Image URL</Label>
                      <Input
                        id="featured_image_url"
                        {...register('featured_image_url')}
                        placeholder="https://example.com/image.jpg"
                        className={`mt-1 ${errors.featured_image_url ? 'border-red-500' : ''}`}
                      />
                    </div>
                  </div>
                  {errors.featured_image_url && (
                    <p className="text-sm text-red-600 mt-1">{errors.featured_image_url.message}</p>
                  )}
                </div>
              </div>

              {/* Tags & Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    {...register('tags')}
                    placeholder="funding, grant, development"
                    className={errors.tags ? 'border-red-500' : ''}
                  />
                  {errors.tags && (
                    <p className="text-sm text-red-600 mt-1">{errors.tags.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    onValueChange={(value) => setValue('language', value as FundingOpportunityFormData['language'])}
                    defaultValue={watch('language')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="is_featured">Featured Opportunity</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_verified"
                    checked={watch('is_verified')}
                    onCheckedChange={(checked) => setValue('is_verified', !!checked)}
                  />
                  <Label htmlFor="is_verified">Verified Opportunity</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Funding Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Funding Amount */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="funding_amount_min">Minimum Amount</Label>
                  <Input
                    id="funding_amount_min"
                    type="number"
                    {...register('funding_amount_min', { setValueAs: (value) => {
                      const num = Number(value)
                      return isNaN(num) ? undefined : num
                    } })}
                    placeholder="0"
                    className={errors.funding_amount_min ? 'border-red-500' : ''}
                  />
                  {errors.funding_amount_min && (
                    <p className="text-sm text-red-600 mt-1">{errors.funding_amount_min.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="funding_amount_max">Maximum Amount</Label>
                  <Input
                    id="funding_amount_max"
                    type="number"
                    {...register('funding_amount_max', { setValueAs: (value) => {
                      const num = Number(value)
                      return isNaN(num) ? undefined : num
                    } })}
                    placeholder="0"
                    className={errors.funding_amount_max ? 'border-red-500' : ''}
                  />
                  {errors.funding_amount_max && (
                    <p className="text-sm text-red-600 mt-1">{errors.funding_amount_max.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    onValueChange={(value) => setValue('currency', value)}
                    defaultValue={watch('currency')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Duration */}
              <div>
                <Label htmlFor="funding_duration_months">Funding Duration (months)</Label>
                <Input
                  id="funding_duration_months"
                  type="number"
                  {...register('funding_duration_months', {  setValueAs: (value) => {
                    const num = Number(value)
                    return isNaN(num) ? undefined : num
                  } })}
                  placeholder="12"
                  className={errors.funding_duration_months ? 'border-red-500' : ''}
                />
                {errors.funding_duration_months && (
                  <p className="text-sm text-red-600 mt-1">{errors.funding_duration_months.message}</p>
                )}
              </div>

              {/* Funding Period */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="funding_period_start">Funding Period Start</Label>
                  <Input
                    id="funding_period_start"
                    type="date"
                    {...register('funding_period_start')}
                    className={errors.funding_period_start ? 'border-red-500' : ''}
                  />
                  {errors.funding_period_start && (
                    <p className="text-sm text-red-600 mt-1">{errors.funding_period_start.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="funding_period_end">Funding Period End</Label>
                  <Input
                    id="funding_period_end"
                    type="date"
                    {...register('funding_period_end')}
                    className={errors.funding_period_end ? 'border-red-500' : ''}
                  />
                  {errors.funding_period_end && (
                    <p className="text-sm text-red-600 mt-1">{errors.funding_period_end.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funder Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Funder Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Funder Name & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="funder_name">Funder Name *</Label>
                  <Input
                    id="funder_name"
                    {...register('funder_name')}
                    placeholder="Organization name"
                    className={errors.funder_name ? 'border-red-500' : ''}
                  />
                  {errors.funder_name && (
                    <p className="text-sm text-red-600 mt-1">{errors.funder_name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="funder_type">Funder Type</Label>
                  <Select
                    onValueChange={(value) => setValue('funder_type', value as FundingOpportunityFormData['funder_type'])}
                    defaultValue={watch('funder_type')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select funder type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FUNDER_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Funder Website & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="funder_website">Funder Website</Label>
                  <Input
                    id="funder_website"
                    {...register('funder_website')}
                    placeholder="https://example.org"
                    className={errors.funder_website ? 'border-red-500' : ''}
                  />
                  {errors.funder_website && (
                    <p className="text-sm text-red-600 mt-1">{errors.funder_website.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="funder_contact_email">Contact Email</Label>
                  <Input
                    id="funder_contact_email"
                    type="email"
                    {...register('funder_contact_email')}
                    placeholder="contact@example.org"
                    className={errors.funder_contact_email ? 'border-red-500' : ''}
                  />
                  {errors.funder_contact_email && (
                    <p className="text-sm text-red-600 mt-1">{errors.funder_contact_email.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Person */}
              <div>
                <Label htmlFor="funder_contact_person">Contact Person</Label>
                <Input
                  id="funder_contact_person"
                  {...register('funder_contact_person')}
                  placeholder="Contact person name"
                  className={errors.funder_contact_person ? 'border-red-500' : ''}
                />
                {errors.funder_contact_person && (
                  <p className="text-sm text-red-600 mt-1">{errors.funder_contact_person.message}</p>
                )}
              </div>

              {/* Funder Description */}
              <div>
                <Label htmlFor="funder_description">Funder Description</Label>
                <Textarea
                  id="funder_description"
                  {...register('funder_description')}
                  placeholder="Brief description of the funding organization"
                  rows={3}
                  className={errors.funder_description ? 'border-red-500' : ''}
                />
                {errors.funder_description && (
                  <p className="text-sm text-red-600 mt-1">{errors.funder_description.message}</p>
                )}
              </div>

              {/* Funder Logo */}
              <div className="bg-muted rounded-lg p-4">
                <Label>Funder Logo</Label>
                <div className="space-y-4">
                  {logoPreview && (
                    <div className="relative w-32">
                      <img
                        src={logoPreview}
                        alt="Funder logo preview"
                        className="w-32 h-32 object-contain rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2"
                        onClick={removeLogo}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="logo_file">Upload Logo</Label>
                      <Input
                        id="logo_file"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Max 2MB</p>
                    </div>
                    <div>
                      <Label htmlFor="funder_logo_url">Or Logo URL</Label>
                      <Input
                        id="funder_logo_url"
                        {...register('funder_logo_url')}
                        placeholder="https://example.com/logo.png"
                        className={`mt-1 ${errors.funder_logo_url ? 'border-red-500' : ''}`}
                      />
                    </div>
                  </div>
                  {errors.funder_logo_url && (
                    <p className="text-sm text-red-600 mt-1">{errors.funder_logo_url.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="application" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Application Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Application Deadline & URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="application_deadline">Application Deadline</Label>
                  <Input
                    id="application_deadline"
                    type="datetime-local"
                    {...register('application_deadline')}
                    className={errors.application_deadline ? 'border-red-500' : ''}
                  />
                  {errors.application_deadline && (
                    <p className="text-sm text-red-600 mt-1">{errors.application_deadline.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="application_url">Application URL</Label>
                  <Input
                    id="application_url"
                    {...register('application_url')}
                    placeholder="https://example.org/apply"
                    className={errors.application_url ? 'border-red-500' : ''}
                  />
                  {errors.application_url && (
                    <p className="text-sm text-red-600 mt-1">{errors.application_url.message}</p>
                  )}
                </div>
              </div>

              {/* Application Requirements */}
              <div>
                <Label htmlFor="application_requirements">Application Requirements (comma-separated)</Label>
                <Textarea
                  id="application_requirements"
                  {...register('application_requirements')}
                  placeholder="Proposal, Budget, CV, Letters of recommendation"
                  rows={3}
                  className={errors.application_requirements ? 'border-red-500' : ''}
                />
                {errors.application_requirements && (
                  <p className="text-sm text-red-600 mt-1">{errors.application_requirements.message}</p>
                )}
              </div>

              {/* Eligibility Criteria */}
              <div>
                <Label htmlFor="eligibility_criteria">Eligibility Criteria</Label>
                <Textarea
                  id="eligibility_criteria"
                  {...register('eligibility_criteria')}
                  placeholder="Who can apply for this opportunity?"
                  rows={4}
                  className={errors.eligibility_criteria ? 'border-red-500' : ''}
                />
                {errors.eligibility_criteria && (
                  <p className="text-sm text-red-600 mt-1">{errors.eligibility_criteria.message}</p>
                )}
              </div>

              {/* Selection Criteria */}
              <div>
                <Label htmlFor="selection_criteria">Selection Criteria</Label>
                <Textarea
                  id="selection_criteria"
                  {...register('selection_criteria')}
                  placeholder="How will applications be evaluated?"
                  rows={4}
                  className={errors.selection_criteria ? 'border-red-500' : ''}
                />
                {errors.selection_criteria && (
                  <p className="text-sm text-red-600 mt-1">{errors.selection_criteria.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="targeting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Geographic & Thematic Focus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Geographic Focus */}
              <div>
                <Label htmlFor="geographic_focus">Geographic Focus (comma-separated)</Label>
                <Input
                  id="geographic_focus"
                  {...register('geographic_focus')}
                  placeholder="Nigeria, West Africa, Global"
                  className={errors.geographic_focus ? 'border-red-500' : ''}
                />
                {errors.geographic_focus && (
                  <p className="text-sm text-red-600 mt-1">{errors.geographic_focus.message}</p>
                )}
              </div>

              {/* Target Countries */}
              <div>
                <Label htmlFor="target_countries">Target Countries (comma-separated)</Label>
                <Input
                  id="target_countries"
                  {...register('target_countries')}
                  placeholder="Nigeria, Benin, The Gambia"
                  className={errors.target_countries ? 'border-red-500' : ''}
                />
                {errors.target_countries && (
                  <p className="text-sm text-red-600 mt-1">{errors.target_countries.message}</p>
                )}
              </div>

              {/* Thematic Areas */}
              <div>
                <Label htmlFor="thematic_areas">Thematic Areas (comma-separated)</Label>
                <Input
                  id="thematic_areas"
                  {...register('thematic_areas')}
                  placeholder="Governance, Human Rights, Education"
                  className={errors.thematic_areas ? 'border-red-500' : ''}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {THEMATIC_AREAS.map((area) => (
                    <Badge
                      key={area}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => {
                        const current = watch('thematic_areas') || '';
                        const areas = current.split(',').map(a => a.trim()).filter(a => a);
                        if (!areas.includes(area)) {
                          setValue('thematic_areas', [...areas, area].join(', '));
                        }
                      }}
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
                {errors.thematic_areas && (
                  <p className="text-sm text-red-600 mt-1">{errors.thematic_areas.message}</p>
                )}
              </div>

              {/* Target Populations */}
              <div>
                <Label htmlFor="target_populations">Target Populations (comma-separated)</Label>
                <Input
                  id="target_populations"
                  {...register('target_populations')}
                  placeholder="Youth, Women, Civil Society Organizations"
                  className={errors.target_populations ? 'border-red-500' : ''}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {TARGET_POPULATIONS.map((population) => (
                    <Badge
                      key={population}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => {
                        const current = watch('target_populations') || '';
                        const populations = current.split(',').map(p => p.trim()).filter(p => p);
                        if (!populations.includes(population)) {
                          setValue('target_populations', [...populations, population].join(', '));
                        }
                      }}
                    >
                      {population}
                    </Badge>
                  ))}
                </div>
                {errors.target_populations && (
                  <p className="text-sm text-red-600 mt-1">{errors.target_populations.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
