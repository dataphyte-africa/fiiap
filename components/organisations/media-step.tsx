'use client'

import { useFormContext } from 'react-hook-form'
import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ImageIcon, Upload, FileText, Check, X, Camera } from 'lucide-react'
import { 
  FormStepProps, 
  OrganisationFormData,
  mediaSchema
} from './types'

export function MediaStep({ onNext, onPrev, isLastStep, currentStep, totalSteps }: FormStepProps) {
  const { 
    register, 
    formState: { errors }, 
    watch,
    trigger,
    setValue
  } = useFormContext<OrganisationFormData>()

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const logoFileRef = useRef<HTMLInputElement>(null)
  const coverFileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    const mediaFields = Object.keys(mediaSchema.shape) as (keyof OrganisationFormData)[]
    const isValid = await trigger(mediaFields)
    if (isValid) {
      onNext() // This will trigger the final submission
    }
  }

  const logoUrl = watch('logo_url')
  const coverImageUrl = watch('cover_image_url')
  const logoFile = watch('logo_file')
  const coverImageFile = watch('cover_image_file')

  // Handle logo file upload
  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      setValue('logo_file', file)
      setValue('logo_url', '') // Clear URL when file is selected
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle cover image file upload
  const handleCoverFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }

      setValue('cover_image_file', file)
      setValue('cover_image_url', '') // Clear URL when file is selected
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove logo
  const removeLogo = () => {
    setValue('logo_file', undefined)
    setValue('logo_url', '')
    setLogoPreview(null)
    if (logoFileRef.current) {
      logoFileRef.current.value = ''
    }
  }

  // Remove cover image
  const removeCoverImage = () => {
    setValue('cover_image_file', undefined)
    setValue('cover_image_url', '')
    setCoverPreview(null)
    if (coverFileRef.current) {
      coverFileRef.current.value = ''
    }
  }

  // Get display image source
  const getLogoSrc = () => {
    if (logoPreview) return logoPreview
    if (logoUrl) return logoUrl
    return null
  }

  const getCoverSrc = () => {
    if (coverPreview) return coverPreview
    if (coverImageUrl) return coverImageUrl
    return null
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
            {currentStep}
          </div>
          <div>
            <h2 className="text-lg font-semibold">Media & Documents</h2>
            <p className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Organisation Logo
          </CardTitle>
          <CardDescription>
            Upload your organisation&apos;s logo to make your profile more recognizable.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Upload Logo</Label>
              <div className="text-xs text-muted-foreground">
                Max 5MB • JPG, PNG, GIF
              </div>
            </div>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              {getLogoSrc() ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <img 
                        src={getLogoSrc()!} 
                        alt="Logo preview" 
                        className="w-32 h-32 object-contain rounded-lg border bg-background"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={removeLogo}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {logoFile ? `File: ${logoFile.name}` : 'Logo from URL'}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => logoFileRef.current?.click()}
                      className="mt-2"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Change Logo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium mb-2">Upload your organisation logo</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Drag and drop or click to browse
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => logoFileRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
              
              <input
                ref={logoFileRef}
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* URL Alternative */}
          <div className="space-y-2">
            <Label htmlFor="logo_url" className="text-sm font-medium">
              Or provide Logo URL
            </Label>
            <Input
              id="logo_url"
              type="url"
              {...register('logo_url')}
              placeholder="https://example.com/logo.png"
              className={errors.logo_url ? 'border-destructive' : ''}
              disabled={!!logoFile}
            />
            {errors.logo_url && (
              <p className="text-sm text-destructive">{errors.logo_url.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Recommended size: 200x200px or larger, square format
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Cover Image
          </CardTitle>
          <CardDescription>
            Add a cover image to showcase your organisation&apos;s work or impact.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Upload Cover Image</Label>
              <div className="text-xs text-muted-foreground">
                Max 10MB • JPG, PNG, GIF
              </div>
            </div>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              {getCoverSrc() ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <img 
                        src={getCoverSrc()!} 
                        alt="Cover preview" 
                        className="w-full max-w-md h-32 object-cover rounded-lg border bg-background"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={removeCoverImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {coverImageFile ? `File: ${coverImageFile.name}` : 'Cover image from URL'}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => coverFileRef.current?.click()}
                      className="mt-2"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Change Cover Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium mb-2">Upload your cover image</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Drag and drop or click to browse
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => coverFileRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
              
              <input
                ref={coverFileRef}
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* URL Alternative */}
          <div className="space-y-2">
            <Label htmlFor="cover_image_url" className="text-sm font-medium">
              Or provide Cover Image URL
            </Label>
            <Input
              id="cover_image_url"
              type="url"
              {...register('cover_image_url')}
              placeholder="https://example.com/cover.jpg"
              className={errors.cover_image_url ? 'border-destructive' : ''}
              disabled={!!coverImageFile}
            />
            {errors.cover_image_url && (
              <p className="text-sm text-destructive">{errors.cover_image_url.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Recommended size: 1200x400px or similar wide format
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            File Upload Instructions
          </CardTitle>
          <CardDescription>
            Information about uploading files and documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium">How to add images and documents:</h4>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Upload your images to a cloud service (Google Drive, Dropbox, etc.)</li>
              <li>Make sure the files are publicly accessible</li>
              <li>Copy the direct link to the file</li>
              <li>Paste the URL in the appropriate field above</li>
            </ol>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> File upload functionality will be available after registration. 
                You can add and manage media files from your organisation dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            Ready to Submit
          </CardTitle>
          <CardDescription>
            Review your information and submit your organisation registration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
              What happens next?
            </h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 list-disc list-inside">
              <li>Your organisation will be submitted for review</li>
              <li>You&apos;ll receive a confirmation email</li>
              <li>Our team will review your application within 2-3 business days</li>
              <li>Once approved, your organisation will be publicly visible</li>
              <li>You can then create projects and connect with other CSOs</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrev}
        >
          Previous
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="bg-primary hover:bg-primary/90"
        >
          {isLastStep ? 'Submit Registration' : 'Continue'}
        </Button>
      </div>
    </div>
  )
} 