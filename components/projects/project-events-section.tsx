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
import { ProjectEventFormData, ProjectFullFormData, EVENT_TYPES, EVENT_STATUS_OPTIONS } from './project-form-schemas';
import { useMutation } from '@tanstack/react-query';

interface ProjectEventsSectionProps {
  onSave?: (data: ProjectEventFormData[]) => Promise<void>;
  isEditing?: boolean;
  projectId?: string;
}

export function ProjectEventsSection({ onSave, projectId }: ProjectEventsSectionProps) {
  const {
    control,
    getValues,
  } = useFormContext<ProjectFullFormData>();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'events',
  });

  const [expandedEvents, setExpandedEvents] = useState<{ [key: number]: boolean }>({});

  const saveEventsMutation = useMutation({
    mutationFn: async (data: ProjectEventFormData[]) => {
      if (onSave) {
        await onSave(data);
      }
    },
    onSuccess: () => {
      console.log('Events saved successfully');
    },
    onError: (error) => {
      console.error('Error saving events:', error);
    },
  });

  const handleSave = async () => {
    const eventsData = getValues('events') || [];
    await saveEventsMutation.mutateAsync(eventsData);
  };

  const addEvent = () => {
    const newEvent: ProjectEventFormData = {
      project_id: projectId || '',
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
    setExpandedEvents(prev => ({ ...prev, [index]: !prev[index] }));
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
          {onSave && (
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
          )}
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
                          {field.title || `Event ${index + 1}`}
                        </h4>
                        {field.event_status && (
                          <Badge variant={field.event_status === 'completed' ? 'default' : 'secondary'}>
                            {EVENT_STATUS_OPTIONS.find(s => s.value === field.event_status)?.label || field.event_status}
                          </Badge>
                        )}
                        {field.is_virtual && (
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
                            value={field.title}
                            onChange={(e) => {
                              update(index, { ...field, title: e.target.value });
                            }}
                            placeholder="Enter event title"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`event-type-${index}`}>Event Type</Label>
                          <Select
                            value={field.event_type || ''}
                            onValueChange={(value) => {
                              update(index, { ...field, event_type: value });
                            }}
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
                            value={field.event_status}
                            onValueChange={(value) => {
                              update(index, { ...field, event_status: value });
                            }}
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
                            checked={field.is_virtual}
                            onCheckedChange={(checked) => {
                              update(index, { ...field, is_virtual: !!checked });
                            }}
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
                          value={field.description || ''}
                          onChange={(e) => {
                            update(index, { ...field, description: e.target.value });
                          }}
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
                            value={field.event_date}
                            onChange={(e) => {
                              update(index, { ...field, event_date: e.target.value });
                            }}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`event-end-date-${index}`}>End Date & Time</Label>
                          <Input
                            id={`event-end-date-${index}`}
                            type="datetime-local"
                            value={field.event_end_date || ''}
                            onChange={(e) => {
                              update(index, { ...field, event_end_date: e.target.value });
                            }}
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`event-location-${index}`}>Location</Label>
                          <Input
                            id={`event-location-${index}`}
                            value={field.event_location || ''}
                            onChange={(e) => {
                              update(index, { ...field, event_location: e.target.value });
                            }}
                            placeholder={field.is_virtual ? "Online platform" : "Physical address"}
                          />
                        </div>

                        {field.is_virtual && (
                          <div>
                            <Label htmlFor={`event-meeting-link-${index}`}>Meeting Link</Label>
                            <Input
                              id={`event-meeting-link-${index}`}
                              type="url"
                              value={field.meeting_link || ''}
                              onChange={(e) => {
                                update(index, { ...field, meeting_link: e.target.value });
                              }}
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
                            value={field.registration_link || ''}
                            onChange={(e) => {
                              update(index, { ...field, registration_link: e.target.value });
                            }}
                            placeholder="https://eventbrite.com/..."
                          />
                        </div>

                        <div>
                          <Label htmlFor={`event-registration-deadline-${index}`}>Registration Deadline</Label>
                          <Input
                            id={`event-registration-deadline-${index}`}
                            type="datetime-local"
                            value={field.registration_deadline || ''}
                            onChange={(e) => {
                              update(index, { ...field, registration_deadline: e.target.value });
                            }}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`event-max-participants-${index}`}>Max Participants</Label>
                          <Input
                            id={`event-max-participants-${index}`}
                            type="number"
                            value={field.max_participants || ''}
                            onChange={(e) => {
                              update(index, { ...field, max_participants: parseInt(e.target.value) || undefined });
                            }}
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
                            value={field.contact_person || ''}
                            onChange={(e) => {
                              update(index, { ...field, contact_person: e.target.value });
                            }}
                            placeholder="Event organizer name"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`event-contact-email-${index}`}>Contact Email</Label>
                          <Input
                            id={`event-contact-email-${index}`}
                            type="email"
                            value={field.contact_email || ''}
                            onChange={(e) => {
                              update(index, { ...field, contact_email: e.target.value });
                            }}
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
