import { Suspense } from 'react';
import { CoursesTable } from '@/components/admin/courses-table';

function CoursesTableWithSuspense() {
  return (
    <Suspense fallback={<div>Loading courses...</div>}>
      <CoursesTable />
    </Suspense>
  );
}

export default function AdminOnlineCoursesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <CoursesTableWithSuspense />
    </div>
  );
}

export const metadata = {
  title: 'Online Courses Management - Admin',
  description: 'Manage online courses and training programs',
};
