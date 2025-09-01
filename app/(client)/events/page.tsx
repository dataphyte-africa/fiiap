import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { EventCarousel } from '@/components/events/event-carousel';
import { EventGrid } from '@/components/events/event-grid';
import { EventCarouselSkeleton, EventGridSkeleton } from '@/components/events/event-skeleton';
import { EventSearch } from '@/components/events/event-search';
import { getFeaturedEvents, getPublicEvents } from '@/lib/data/public-content';

export const metadata: Metadata = {
  title: 'Events & Activities | FIIAP',
  description: 'Discover upcoming events, conferences, workshops, and activities from CSOs across West Africa.',
  openGraph: {
    title: 'Events & Activities | FIIAP',
    description: 'Discover upcoming events, conferences, workshops, and activities from CSOs across West Africa.',
    type: 'website',
  },
};

interface EventsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    type?: string;
    virtual?: string;
  }>;
}

async function FeaturedEvents() {
  const t = await getTranslations('events.featured');
  
  try {
    const featuredEvents = await getFeaturedEvents();

    if (featuredEvents.length === 0) {
      return null;
    }

    return (
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-600 max-w-2xl">
            {t('description')}
          </p>
        </div>
        <EventCarousel events={featuredEvents} />
      </section>
    );
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return null;
  }
}

async function EventsList({ searchParams }: { searchParams: EventsPageProps['searchParams'] }) {
  const t = await getTranslations('events');
  const { page, search, type, virtual } = await searchParams;

  try {
    const result = await getPublicEvents({
      page: page ? parseInt(page) : 1,
      search,
      type,
      is_virtual: virtual === 'true' ? true : undefined,
      featured: false, // Only non-featured events for this section
      limit: 12
    });

    const { data: events, totalPages, currentPage, hasNextPage, hasPrevPage } = result;

    return (
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('upcoming.title')}
            </h2>
            <p className="text-gray-600">
              {t('upcoming.description')}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <EventSearch />

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {search || type || virtual ? (
              <>
                {t('results.showingFiltered', { count: events.length, total: result.count })}
                {search && <> &quot;<strong>{search}</strong>&quot;</>}
                {type && <> {t('results.inCategory')} <strong>{type.replace('_', ' ')}</strong></>}
                {virtual === 'true' && <> {t('results.virtualOnly')}</>}
              </>
            ) : (
              <>{t('results.upcomingEvents', { count: events.length, total: result.count })}</>
            )}
          </p>
        </div>

        <EventGrid events={events} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {hasPrevPage && (
              <a
                href={`?page=${currentPage - 1}${search ? `&search=${search}` : ''}${type ? `&type=${type}` : ''}${virtual ? `&virtual=${virtual}` : ''}`}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {t('pagination.previous')}
              </a>
            )}
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <a
                    key={pageNum}
                    href={`?page=${pageNum}${search ? `&search=${search}` : ''}${type ? `&type=${type}` : ''}${virtual ? `&virtual=${virtual}` : ''}`}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      pageNum === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </a>
                );
              })}
            </div>

            {hasNextPage && (
              <a
                href={`?page=${currentPage + 1}${search ? `&search=${search}` : ''}${type ? `&type=${type}` : ''}${virtual ? `&virtual=${virtual}` : ''}`}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {t('pagination.next')}
              </a>
            )}
          </div>
        )}
      </section>
    );
  } catch (error) {
    console.error('Error fetching events:', error);
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('error.title')}
        </h3>
        <p className="text-gray-600">
          {t('error.description')}
        </p>
      </div>
    );
  }
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const t = await getTranslations('events.hero');
  
  return (
    <div className="min-h-screen container">
      {/* Hero Section */}
      <div className="bg-[url(/hero-bg.png)] bg-cover bg-no-repeat text-white md:min-h-[50vh] flex flex-col justify-center items-center relative">
        <div className="absolute inset-0" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              {t('description')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Featured Events Section */}
        <Suspense fallback={<EventCarouselSkeleton />}>
          <FeaturedEvents />
        </Suspense>

        {/* All Events Section */}
        <Suspense fallback={<EventGridSkeleton count={12} />}>
          <EventsList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
