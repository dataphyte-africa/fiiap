'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Video, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/types/db';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type Event = Database['public']['Tables']['events']['Row'];

interface EventCarouselProps {
  events: Event[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function EventCarousel({ 
  events, 
  autoPlay = true, 
  autoPlayInterval = 5000 
}: EventCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || events.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, events.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
  };

  if (events.length === 0) {
    return null;
  }

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
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy HH:mm');
  };

  return (
    <div className="relative w-full">
      {/* Main Carousel */}
      <div className="relative h-[500px] overflow-hidden rounded-lg">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={cn(
              "absolute inset-0 transition-transform duration-500 ease-in-out",
              index === currentSlide ? "translate-x-0" : 
              index < currentSlide ? "-translate-x-full" : "translate-x-full"
            )}
          >
            <Card className="h-full border-0 shadow-lg">
              <CardContent className="p-0 h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                  {/* Image Section */}
                  <div className="relative h-64 md:h-full">
                    {event.image_url ? (
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <Calendar className="h-16 w-16 text-blue-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Featured Badge */}
                    {event.is_featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500 text-yellow-50">
                          Featured Event
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="space-y-4">
                      {/* Event Type */}
                      {event.event_type && getEventTypeBadge(event.event_type)}

                      {/* Event Title */}
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                        {event.title}
                      </h2>

                      {/* Event Description */}
                      {event.description && (
                        <p className="text-gray-600 text-lg leading-relaxed line-clamp-3">
                          {event.description}
                        </p>
                      )}

                      {/* Event Details */}
                      <div className="space-y-2">
                        {/* Date */}
                        <div className="flex items-center gap-2 text-blue-600">
                          <Calendar className="h-5 w-5" />
                          <span className="font-medium">
                            {formatEventDate(event.event_date)}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-gray-600">
                          {event.is_virtual ? (
                            <>
                              <Video className="h-5 w-5" />
                              <span>Virtual Event</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="h-5 w-5" />
                              <span>{event.location || event.venue_name || 'Location TBD'}</span>
                            </>
                          )}
                        </div>

                        {/* Max Participants */}
                        {event.max_participants && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="h-5 w-5" />
                            <span>Max {event.max_participants} participants</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {event.tags && (
                        <div className="flex flex-wrap gap-2">
                          {event.tags.split(',').slice(0, 4).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="pt-4">
                        <Link href={`/events/${event.id}`}>
                          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                            View Event Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {events.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {events.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {events.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                index === currentSlide ? "bg-blue-600" : "bg-gray-300"
              )}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
