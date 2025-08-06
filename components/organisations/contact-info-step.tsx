'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Mail, Phone, Globe, MapPin, Languages } from 'lucide-react'
import { 
  FormStepProps, 
  OrganisationFormData, 
  LANGUAGES,
  contactInfoSchema
} from './types'
import { Database } from '@/types/db'

export function ContactInfoStep({ onNext, onPrev, isFirstStep, currentStep, totalSteps }: FormStepProps) {
  const { 
    register, 
    formState: { errors }, 
    setValue, 
    watch,
    trigger 
  } = useFormContext<OrganisationFormData>()

  const handleNext = async () => {
    const contactInfoFields = Object.keys(contactInfoSchema.shape) as (keyof OrganisationFormData)[]
    const isValid = await trigger(contactInfoFields)
    if (isValid) {
      onNext()
    }
  }

  const selectedLanguages = watch('languages_spoken') || []

  const handleLanguageChange = (language: string, checked: boolean) => {
    const current = selectedLanguages
    if (checked) {
      setValue('languages_spoken', [...current, language] as Database['public']['Enums']['language_enum'][])
    } else {
      setValue('languages_spoken', current.filter(lang => lang !== language) as Database['public']['Enums']['language_enum'][])
    }
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
            <h2 className="text-lg font-semibold">Contact Information</h2>
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
            <Mail className="h-5 w-5 text-primary" />
            Contact Details
          </CardTitle>
          <CardDescription>
            Provide contact information so people can reach your organisation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Email
              </Label>
              <Input
                id="contact_email"
                type="email"
                {...register('contact_email')}
                placeholder="contact@organisation.org"
                className={errors.contact_email ? 'border-destructive' : ''}
              />
              {errors.contact_email && (
                <p className="text-sm text-destructive">{errors.contact_email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone" className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Phone
              </Label>
              <Input
                id="contact_phone"
                type="tel"
                {...register('contact_phone')}
                placeholder="+234 xxx xxx xxxx"
              />
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website_url" className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Website URL
            </Label>
            <Input
              id="website_url"
              type="url"
              {...register('website_url')}
              placeholder="https://www.organisation.org"
              className={errors.website_url ? 'border-destructive' : ''}
            />
            {errors.website_url && (
              <p className="text-sm text-destructive">{errors.website_url.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Address Information
          </CardTitle>
          <CardDescription>
            Provide your organisation&apos;s physical address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Full Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Street Address
            </Label>
            <Input
              id="address"
              {...register('address')}
              placeholder="Enter your organisation's address"
            />
          </div>

          {/* Region, State, City */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region" className="text-sm font-medium">
                Region
              </Label>
              <Input
                id="region"
                {...register('region')}
                placeholder="e.g. West Africa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state_province" className="text-sm font-medium">
                State/Province
              </Label>
              <Input
                id="state_province"
                {...register('state_province')}
                placeholder="e.g. Lagos State"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City
              </Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="e.g. Lagos"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            Languages & Social Media
          </CardTitle>
          <CardDescription>
            Select languages your organisation operates in and add social media links.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Languages */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Languages Spoken</Label>
            <div className="flex flex-wrap gap-4">
              {LANGUAGES.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={`language-${language}`}
                    checked={selectedLanguages.includes(language)}
                    onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                  />
                  <Label htmlFor={`language-${language}`} className="text-sm">
                    {language}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Social Media Links (Optional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook" className="text-xs text-muted-foreground">
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  {...register('social_links.facebook')}
                  placeholder="https://facebook.com/yourorg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter" className="text-xs text-muted-foreground">
                  Twitter/X
                </Label>
                <Input
                  id="twitter"
                  {...register('social_links.twitter')}
                  placeholder="https://twitter.com/yourorg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-xs text-muted-foreground">
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  {...register('social_links.linkedin')}
                  placeholder="https://linkedin.com/company/yourorg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-xs text-muted-foreground">
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  {...register('social_links.instagram')}
                  placeholder="https://instagram.com/yourorg"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrev}
          disabled={isFirstStep}
        >
          Previous
        </Button>
        <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
          Continue
        </Button>
      </div>
    </div>
  )
} 