import { Suspense } from 'react';
import { EventsTable } from '@/components/admin/events-table';
import { useTranslations } from 'next-intl';

function EventsTableWithSuspense() {
  const t = useTranslations();
  
  return (
    <Suspense fallback={<div>{t('admin.common.loading')}</div>}>
      <EventsTable />
    </Suspense>
  );
}

export default function AdminEventsPage() {
  const t = useTranslations();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('admin.pages.events.title')}
        </h1>
        <p className="text-gray-600">
          {t('admin.pages.events.description')}
        </p>
      </div>
      <EventsTableWithSuspense />
    </div>
  );
}

export const metadata = {
  title: 'Events Management - Admin',
  description: 'Manage events and activities on the platform',
};
