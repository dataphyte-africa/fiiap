'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Building2, MapPin, Calendar, FileText } from 'lucide-react'
import { 
  FormStepProps, 
  OrganisationFormData, 
  ORGANISATION_TYPES, 
  ORGANISATION_SIZES, 
  COUNTRIES,
  basicInfoSchema
} from './types'
import { Database } from '@/types/db'

export function BasicInfoStep({ onNext, currentStep, totalSteps }: FormStepProps) {
  const { 
    register, 
    formState: { errors }, 
    setValue, 
    watch, 
    trigger 
  } = useFormContext<OrganisationFormData>()

  const handleNext = async () => {
    const basicInfoFields = Object.keys(basicInfoSchema.shape) as (keyof OrganisationFormData)[]
    const isValid = await trigger(basicInfoFields)
    if (isValid) {
      onNext()
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
            <h2 className="text-lg font-semibold">Basic Information</h2>
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
            <Building2 className="h-5 w-5 text-primary" />
            Organisation Details
          </CardTitle>
          <CardDescription>
            Tell us about your organisation. This information will be publicly visible on your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Organisation Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Organisation Name *
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter your organisation name"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Organisation Type and Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Organisation Type *
              </Label>
              <Select
                onValueChange={(value) => setValue('type', value as Database['public']['Enums']['organisation_type_enum'], { shouldValidate: true })}
                value={watch('type')}
              >
                <SelectTrigger className={`w-full ${errors.type ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select organisation type" />
                </SelectTrigger>
                <SelectContent>
                  {ORGANISATION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="size" className="text-sm font-medium">
                Organisation Size *
              </Label>
              <Select
                onValueChange={(value) => setValue('size', value as Database['public']['Enums']['organisation_size_enum'], { shouldValidate: true })}
                value={watch('size')}
                
              >
                <SelectTrigger className={`w-full ${errors.size ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select organisation size" />
                </SelectTrigger>
                <SelectContent>
                  {ORGANISATION_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.size && (
                <p className="text-sm text-destructive">{errors.size.message}</p>
              )}
            </div>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Country *
            </Label>
            <Select
              onValueChange={(value) => setValue('country', value as Database['public']['Enums']['country_enum'], { shouldValidate: true })}
              value={watch('country')}
            >
              <SelectTrigger className={`w-full ${errors.country ? 'border-destructive' : ''}`}>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country.message}</p>
            )}
          </div>

          {/* Registration Number and Establishment Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registration_number" className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Registration Number
              </Label>
              <Input
                id="registration_number"
                {...register('registration_number')}
                placeholder="Enter registration number (optional)"
              />
              <p className="text-xs text-muted-foreground">
                Official registration number if available
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="establishment_year" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Establishment Year
              </Label>
              <Input
                id="establishment_year"
                type="number"
                {...register('establishment_year', { valueAsNumber: true })}
                placeholder="e.g. 2010"
                min="1900"
                max={new Date().getFullYear()}
              />
              {errors.establishment_year && (
                <p className="text-sm text-destructive">{errors.establishment_year.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
          Continue
        </Button>
      </div>
    </div>
  )
} 