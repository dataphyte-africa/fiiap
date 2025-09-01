import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Video, 
  Users, 
  Clock, 
  Globe,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShareModal } from '@/components/ui/share-modal';
import { EventGrid } from '@/components/events/event-grid';
import { EventGridSkeleton } from '@/components/events/event-skeleton';
import { getEventById, getPublicEvents, formatEventDate } from '@/lib/data/public-content';

interface EventPageProps {
  params: Promise< {
    id: string;
  }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const {id} = await params;
  const event = await getEventById(id);

  if (!event) {
    return {
      title: 'Event Not Found | FIIAP',
      description: 'The requested event could not be found.',
    };
  }

  return {
    title: `${event.title} | FIIAP Events`,
    description: event.description || `Join us for ${event.title}`,
    openGraph: {
      title: event.title,
      description: event.description || `Join us for ${event.title}`,
      type: 'article',
      images: event.image_url ? [
        {
          url: event.image_url,
          alt: event.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description || `Join us for ${event.title}`,
      images: event.image_url ? [event.image_url] : undefined,
    },
  };
}

async function RelatedEvents({ currentEventId, eventType }: { currentEventId: string; eventType: string | null }) {
  try {
    const { data: relatedEvents } = await getPublicEvents({
      type: eventType || undefined,
      limit: 3,
    });

    const filtered = relatedEvents.filter(event => event.id !== currentEventId);

    if (filtered.length === 0) {
      return null;
    }

    return (
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Related Events
        </h2>
        <EventGrid events={filtered} showStats={false} />
      </section>
    );
  } catch (error) {
    console.error('Error fetching related events:', error);
    return null;
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const {id} = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
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

  const isEventSoon = (eventDate: string) => {
    const eventTime = new Date(eventDate).getTime();
    const now = Date.now();
    const threeDaysFromNow = now + (3 * 24 * 60 * 60 * 1000);
    return eventTime <= threeDaysFromNow && eventTime >= now;
  };

  const isEventPassed = (eventDate: string) => {
    return new Date(eventDate).getTime() < Date.now();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/events" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>

      {/* Event Header */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          {/* Event Type and Status */}
          <div className="flex items-center gap-3 mb-6">
            {event.event_type && getEventTypeBadge(event.event_type)}
            {event.is_featured && (
              <Badge className="bg-yellow-500 text-yellow-50">
                Featured Event
              </Badge>
            )}
            {isEventSoon(event.event_date) && (
              <Badge className="bg-red-500 text-red-50 animate-pulse">
                Starting Soon
              </Badge>
            )}
            {isEventPassed(event.event_date) && (
              <Badge variant="outline" className="text-gray-500">
                Event Ended
              </Badge>
            )}
          </div>

          {/* Event Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {event.title}
          </h1>

          {/* Event Description */}
          {event.description && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Date and Time */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Date & Time</h3>
                <p className="text-gray-600">{formatEventDate(event.event_date)}</p>
                {event.event_end_date && (
                  <p className="text-sm text-gray-500">
                    Ends: {formatEventDate(event.event_end_date)}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              {event.is_virtual ? (
                <Video className="h-5 w-5 text-purple-600 mt-1" />
              ) : (
                <MapPin className="h-5 w-5 text-red-600 mt-1" />
              )}
              <div>
                <h3 className="font-medium text-gray-900">Location</h3>
                {event.is_virtual ? (
                  <p className="text-gray-600">Virtual Event</p>
                ) : (
                  <>
                    <p className="text-gray-600">{event.location || 'Location TBD'}</p>
                    {event.venue_name && (
                      <p className="text-sm text-gray-500">{event.venue_name}</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Capacity */}
            {event.max_participants && (
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Capacity</h3>
                  <p className="text-gray-600">Max {event.max_participants} participants</p>
                </div>
              </div>
            )}

            {/* Duration */}
            {event.event_end_date && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Duration</h3>
                  <p className="text-gray-600">
                    {Math.ceil((new Date(event.event_end_date).getTime() - new Date(event.event_date).getTime()) / (1000 * 60 * 60 * 24))} day(s)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {event.tags && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.split(',').map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 py-4 border-y border-gray-200">
            {event.registration_url && (
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Register for Event
                </a>
              </Button>
            )}
            
            {event.meeting_url && event.is_virtual && (
              <Button asChild variant="outline" size="lg">
                <a href={event.meeting_url} target="_blank" rel="noopener noreferrer">
                  <Video className="h-4 w-4 mr-2" />
                  Join Virtual Event
                </a>
              </Button>
            )}

            {event.event_website && (
              <Button asChild variant="outline" size="lg">
                <a href={event.event_website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  Event Website
                </a>
              </Button>
            )}

            <ShareModal
              title={event.title}
              url={`/events/${event.id}`}
              description={event.description || undefined}
            />
          </div>
        </header>

        {/* Event Image */}
        {event.image_url && (
          <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
              priority
            />
          </div>
        )}

        {/* Contact Information */}
        {(event.contact_person || event.contact_email || event.contact_phone) && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                {event.contact_person && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Contact Person</p>
                      <p className="text-gray-600">{event.contact_person}</p>
                    </div>
                  </div>
                )}

                {event.contact_email && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a 
                        href={`mailto:${event.contact_email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {event.contact_email}
                      </a>
                    </div>
                  </div>
                )}

                {event.contact_phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Phone className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <a 
                        href={`tel:${event.contact_phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {event.contact_phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </article>

      {/* Related Events */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<EventGridSkeleton count={3} />}>
            <RelatedEvents 
              currentEventId={event.id || ''} 
              eventType={event.event_type} 
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
