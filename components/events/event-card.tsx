'use client';


import Link from 'next/link';
import { Calendar, MapPin, Users, Video, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database } from '@/types/db';
import { format } from 'date-fns';

type Event = Database['public']['Tables']['events']['Row'];

interface EventCardProps {
  event: Event;
  showStats?: boolean;
}

export function EventCard({ event, }: EventCardProps) {
  const getEventTypeBadge = (eventType: string | null) => {
    if (!eventType) return null;
    
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
        {eventType.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const isEventSoon = (eventDate: string) => {
    const eventTime = new Date(eventDate).getTime();
    const now = Date.now();
    const threeDaysFromNow = now + (3 * 24 * 60 * 60 * 1000);
    return eventTime <= threeDaysFromNow && eventTime >= now;
  };

  const formatEventDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
      <CardContent className="p-0">
        {/* Event Image */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <Calendar className="h-12 w-12 text-blue-400" />
            </div>
          )}
          
          {/* Event Type Badge */}
          {event.event_type && (
            <div className="absolute top-3 left-3">
              {getEventTypeBadge(event.event_type)}
            </div>
          )}

          {/* Featured Badge */}
          {event.is_featured && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-yellow-500 text-yellow-50">
                Featured
              </Badge>
            </div>
          )}

          {/* Soon Badge */}
          {isEventSoon(event.event_date) && (
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-red-500 text-red-50 animate-pulse">
                Soon
              </Badge>
            </div>
          )}
        </div>

        {/* Event Content */}
        <div className="p-6">
          {/* Event Date */}
          <div className="flex items-center gap-2 text-blue-600 mb-3">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">
              {formatEventDateShort(event.event_date)}
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>

          {/* Event Description */}
          {event.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {event.description}
            </p>
          )}

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            {/* Location */}
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              {event.is_virtual ? (
                <>
                  <Video className="h-4 w-4" />
                  <span>Virtual Event</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  <span>{event.location || event.venue_name || 'TBD'}</span>
                </>
              )}
            </div>

            {/* Max Participants */}
            {event.max_participants && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Users className="h-4 w-4" />
                <span>Max {event.max_participants} participants</span>
              </div>
            )}

            {/* Duration (if event has end date) */}
            {event.event_end_date && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Clock className="h-4 w-4" />
                <span>
                  {Math.ceil((new Date(event.event_end_date).getTime() - new Date(event.event_date).getTime()) / (1000 * 60 * 60 * 24))} day(s)
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {event.tags && (
            <div className="flex flex-wrap gap-1 mb-4">
              {event.tags.split(',').slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Button */}
          <Link href={`/events/${event.id}`} className="block">
            <Button className="w-full" variant="outline">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
