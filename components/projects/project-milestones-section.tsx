'use client';

import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PlusIcon, X, Save, Target, Calendar, CheckCircle, Clock, AlertCircle, XCircle, Trash2 } from 'lucide-react';
import { ProjectMilestoneFormData, ProjectFullFormData, MILESTONE_STATUS_OPTIONS, transformProjectMilestoneDataToInsert  } from './project-form-schemas';
import { useMutation } from '@tanstack/react-query';
import { updateProjectMilestones } from '@/lib/data/projects';
import { toast } from 'sonner';

interface ProjectMilestonesSectionProps {
  onSave?: (data: ProjectMilestoneFormData[]) => Promise<void>;
  isEditing?: boolean;
  projectId: string;
  userId: string;
}

export function ProjectMilestonesSection({ projectId, userId }: ProjectMilestonesSectionProps) {
  const {
    control,
    getValues,
    register,
    watch,
  } = useFormContext<ProjectFullFormData>();

  const {  append, remove, update } = useFieldArray({
    control,
    name: 'milestones',
  });

  const fields = watch('milestones') || [];

  const [expandedMilestones, setExpandedMilestones] = useState<{ [key: number]: boolean }>({});

  const saveMilestonesMutation = useMutation({
    mutationFn: async (data: ProjectMilestoneFormData[]) => {
      const dataToInsert = data.map((milestone) => transformProjectMilestoneDataToInsert(milestone, userId, projectId));
      await updateProjectMilestones(projectId, dataToInsert);
    },
    onSuccess: () => {
      console.log('Milestones saved successfully');
      toast.success('Milestones saved successfully');
    },
    onError: (error) => {
      console.error('Error saving milestones:', error);
    },
  });

  const handleSave = async () => {
    const milestonesData = getValues('milestones') || [];
    await saveMilestonesMutation.mutateAsync(milestonesData);
  };

  const addMilestone = () => {
    const newMilestone: ProjectMilestoneFormData = {
      project_id: projectId || '',
      title: '',
      description: '',
      due_date: '',
      completion_date: '',
      status: 'planned',
      progress_percentage: 0,
      deliverables: [],
      notes: '',
      evidence_urls: [],
      sort_order: fields.length,
    };
    append(newMilestone);
    setExpandedMilestones(prev => ({ ...prev, [fields.length]: true }));
  };

  const toggleExpanded = (index: number) => {
    setExpandedMilestones(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const addDeliverable = (index: number, deliverable: string) => {
    const milestone = fields[index];
    const currentDeliverables = milestone.deliverables || [];
    if (deliverable.trim() && !currentDeliverables.includes(deliverable.trim())) {
      update(index, { ...milestone, deliverables: [...currentDeliverables, deliverable.trim()] });
    }
  };

  const removeDeliverable = (index: number, deliverableToRemove: string) => {
    const milestone = fields[index];
    const currentDeliverables = milestone.deliverables || [];
    update(index, { ...milestone, deliverables: currentDeliverables.filter(d => d !== deliverableToRemove) });
  };

  const addEvidenceUrl = (index: number, url: string) => {
    const milestone = fields[index];
    const currentUrls = milestone.evidence_urls || [];
    if (url.trim() && !currentUrls.includes(url.trim())) {
      update(index, { ...milestone, evidence_urls: [...currentUrls, url.trim()] });
    }
  };

  const removeEvidenceUrl = (index: number, urlToRemove: string) => {
    const milestone = fields[index];
    const currentUrls = milestone.evidence_urls || [];
    update(index, { ...milestone, evidence_urls: currentUrls.filter(url => url !== urlToRemove) });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <Target className="h-4 w-4" />;
      case 'achieved':
        return <CheckCircle className="h-4 w-4" />;
      case 'delayed':
        return <AlertCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'secondary';
      case 'in_progress':
        return 'default';
      case 'achieved':
        return 'default';
      case 'delayed':
        return 'destructive';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (!dueDate || status === 'achieved' || status === 'cancelled') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5" />
          Project Milestones
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={saveMilestonesMutation.isPending}
              className="ml-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {saveMilestonesMutation.isPending ? 'Saving...' : 'Save Section'}
            </Button>
        </CardTitle>
        <CardDescription>
          Track key milestones, deliverables, and progress markers for your project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No milestones defined</h3>
            <p className="text-muted-foreground mb-4">
              Add key milestones to track progress and deliverables for your project
            </p>
            <Button onClick={addMilestone}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={`${field.title}-${index}`} className="border-muted">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(field.status)}
                        <h4 className="font-medium">
                          {field.title || `Milestone ${index + 1}`}
                        </h4>
                        <Badge variant={getStatusColor(field.status)}>
                          {MILESTONE_STATUS_OPTIONS.find(s => s.value === field.status)?.label || field.status}
                        </Badge>
                        {isOverdue(field.due_date || '', field.status) && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {field.due_date && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due: {formatDate(field.due_date)}
                            </div>
                            {field.completion_date && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Completed: {formatDate(field.completion_date)}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Progress value={field.progress_percentage} className="flex-1 max-w-[200px]" />
                          <span className="text-sm text-muted-foreground min-w-[3rem]">
                            {field.progress_percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(index)}
                      >
                        {expandedMilestones[index] ? 'Collapse' : 'Expand'}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {expandedMilestones[index] && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`milestone-title-${index}`}>Milestone Title *</Label>
                          <Input
                            id={`milestone-title-${index}`}
                            {...register(`milestones.${index}.title`)}
                            placeholder="Enter milestone title"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`milestone-status-${index}`}>Status</Label>
                          <Select
                            defaultValue={field.status}
                            {...register(`milestones.${index}.status`)}
                            onValueChange={(value) => {
                              // Auto-update progress when status changes
                              if (value === 'achieved') {
                                register(`milestones.${index}.progress_percentage`).onChange({ target: { value: 100 } });
                                register(`milestones.${index}.completion_date`).onChange({ target: { value: new Date().toISOString().split('T')[0] } });
                              } else if (value === 'planned') {
                                register(`milestones.${index}.progress_percentage`).onChange({ target: { value: 0 } });
                                register(`milestones.${index}.completion_date`).onChange({ target: { value: '' } });
                              }
                              register(`milestones.${index}.status`).onChange({ target: { value: value as ProjectMilestoneFormData['status'] } });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {MILESTONE_STATUS_OPTIONS.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`milestone-due-date-${index}`}>Due Date</Label>
                          <Input
                            id={`milestone-due-date-${index}`}
                            type="date"
                            {...register(`milestones.${index}.due_date`)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`milestone-completion-date-${index}`}>Completion Date</Label>
                          <Input
                            id={`milestone-completion-date-${index}`}
                            type="date"
                            {...register(`milestones.${index}.completion_date`)}
                            
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <Label htmlFor={`milestone-description-${index}`}>Description</Label>
                        <Textarea
                          id={`milestone-description-${index}`}
                          {...register(`milestones.${index}.description`)}
                          placeholder="Describe this milestone"
                          rows={3}
                        />
                      </div>

                      {/* Progress */}
                      <div>
                        <Label htmlFor={`milestone-progress-${index}`}>Progress Percentage</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id={`milestone-progress-${index}`}
                            type="number"
                            min="0"
                            max="100"
                            {...register(`milestones.${index}.progress_percentage`)}
                            
                            className="w-24"
                          />
                          <Progress value={field.progress_percentage} className="flex-1" />
                          <span className="text-sm text-muted-foreground min-w-[3rem]">
                            {field.progress_percentage}%
                          </span>
                        </div>
                      </div>

                      {/* Deliverables */}
                      <div>
                        <Label>Deliverables</Label>
                        <div className="space-y-2">
                          {(field.deliverables || []).map((deliverable, deliverableIndex) => (
                            <div key={deliverableIndex} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="flex-1">{deliverable}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDeliverable(index, deliverable)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a deliverable"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const target = e.target as HTMLInputElement;
                                  addDeliverable(index, target.value);
                                  target.value = '';
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                                if (input?.value) {
                                  addDeliverable(index, input.value);
                                  input.value = '';
                                }
                              }}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Evidence URLs */}
                      <div>
                        <Label>Evidence URLs</Label>
                        <div className="space-y-2">
                          {(field.evidence_urls || []).map((url, urlIndex) => (
                            <div key={urlIndex} className="flex items-center gap-2">
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-blue-600 hover:underline truncate"
                              >
                                {url}
                              </a>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEvidenceUrl(index, url)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <Input
                              type="url"
                              placeholder="Add evidence URL"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const target = e.target as HTMLInputElement;
                                  addEvidenceUrl(index, target.value);
                                  target.value = '';
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                                if (input?.value) {
                                  addEvidenceUrl(index, input.value);
                                  input.value = '';
                                }
                              }}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <Label htmlFor={`milestone-notes-${index}`}>Notes</Label>
                        <Textarea
                          id={`milestone-notes-${index}`}
                          value={field.notes || ''}
                          onChange={(e) => {
                            update(index, { ...field, notes: e.target.value });
                          }}
                          placeholder="Additional notes about this milestone"
                          rows={3}
                        />
                      </div>

                      {/* Sort Order */}
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`milestone-sort-${index}`} className="text-sm">
                          Sort Order:
                        </Label>
                        <Input
                          id={`milestone-sort-${index}`}
                          type="number"
                          value={field.sort_order}
                          onChange={(e) => {
                            update(index, { ...field, sort_order: parseInt(e.target.value) || 0 });
                          }}
                          className="w-20"
                          min="0"
                        />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addMilestone}
              className="w-full"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Another Milestone
            </Button>
          </div>
        )}

        {saveMilestonesMutation.error && (
          <div className="text-sm text-red-600 mt-2">
            Error: {saveMilestonesMutation.error.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
