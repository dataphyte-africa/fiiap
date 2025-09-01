import { Suspense } from 'react';
import { ResourcesTable } from '@/components/admin/resources-table';

function ResourcesTableWithSuspense() {
  return (
    <Suspense fallback={<div>Loading resources...</div>}>
      <ResourcesTable />
    </Suspense>
  );
}

export default function AdminResourceLibraryPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ResourcesTableWithSuspense />
    </div>
  );
}

export const metadata = {
  title: 'Resource Library Management - Admin',
  description: 'Manage toolkits, research papers, and educational materials',
};
