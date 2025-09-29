import { Suspense } from 'react';
import { CoursesTable } from '@/components/admin/courses-table';
import { useTranslations } from 'next-intl';

function CoursesTableWithSuspense() {
  const t = useTranslations();
  
  return (
    <Suspense fallback={<div>{t('admin.common.loading')}</div>}>
      <CoursesTable />
    </Suspense>
  );
}

export default function AdminOnlineCoursesPage() {
  const t = useTranslations();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('admin.pages.courses.title')}
        </h1>
        <p className="text-gray-600">
          {t('admin.pages.courses.description')}
        </p>
      </div>
      <CoursesTableWithSuspense />
    </div>
  );
}

export const metadata = {
  title: 'Online Courses Management - Admin',
  description: 'Manage online courses and training programs',
};
