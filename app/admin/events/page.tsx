import { Suspense } from 'react';
import { EventsTable } from '@/components/admin/events-table';

function EventsTableWithSuspense() {
  return (
    <Suspense fallback={<div>Loading events...</div>}>
      <EventsTable />
    </Suspense>
  );
}

export default function AdminEventsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <EventsTableWithSuspense />
    </div>
  );
}

export const metadata = {
  title: 'Events Management - Admin',
  description: 'Manage events and activities on the platform',
};
