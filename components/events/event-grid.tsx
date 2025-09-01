import { EventCard } from './event-card';
import { Database } from '@/types/db';

type Event = Database['public']['Tables']['events']['Row'];

interface EventGridProps {
  events: Event[];
  showStats?: boolean;
}

export function EventGrid({ events, showStats = true }: EventGridProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No events found
        </h3>
        <p className="text-gray-600">
          Check back later for upcoming events and activities from our community.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          showStats={showStats}
        />
      ))}
    </div>
  );
}
