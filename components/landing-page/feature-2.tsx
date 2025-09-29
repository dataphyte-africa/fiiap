import React, { Suspense } from 'react';
import { Feature2Client } from './feature-2-client';
import { Feature2Skeleton } from './feature-2-skeleton';

export const Feature2 = () => {
  return (
    <Suspense fallback={<Feature2Skeleton />}>
      <Feature2Client />
    </Suspense>
  );
}