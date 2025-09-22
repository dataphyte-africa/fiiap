import { Suspense } from 'react';
import { FundingOpportunitiesTable } from '@/components/admin/funding-opportunities-table';

function FundingOpportunitiesTableWithSuspense() {
  return (
    <Suspense fallback={<div>Loading funding opportunities...</div>}>
      <FundingOpportunitiesTable />
    </Suspense>
  );
}

export default function AdminFundingOpportunitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <FundingOpportunitiesTableWithSuspense />
    </div>
  );
}

export const metadata = {
  title: 'Funding Opportunities Management - Admin',
  description: 'Manage grants, fellowships, and donor calls for CSO organizations',
};
