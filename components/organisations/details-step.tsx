'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Target, Users, Award, Handshake } from 'lucide-react'
import { 
  FormStepProps, 
  OrganisationFormData, 
  THEMATIC_AREAS,
  detailsSchema
} from './types'

export function DetailsStep({ onNext, onPrev, currentStep, totalSteps }: FormStepProps) {
  const { 
    register, 
    formState: { errors }, 
    setValue, 
    watch,
    trigger 
  } = useFormContext<OrganisationFormData>()

  const handleNext = async () => {
    const detailsFields = Object.keys(detailsSchema.shape) as (keyof OrganisationFormData)[]
    const isValid = await trigger(detailsFields)
    if (isValid) {
      onNext()
    }
  }

  const selectedThematicAreas = watch('thematic_focus') || []

  const handleThematicAreaChange = (area: string, checked: boolean) => {
    const current = selectedThematicAreas
    if (checked) {
      setValue('thematic_focus', [...current, area])
    } else {
      setValue('thematic_focus', current.filter(a => a !== area))
    }
  }

  // Dynamic arrays for partnerships and awards
  const partnerships = watch('partnerships') || []
  const awards = watch('awards_recognition') || []

  const addPartnership = () => {
    setValue('partnerships', [...partnerships, ''])
  }

  const removePartnership = (index: number) => {
    setValue('partnerships', partnerships.filter((_, i) => i !== index))
  }

  const addAward = () => {
    setValue('awards_recognition', [...awards, ''])
  }

  const removeAward = (index: number) => {
    setValue('awards_recognition', awards.filter((_, i) => i !== index))
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
            <h2 className="text-lg font-semibold">Organizational Details</h2>
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
            <Target className="h-5 w-5 text-primary" />
            Mission & Vision
          </CardTitle>
          <CardDescription>
            Describe your organisation&apos;s purpose and goals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mission */}
          <div className="space-y-2">
            <Label htmlFor="mission" className="text-sm font-medium">
              Mission Statement
            </Label>
            <Textarea
              id="mission"
              {...register('mission')}
              placeholder="Describe your organisation's mission and purpose..."
              rows={4}
              className={errors.mission ? 'border-destructive' : ''}
            />
            {errors.mission && (
              <p className="text-sm text-destructive">{errors.mission.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {watch('mission')?.length || 0}/500 characters
            </p>
          </div>

          {/* Vision */}
          <div className="space-y-2">
            <Label htmlFor="vision" className="text-sm font-medium">
              Vision Statement
            </Label>
            <Textarea
              id="vision"
              {...register('vision')}
              placeholder="Describe your organisation's vision for the future..."
              rows={4}
              className={errors.vision ? 'border-destructive' : ''}
            />
            {errors.vision && (
              <p className="text-sm text-destructive">{errors.vision.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {watch('vision')?.length || 0}/500 characters
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Thematic Focus Areas
          </CardTitle>
          <CardDescription>
            Select the main areas your organisation works in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {THEMATIC_AREAS.map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox
                  id={`thematic-${area}`}
                  checked={selectedThematicAreas.includes(area)}
                  onCheckedChange={(checked) => handleThematicAreaChange(area, checked as boolean)}
                />
                <Label htmlFor={`thematic-${area}`} className="text-sm">
                  {area}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Team & Resources
          </CardTitle>
          <CardDescription>
            Information about your team size and human resources.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staff_count" className="text-sm font-medium">
                Number of Staff
              </Label>
              <Input
                id="staff_count"
                type="number"
                {...register('staff_count', { valueAsNumber: true })}
                placeholder="e.g. 15"
                min="0"
              />
              {errors.staff_count && (
                <p className="text-sm text-destructive">{errors.staff_count.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="volunteer_count" className="text-sm font-medium">
                Number of Volunteers
              </Label>
              <Input
                id="volunteer_count"
                type="number"
                {...register('volunteer_count', { valueAsNumber: true })}
                placeholder="e.g. 50"
                min="0"
              />
              {errors.volunteer_count && (
                <p className="text-sm text-destructive">{errors.volunteer_count.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="h-5 w-5 text-primary" />
            Partnerships
          </CardTitle>
          <CardDescription>
            List key partnerships and collaborations (optional).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {partnerships.map((_, index) => (
            <div key={index} className="flex gap-2">
              <Input
                {...register(`partnerships.${index}`)}
                placeholder="Enter partnership name"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removePartnership(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addPartnership}
            className="w-full"
          >
            Add Partnership
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Awards & Recognition
          </CardTitle>
          <CardDescription>
            List any awards or recognition received (optional).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {awards.map((_, index) => (
            <div key={index} className="flex gap-2">
              <Input
                {...register(`awards_recognition.${index}`)}
                placeholder="Enter award or recognition"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeAward(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addAward}
            className="w-full"
          >
            Add Award
          </Button>
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
        <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
          Continue
        </Button>
      </div>
    </div>
  )
} 