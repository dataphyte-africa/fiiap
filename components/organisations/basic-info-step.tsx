'use client'

import { useFormContext } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Building2, MapPin, Calendar, FileText, Globe, X } from 'lucide-react'
import { 
  FormStepProps, 
  OrganisationFormData, 
  ORGANISATION_TYPES, 
  ORGANISATION_SIZES, 
  COUNTRIES,
  basicInfoSchema,
  Country
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

  const [countries, setCountries] = useState<Country[]>([])
  const [loadingCountries, setLoadingCountries] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  
  const selectedOtherCountries = watch('other_countries') || []

  // Fetch countries from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true)
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name')
        const data: Country[] = await response.json()
        const sortedCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common))
        setCountries(sortedCountries)
      } catch (error) {
        console.error('Failed to fetch countries:', error)
      } finally {
        setLoadingCountries(false)
      }
    }

    fetchCountries()
  }, [])

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedOtherCountries.includes(country.name.common)
  )

  const handleCountrySelect = (countryName: string) => {
    const updatedCountries = [...selectedOtherCountries, countryName]
    setValue('other_countries', updatedCountries, { shouldValidate: true })
    setSearchTerm('')
    setShowCountryDropdown(false)
  }

  const handleCountryRemove = (countryName: string) => {
    const updatedCountries = selectedOtherCountries.filter(c => c !== countryName)
    setValue('other_countries', updatedCountries, { shouldValidate: true })
  }

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

          {/* Primary Country */}
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Primary Country *
            </Label>
            <Select
              onValueChange={(value) => setValue('country', value as Database['public']['Enums']['country_enum'], { shouldValidate: true })}
              value={watch('country')}
            >
              <SelectTrigger className={`w-full ${errors.country ? 'border-destructive' : ''}`}>
                <SelectValue placeholder="Select your primary country" />
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

          {/* Other Countries */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Other Countries of Operation
            </Label>
            <div className="space-y-2">
              {/* Selected countries display */}
              {selectedOtherCountries.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-md">
                  {selectedOtherCountries.map((country) => (
                    <div
                      key={country}
                      className="flex items-center gap-1 bg-background px-2 py-1 rounded-md text-sm border"
                    >
                      <span>{country}</span>
                      <button
                        type="button"
                        onClick={() => handleCountryRemove(country)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Country search input */}
              <div className="relative">
                <Input
                  placeholder="Search and select additional countries..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowCountryDropdown(true)
                  }}
                  onFocus={() => setShowCountryDropdown(true)}
                  disabled={loadingCountries}
                />
                
                {/* Dropdown with country options */}
                {showCountryDropdown && searchTerm && (
                  <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {loadingCountries ? (
                      <div className="p-3 text-sm text-muted-foreground">Loading countries...</div>
                    ) : filteredCountries.length > 0 ? (
                      filteredCountries.slice(0, 10).map((country) => (
                        <button
                          key={country.name.common}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                          onClick={() => handleCountrySelect(country.name.common)}
                        >
                          {country.name.common}
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-muted-foreground">No countries found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Select additional countries where your organisation operates (optional)
            </p>
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