'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Calendar,
  Edit,
  Eye,
  EyeOff,
  MapPin,
  Plus,
  Search,
  Star,
  StarOff,
  Trash2,
  Users,
  Video,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { getEvents, deleteEvent, updateEvent, type EventFilters } from '@/lib/data/admin-content';
import { EventForm } from './event-form';

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Database } from '@/types/db';
import { EventFormData } from '@/lib/schemas/admin-content-schemas';
type DBEvent = Database['public']['Tables']['events']['Row']; 
export function EventsTable() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<EventFilters>({
    page: 1,
    limit: 20,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('all');

  // Modal states
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    eventData?: DBEvent;
  }>({
    isOpen: false,
    mode: 'create',
    eventData: undefined,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    eventId: string | null;
    eventTitle: string;
  }>({
    isOpen: false,
    eventId: null,
    eventTitle: '',
  });

  // Fetch events with React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['events', filters, searchTerm, selectedEventType, selectedVisibility],
    queryFn: () => getEvents({
      ...filters,
      search: searchTerm || undefined,
      event_type: selectedEventType === 'all' ? undefined : selectedEventType,
      is_visible: selectedVisibility === 'all' ? undefined : selectedVisibility === 'visible',
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted successfully!');
      setDeleteModal({ isOpen: false, eventId: null, eventTitle: '' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete event');
    },
  });

  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: ({ id, is_visible }: { id: string; is_visible: boolean }) =>
      updateEvent(id, { is_visible }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event visibility updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update visibility');
    },
  });

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, is_featured }: { id: string; is_featured: boolean }) =>
      updateEvent(id, { is_featured }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event featured status updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update featured status');
    },
  });

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleEventTypeFilter = useCallback((eventType: string) => {
    setSelectedEventType(eventType);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleVisibilityFilter = useCallback((visibility: string) => {
    setSelectedVisibility(visibility);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleSort = useCallback((sortBy: EventFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handleEdit = (event: DBEvent) => {
    setFormModal({
      isOpen: true,
      mode: 'edit',
      eventData: {
        ...event,
        event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
        event_end_date: event.event_end_date ? new Date(event.event_end_date).toISOString().slice(0, 16) : '',
      },
    });
  };

  const handleDelete = (event: DBEvent) => {
    setDeleteModal({
      isOpen: true,
      eventId: event.id || '',
      eventTitle: event.title,
    });
  };

  const handleToggleVisibility = (event: DBEvent) => {
    toggleVisibilityMutation.mutate({
      id: event.id || '',
      is_visible: !event.is_visible,
    });
  };

  const handleToggleFeatured = (event: DBEvent) => {
    toggleFeaturedMutation.mutate({
      id: event.id || '',
      is_featured: !event.is_featured,
    });
  };

  const formatEventDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  const getEventTypeBadge = (eventType: string) => {
    const colors: Record<string, string> = {
      conference: 'bg-blue-100 text-blue-800',
      workshop: 'bg-green-100 text-green-800',
      webinar: 'bg-purple-100 text-purple-800',
      training: 'bg-orange-100 text-orange-800',
      seminar: 'bg-yellow-100 text-yellow-800',
      networking: 'bg-pink-100 text-pink-800',
      fundraiser: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800',
    };

    return (
      <Badge className={colors[eventType] || colors.other}>
        {eventType?.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-600 mb-4">Failed to load events</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Events Management</h2>
          <p className="text-muted-foreground">
            Manage and organize events for the platform
          </p>
        </div>
        <Button onClick={() => setFormModal({ isOpen: true, mode: 'create' })}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedEventType} onValueChange={handleEventTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="webinar">Webinar</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="seminar">Seminar</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="fundraiser">Fundraiser</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedVisibility} onValueChange={handleVisibilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              {data?.count || 0} events found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('title')}
                >
                  Title {filters.sortBy === 'title' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('created_at')}
                >
                  Event Date {filters.sortBy === 'created_at' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No events found
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {event.image_url && (
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-ellipsis max-w-sm line-clamp-1">{event.title}</p>
                          <div className="text-sm text-muted-foreground">
                            {event.description?.substring(0, 30)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getEventTypeBadge(event.event_type || 'other')}
                        {event.is_virtual && (
                          <Badge variant="outline" className="w-fit">
                            <Video className="h-3 w-3" />
                            Virtual
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatEventDate(event.event_date)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {event.location || event.venue_name || 'TBD'}
                        </span>
                      </div>
                      {event.max_participants && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          Max {event.max_participants}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={event.is_visible ? 'default' : 'secondary'}>
                          {event.is_visible ? 'Visible' : 'Hidden'}
                        </Badge>
                        {event.is_featured && (
                          <Badge variant="outline" className="w-fit">
                            <Star className="h-3 w-3" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                     
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipContent>Edit Event</TooltipContent>
                            <TooltipTrigger asChild>
                          <Button onClick={() => handleEdit(event)} size="icon" variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                          </Button>
                          </TooltipTrigger>
                          </Tooltip>
                          <Tooltip>
                            <TooltipContent>{event.is_visible ? 'Hide' : 'Show'} Event</TooltipContent>
                            <TooltipTrigger asChild>
                          <Button onClick={() => handleToggleVisibility(event)} size="icon" variant="outline">
                            {event.is_visible ? (
                              <><EyeOff className="h-4 w-4" /> </>
                            ) : (
                              <><Eye className="h-4 w-4 " />  </>
                            )}  
                          </Button>
                          </TooltipTrigger>
                          </Tooltip>
                          <Tooltip>
                            <TooltipContent>{event.is_featured ? 'Unfeature' : 'Feature'} Event</TooltipContent>
                            <TooltipTrigger asChild>
                          <Button onClick={() => handleToggleFeatured(event)} size="icon" variant="outline">
                            {event.is_featured ? (
                              <><StarOff className="h-4 w-4" /> </>
                            ) : (
                              <><Star className="h-4 w-4" /> </>
                            )}
                          </Button>
                          </TooltipTrigger>
                          </Tooltip>
                          <Tooltip>
                            <TooltipContent>Delete Event</TooltipContent>
                            <TooltipTrigger asChild>
                          <Button 
                            onClick={() => handleDelete(event)}
                            className="text-red-600"
                            size="icon"
                            variant="outline"
                          >
                            <Trash2 className="h-4 w-4 " />
                          
                          </Button>
                          </TooltipTrigger>
                          </Tooltip>
                        </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(filters.page! - 1)}
            disabled={!data.hasPrevPage}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {data.currentPage} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(filters.page! + 1)}
            disabled={!data.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}

      {/* Form Modal */}
      <Dialog open={formModal.isOpen} onOpenChange={(open) => setFormModal({ ...formModal, isOpen: open })}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <EventForm
            initialData={formModal.eventData as EventFormData & { id?: string }}
            mode={formModal.mode}
            onSuccess={() => setFormModal({ isOpen: false, mode: 'create', eventData: undefined })}
            onCancel={() => setFormModal({ isOpen: false, mode: 'create', eventData: undefined })}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal.isOpen} onOpenChange={(open) => setDeleteModal({ ...deleteModal, isOpen: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteModal.eventTitle}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, eventId: null, eventTitle: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteModal.eventId && deleteMutation.mutate(deleteModal.eventId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
