'use client';

import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, X, Save, Calendar, MapPin, Users, Trash2, Clock } from 'lucide-react';
import { ProjectEventFormData, ProjectFullFormData, EVENT_TYPES, EVENT_STATUS_OPTIONS, transformProjectEventDataToInsert } from './project-form-schemas';
import { useMutation } from '@tanstack/react-query';
import { updateProjectEvents } from '@/lib/data/projects';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ProjectEventsSectionProps {
  onSave?: (data: ProjectEventFormData[]) => Promise<void>;
  isEditing?: boolean;
  projectId: string;
}

export function ProjectEventsSection({ projectId }: ProjectEventsSectionProps) {
  const {
    control,
    getValues,
    register,
    setValue,
    watch,
  } = useFormContext<ProjectFullFormData>();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'events',
  });
  console.log(fields, "💸 fields")

  const [expandedEvents, setExpandedEvents] = useState<{ [key: number]: boolean }>({});

  const saveEventsMutation = useMutation({
    mutationFn: async (data: ProjectEventFormData[]) => {
      const dataToInsert = data.map((event) => transformProjectEventDataToInsert(event, projectId));
      await updateProjectEvents(projectId, dataToInsert);
    },
    onSuccess: () => {
      toast.success('Events saved successfully');
      // console.log('Events saved successfully');
    },
    onError: (error) => {
      toast.error('Error saving events:', {
        description: error.message,
      });
      console.error('Error saving events:', error);
    },
  });

  const handleSave = async () => {
    const eventsData = getValues('events') || [];
    await saveEventsMutation.mutateAsync(eventsData);
  };

  const addEvent = () => {
    const newEvent: ProjectEventFormData = {
      title: '',
      description: '',
      event_type: '',
      event_date: '',
      event_end_date: '',
      event_location: '',
      is_virtual: false,
      meeting_link: '',
      registration_link: '',
      registration_deadline: '',
      max_participants: undefined,
      current_participants: 0,
      event_status: 'scheduled',
      attachments: [],
      contact_person: '',
      contact_email: '',
      tags: [],
    };
    append(newEvent);
    setExpandedEvents(prev => ({ ...prev, [fields.length]: true }));
  };

  const toggleExpanded = (index: number) => {
    setExpandedEvents(prev => ({ ...prev, [index]: !!!prev[index] }));
  };

  const addTag = (index: number, tag: string) => {
    const event = fields[index];
    const currentTags = event.tags || [];
    if (tag.trim() && !currentTags.includes(tag.trim())) {
      update(index, { ...event, tags: [...currentTags, tag.trim()] });
    }
  };

  const removeTag = (index: number, tagToRemove: string) => {
    const event = fields[index];
    const currentTags = event.tags || [];
    update(index, { ...event, tags: currentTags.filter(tag => tag !== tagToRemove) });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Project Events
          
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={saveEventsMutation.isPending}
              className="ml-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {saveEventsMutation.isPending ? 'Saving...' : 'Save Section'}
            </Button>
        
        </CardTitle>
        <CardDescription>
          Manage events, workshops, meetings, and other activities related to your project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No events scheduled</h3>
            <p className="text-muted-foreground mb-4">
              Add workshops, meetings, launches, or other project-related events
            </p>
            <Button onClick={addEvent}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="border-muted">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4" />
                        <h4 className="font-medium">
                          {(watch(`events.${index}.title`)) || `Event ${index + 1}`}
                        </h4>
                        {watch(`events.${index}.event_status`) && (
                          <Badge variant={watch(`events.${index}.event_status`) === 'completed' ? 'default' : 'secondary'}>
                            {EVENT_STATUS_OPTIONS.find(s => s.value === watch(`events.${index}.event_status`))?.label || watch(`events.${index}.event_status`)}
                          </Badge>
                        )}
                        {watch(`events.${index}.is_virtual`) && (
                          <Badge variant="outline">Virtual</Badge>
                        )}
                      </div>
                      {field.event_date && (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDateTime(field.event_date)}
                            {field.event_end_date && ` - ${formatDateTime(field.event_end_date)}`}
                          </div>
                          {field.event_location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {field.event_location}
                            </div>
                          )}
                          {field.max_participants && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {field.current_participants || 0}/{field.max_participants}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(index)}
                      >
                        {expandedEvents[index] ? 'Collapse' : 'Expand'}
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

                {expandedEvents[index] && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`event-title-${index}`}>Event Title *</Label>
                          <Input
                            id={`event-title-${index}`}
                            {...register(`events.${index}.title`)}
                            
                            placeholder="Enter event title"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`event-type-${index}`}>Event Type</Label>
                          <Select
                           
                            value={watch(`events.${index}.event_type`)}
                            onValueChange={(value) => setValue(`events.${index}.event_type`, value, { shouldValidate: true })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                              {EVENT_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`event-status-${index}`}>Status</Label>
                          <Select
                        
                            value={watch(`events.${index}.event_status`)}
                            onValueChange={(value) => setValue(`events.${index}.event_status`, value, { shouldValidate: true })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {EVENT_STATUS_OPTIONS.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2 pt-6">
                          <Checkbox
                            id={`event-virtual-${index}`}
                            checked={watch(`events.${index}.is_virtual`)}
                            onCheckedChange={(checked) => setValue(`events.${index}.is_virtual`, !!checked, { shouldValidate: true })}
                          />
                          <Label htmlFor={`event-virtual-${index}`} className="text-sm">
                            Virtual Event
                          </Label>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <Label htmlFor={`event-description-${index}`}>Description</Label>
                        <Textarea
                          
                          id={`event-description-${index}`}
                          {...register(`events.${index}.description`)}
                          defaultValue={field.description}
                          placeholder="Describe the event"
                          rows={3}
                        />
                      </div>

                      {/* Date and Time */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`event-date-${index}`}>Start Date & Time *</Label>
                          <Input
                            id={`event-date-${index}`}
                            type="datetime-local"
                            {...register(`events.${index}.event_date`, {
                              setValueAs: (value) => {
                                if(!value) return undefined;
                                try {
                                const correctvalue = format(new Date(value), "yyyy-MM-dd'T'HH:mm");
                                return correctvalue;
                                } catch (error) {
                                  console.error('Error formatting date:', value, error);
                                  return undefined;
                                }
                              },
                            })}
                            
                          />
                        </div>

                        <div>
                          <Label htmlFor={`event-end-date-${index}`}>End Date & Time</Label>
                          <Input
                            id={`event-end-date-${index}`}
                            type="datetime-local"
                            {...register(`events.${index}.event_end_date`, {
                              setValueAs: (value) => {
                                if(!value) return undefined;
                                try {
                                const correctvalue = format(new Date(value), "yyyy-MM-dd'T'HH:mm");
                                return correctvalue;
                                } catch (error) {
                                  console.error('Error formatting date:', value, error);
                                  return undefined;
                                }
                              },
                            })}
                            
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`event-location-${index}`}>Location</Label>
                          <Input
                            id={`event-location-${index}`}
                            {...register(`events.${index}.event_location`)}
                            
                            placeholder={field.is_virtual ? "Online platform" : "Physical address"}
                          />
                        </div>

                        {field.is_virtual && (
                          <div>
                            <Label htmlFor={`event-meeting-link-${index}`}>Meeting Link</Label>
                            <Input
                              id={`event-meeting-link-${index}`}
                              type="url"
                              {...register(`events.${index}.meeting_link`)}
                              
                              placeholder="https://zoom.us/j/..."
                            />
                          </div>
                        )}
                      </div>

                      {/* Registration */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`event-registration-link-${index}`}>Registration Link</Label>
                          <Input
                            id={`event-registration-link-${index}`}
                            type="url"
                            {...register(`events.${index}.registration_link`)}
                            
                            placeholder="https://eventbrite.com/..."
                          />
                        </div>

                        <div>
                          <Label htmlFor={`event-registration-deadline-${index}`}>Registration Deadline</Label>
                          <Input
                            id={`event-registration-deadline-${index}`}
                            type="datetime-local"
                            {...register(`events.${index}.registration_deadline`, {
                              setValueAs: (value) => {
                                if(!value) return undefined;
                                  try {
                                const correctvalue = format(new Date(value), "yyyy-MM-dd'T'HH:mm");
                                return correctvalue;
                                } catch (error) {
                                  console.error('Error formatting date:', value, error);
                                  return undefined;
                                }
                              },
                            })}
                            
                          />
                        </div>

                        <div>
                          <Label htmlFor={`event-max-participants-${index}`}>Max Participants</Label>
                          <Input
                            id={`event-max-participants-${index}`}
                            type="number"
                            {...register(`events.${index}.max_participants`, {
                              valueAsNumber: true,
                              setValueAs: (value) => {
                                const num = Number(value)
                                return value === '' || isNaN(num) ? undefined : num
                              }
                            })}
                            
                            placeholder="Unlimited"
                            min="1"
                          />
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`event-contact-person-${index}`}>Contact Person</Label>
                          <Input
                            id={`event-contact-person-${index}`}
                            {...register(`events.${index}.contact_person`)}
                            
                            placeholder="Event organizer name"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`event-contact-email-${index}`}>Contact Email</Label>
                          <Input
                            id={`event-contact-email-${index}`}
                            type="email"
                            {...register(`events.${index}.contact_email`)}
                            
                            placeholder="organizer@example.com"
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(field.tags || []).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => removeTag(index, tag)}
                              />
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a tag"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const target = e.target as HTMLInputElement;
                                addTag(index, target.value);
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
                                addTag(index, input.value);
                                input.value = '';
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addEvent}
              className="w-full"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Another Event
            </Button>
          </div>
        )}

        {saveEventsMutation.error && (
          <div className="text-sm text-red-600 mt-2">
            Error: {saveEventsMutation.error.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
