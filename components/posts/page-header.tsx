
import { Suspense } from 'react';
import { PageHeaderStats } from './page-header-stats';
import { PageHeaderSkeleton } from './page-header-skeleton';

export function PageHeader({ organisation_id }: { organisation_id: string }) {
  return (
    <Suspense fallback={<PageHeaderSkeleton />}>
      <PageHeaderStats organisationId={organisation_id} />
    </Suspense>
  );
}
