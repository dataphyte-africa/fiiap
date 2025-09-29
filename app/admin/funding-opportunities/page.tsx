import { Suspense } from 'react';
import { FundingOpportunitiesTable } from '@/components/admin/funding-opportunities-table';
import { useTranslations } from 'next-intl';

function FundingOpportunitiesTableWithSuspense() {
  const t = useTranslations();
  
  return (
    <Suspense fallback={<div>{t('admin.common.loading')}</div>}>
      <FundingOpportunitiesTable />
    </Suspense>
  );
}

export default function AdminFundingOpportunitiesPage() {
  const t = useTranslations();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('admin.pages.funding.title')}
        </h1>
        <p className="text-gray-600">
          {t('admin.pages.funding.description')}
        </p>
      </div>
      <FundingOpportunitiesTableWithSuspense />
    </div>
  );
}

export const metadata = {
  title: 'Funding Opportunities Management - Admin',
  description: 'Manage grants, fellowships, and donor calls for CSO organizations',
};
