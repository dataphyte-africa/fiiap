import { Suspense } from 'react';
import { ResourcesTable } from '@/components/admin/resources-table';
import { useTranslations } from 'next-intl';

function ResourcesTableWithSuspense() {
  const t = useTranslations();
  
  return (
    <Suspense fallback={<div>{t('admin.common.loading')}</div>}>
      <ResourcesTable />
    </Suspense>
  );
}

export default function AdminResourceLibraryPage() {
  const t = useTranslations();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('admin.pages.resources.title')}
        </h1>
        <p className="text-gray-600">
          {t('admin.pages.resources.description')}
        </p>
      </div>
      <ResourcesTableWithSuspense />
    </div>
  );
}

export const metadata = {
  title: 'Resource Library Management - Admin',
  description: 'Manage toolkits, research papers, and educational materials',
};
