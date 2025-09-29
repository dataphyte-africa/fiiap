'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Target, Users, Award, Handshake, MapPin, Briefcase, Network, Laptop } from 'lucide-react'
import { 
  FormStepProps, 
  OrganisationFormData, 
  THEMATIC_AREAS,
  TARGET_POPULATIONS,
  WORK_METHODS,
  OPERATIONAL_LEVELS,
  DIGITAL_TOOL_CATEGORIES,
  DigitalTool,
  detailsSchema
} from './types'
import { Database } from '@/types/db'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
  const selectedTargetPopulations = watch('target_populations') || []
  const selectedWorkMethods = watch('primary_work_methods') || []
  const selectedOperationalLevels = watch('operational_levels') || []

  const handleThematicAreaChange = (area: string, checked: boolean) => {
    const current = selectedThematicAreas
    if (checked) {
      setValue('thematic_focus', [...current, area])
    } else {
      setValue('thematic_focus', current.filter(a => a !== area))
    }
  }

  const handleTargetPopulationChange = (population: string, checked: boolean) => {
    const current = selectedTargetPopulations
    if (checked) {
      setValue('target_populations', [...current, population] as Database['public']['Enums']['target_population_enum'][])
    } else {
      setValue('target_populations', current.filter(p => p !== population) as Database['public']['Enums']['target_population_enum'][])
    }
  }

  const handleWorkMethodChange = (method: string, checked: boolean) => {
    const current = selectedWorkMethods
    if (checked) {
      setValue('primary_work_methods', [...current, method] as Database['public']['Enums']['work_method_enum'][])
    } else {
      setValue('primary_work_methods', current.filter(m => m !== method) as Database['public']['Enums']['work_method_enum'][])
    }
  }

  const handleOperationalLevelChange = (level: string, checked: boolean) => {
    const current = selectedOperationalLevels
    if (checked) {
      setValue('operational_levels', [...current, level])
    } else {
      setValue('operational_levels', current.filter(l => l !== level))
    }
  }

  // Dynamic arrays for partnerships, awards, networks, and digital tools
  const partnerships = watch('partnerships') || []
  const awards = watch('awards_recognition') || []
  const networks = watch('network_memberships') || []
  const digitalTools = watch('digital_tools') || []

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

  const addNetwork = () => {
    setValue('network_memberships', [...networks, ''])
  }

  const removeNetwork = (index: number) => {
    setValue('network_memberships', networks.filter((_, i) => i !== index))
  }

  const addDigitalTool = () => {
    setValue('digital_tools', [...digitalTools, { name: '', category: '', description: '', url: '' }])
  }

  const removeDigitalTool = (index: number) => {
    setValue('digital_tools', digitalTools.filter((_, i) => i !== index))
  }

  const updateDigitalTool = (index: number, field: keyof DigitalTool, value: string) => {
    const updatedTools = [...digitalTools]
    updatedTools[index] = { ...updatedTools[index], [field]: value }
    setValue('digital_tools', updatedTools)
  }

  // Helper function to format enum values for display
  const formatEnumValue = (value: string) => {
    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
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
            Target Populations
          </CardTitle>
          <CardDescription>
            Select the groups of people your organisation primarily serves.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
            {TARGET_POPULATIONS.map((population) => (
              <div key={population} className="flex items-center space-x-2">
                <Checkbox
                  id={`target-${population}`}
                  checked={selectedTargetPopulations.includes(population)}
                  onCheckedChange={(checked) => handleTargetPopulationChange(population, checked as boolean)}
                />
                <Label htmlFor={`target-${population}`} className="text-sm">
                  {formatEnumValue(population)}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Primary Work Methods
          </CardTitle>
          <CardDescription>
            Select the main methods your organisation uses to achieve its goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {WORK_METHODS.map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <Checkbox
                  id={`method-${method}`}
                  checked={selectedWorkMethods.includes(method)}
                  onCheckedChange={(checked) => handleWorkMethodChange(method, checked as boolean)}
                />
                <Label htmlFor={`method-${method}`} className="text-sm">
                  {formatEnumValue(method)}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Operational Levels
          </CardTitle>
          <CardDescription>
            Select the levels at which your organisation operates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {OPERATIONAL_LEVELS.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={`level-${level}`}
                  checked={selectedOperationalLevels.includes(level)}
                  onCheckedChange={(checked) => handleOperationalLevelChange(level, checked as boolean)}
                />
                <Label htmlFor={`level-${level}`} className="text-sm">
                  {level}
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
                {...register('staff_count', { 
                  setValueAs: (value) => {
                    const num = Number(value)
                    return value === '' || isNaN(num) ? undefined : num
                  }
                })}
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
                {...register('volunteer_count', { 
                  setValueAs: (value) => {
                    const num = Number(value)
                    return value === '' || isNaN(num) ? undefined : num
                  }
                })}
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
            <Network className="h-5 w-5 text-primary" />
            Network Memberships
          </CardTitle>
          <CardDescription>
            List networks, coalitions, or umbrella organizations you belong to (optional).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {networks.map((_, index) => (
            <div key={index} className="flex gap-2">
              <Input
                {...register(`network_memberships.${index}`)}
                placeholder="Enter network or coalition name"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeNetwork(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addNetwork}
            className="w-full"
          >
            Add Network Membership
          </Button>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Laptop className="h-5 w-5 text-primary" />
            Digital Tools
          </CardTitle>
          <CardDescription>
            List digital tools your organisation uses (optional).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="has_digital_tools"
              checked={watch('has_digital_tools')}
              onCheckedChange={(checked) => setValue('has_digital_tools', checked as boolean)}
            />
            <Label htmlFor="has_digital_tools" className="text-sm">
              Does your organisation use digital tools?
            </Label>
          </div>

          {watch('has_digital_tools') && (
            <div className="space-y-4">
              {digitalTools.map((tool, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Digital Tool {index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeDigitalTool(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Tool Name</Label>
                      <Input
                        value={tool.name}
                        onChange={(e) => updateDigitalTool(index, 'name', e.target.value)}
                        placeholder="e.g. Google Analytics"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Category</Label>
                      <Select 
                        value={tool.category} 
                        onValueChange={(value) => updateDigitalTool(index, 'category', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {DIGITAL_TOOL_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">URL (Optional)</Label>
                      <Input
                        value={tool.url || ''}
                        onChange={(e) => updateDigitalTool(index, 'url', e.target.value)}
                        placeholder="e.g. https://analytics.google.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Description (Optional)</Label>
                      <Textarea
                        value={tool.description || ''}
                        onChange={(e) => updateDigitalTool(index, 'description', e.target.value)}
                        placeholder="Describe the purpose and functionality..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addDigitalTool}
                className="w-full"
              >
                Add Digital Tool
              </Button>
            </div>
          )}
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