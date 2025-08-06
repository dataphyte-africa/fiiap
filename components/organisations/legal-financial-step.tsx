'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Scale, DollarSign, Award } from 'lucide-react'
import { 
  FormStepProps, 
  OrganisationFormData,
  legalFinancialSchema
} from './types'

export function LegalFinancialStep({ onNext, onPrev, currentStep, totalSteps }: FormStepProps) {
  const { 
    register, 
    formState: { errors }, 
    setValue, 
    watch,
    trigger 
  } = useFormContext<OrganisationFormData>()

  const handleNext = async () => {
    const legalFinancialFields = Object.keys(legalFinancialSchema.shape) as (keyof OrganisationFormData)[]
    const isValid = await trigger(legalFinancialFields)
    if (isValid) {
      onNext()
    }
  }

  // Dynamic arrays for certifications
  const certifications = watch('certifications') || []

  const addCertification = () => {
    setValue('certifications', [...certifications, ''])
  }

  const removeCertification = (index: number) => {
    setValue('certifications', certifications.filter((_, i) => i !== index))
  }

  const taxExemptionStatus = watch('tax_exemption_status')

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
            {currentStep}
          </div>
          <div>
            <h2 className="text-lg font-semibold">Legal & Financial Information</h2>
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
            <Scale className="h-5 w-5 text-primary" />
            Legal Status
          </CardTitle>
          <CardDescription>
            Information about your organisation&apos;s legal standing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Legal Status */}
          <div className="space-y-2">
            <Label htmlFor="legal_status" className="text-sm font-medium">
              Legal Status
            </Label>
            <Input
              id="legal_status"
              {...register('legal_status')}
              placeholder="e.g. Registered Non-Profit, Incorporated Trust, etc."
            />
            <p className="text-xs text-muted-foreground">
              Describe your organisation&apos;s legal registration status
            </p>
          </div>

          {/* Tax Exemption Status */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tax Exemption</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tax_exemption_status"
                checked={taxExemptionStatus || false}
                onCheckedChange={(checked) => setValue('tax_exemption_status', checked as boolean)}
              />
              <Label htmlFor="tax_exemption_status" className="text-sm">
                Our organisation has tax-exempt status
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Check this if your organisation is exempt from paying taxes
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Certifications & Accreditations
          </CardTitle>
          <CardDescription>
            List any certifications or accreditations your organisation holds (optional).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {certifications.map((_, index) => (
            <div key={index} className="flex gap-2">
              <Input
                {...register(`certifications.${index}`)}
                placeholder="Enter certification or accreditation"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeCertification(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addCertification}
            className="w-full"
          >
            Add Certification
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Financial Information
          </CardTitle>
          <CardDescription>
            Optional financial information to help potential funders understand your scale.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="annual_budget" className="text-sm font-medium">
              Annual Budget (USD)
            </Label>
            <Input
              id="annual_budget"
              type="number"
              {...register('annual_budget', { valueAsNumber: true })}
              placeholder="e.g. 50000"
              min="0"
              step="1000"
            />
            {errors.annual_budget && (
              <p className="text-sm text-destructive">{errors.annual_budget.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              This information is optional and will help funders understand your organisation&apos;s scale
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>
            Any additional legal or financial information you&apos;d like to share.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Privacy Notice</h4>
            <p className="text-sm text-muted-foreground">
              All financial information provided is optional and will be kept confidential. 
              This information helps us better match your organisation with appropriate funding opportunities 
              and collaboration partners.
            </p>
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
        <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
          Continue
        </Button>
      </div>
    </div>
  )
} 