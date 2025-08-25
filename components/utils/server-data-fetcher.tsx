import React, { Suspense } from 'react';

interface ServerDataFetcherProps<T> {
  /**
   * Function that fetches data on the server side
   */
  fetchFn: () => Promise<T>;
  
  /**
   * Component to render with the fetched data
   */
  render: (data: T) => React.ReactNode;
  
  /**
   * Fallback component to show while loading
   */
  fallback?: React.ReactNode;
}

/**
 * Default loading fallback component
 */
const DefaultLoadingFallback: React.ComponentType = () => (
  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
      <span className="text-sm text-gray-600">Loading...</span>
    </div>
  </div>
);

/**
 * Async component that fetches data and renders it
 */
async function AsyncDataRenderer<T>({ 
  fetchFn, 
  render 
}: { 
  fetchFn: () => Promise<T>; 
  render: (data: T) => React.ReactNode; 
}) {
  const data = await fetchFn();
  return <>{render(data)}</>;
}

/**
 * ServerDataFetcher component that automatically handles:
 * - Server-side data fetching
 * - Suspense boundaries
 * - Loading states
 * - Custom fallbacks
 */
export function ServerDataFetcher<T>({
  fetchFn,
  render,
  fallback = <DefaultLoadingFallback />
}: ServerDataFetcherProps<T>) {
  return (
    <Suspense fallback={fallback}>
      <AsyncDataRenderer fetchFn={fetchFn} render={render} />
    </Suspense>
  );
}

/**
 * Hook for using the ServerDataFetcher in a more flexible way
 * This allows you to use the component programmatically
 */
export function useServerDataFetcher<T>(
  fetchFn: () => Promise<T>,
  options?: {
    fallback?: React.ReactNode;
  }
) {
  return {
    ServerDataFetcher: (props: { render: (data: T) => React.ReactNode }) => (
      <ServerDataFetcher
        fetchFn={fetchFn}
        render={props.render}
        fallback={options?.fallback}
      />
    )
  };
}

// Export types for external use
export type { ServerDataFetcherProps };
