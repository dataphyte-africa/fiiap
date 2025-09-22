import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { FundingOpportunityCarousel } from '@/components/funding/funding-opportunity-carousel';
import { FundingOpportunityGrid } from '@/components/funding/funding-opportunity-grid';
import { FundingOpportunityCarouselSkeleton, FundingOpportunityGridSkeleton } from '@/components/funding/funding-opportunity-skeleton';
import { SearchFilters } from '@/components/ui/search-filters';
import { FundingOpportunityStatus, getFeaturedFundingOpportunities, getPublicFundingOpportunities } from '@/lib/data/public-content';
import { FundingOpportunityType } from '@/lib/data/public-content';

export const metadata: Metadata = {
  title: 'Funding Opportunities | FIIAP',
  description: 'Discover grants, fellowships, and funding opportunities for civil society organizations across West Africa.',
  openGraph: {
    title: 'Funding Opportunities | FIIAP',
    description: 'Discover grants, fellowships, and funding opportunities for civil society organizations across West Africa.',
    type: 'website',
  },
};

interface FundingOpportunitiesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    type?: FundingOpportunityType;
    status?: FundingOpportunityStatus;
  }>;
}

async function FeaturedFundingOpportunities() {
  const t = await getTranslations('funding.featured');
  
  try {
    const featuredOpportunities = await getFeaturedFundingOpportunities();

    if (featuredOpportunities.length === 0) {
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
        <FundingOpportunityCarousel opportunities={featuredOpportunities} />
      </section>
    );
  } catch (error) {
    console.error('Error fetching featured funding opportunities:', error);
    return null;
  }
}

async function FundingOpportunitiesList({ searchParams }: { searchParams: FundingOpportunitiesPageProps['searchParams'] }) {
  const t = await getTranslations('funding');
  const { page, search, type, status } = await searchParams;
  
  try {
    const result = await getPublicFundingOpportunities({
      page: page ? parseInt(page) : undefined,
      search,
      type,
      status,
      featured: false, // Only non-featured opportunities for this section
      limit: 12
    });

    const { data: opportunities, totalPages, currentPage, hasNextPage, hasPrevPage } = result;

    return (
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('all.title')}
            </h2>
            <p className="text-gray-600">
              {t('all.description')}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchFilters
          searchPlaceholder={t('search.placeholder')}
          filterOptions={[
            {
              key: 'type',
              label: t('filters.type'),
              options: [
                { value: 'grant', label: 'Grant' },
                { value: 'fellowship', label: 'Fellowship' },
                { value: 'donor_call', label: 'Donor Call' },
                { value: 'scholarship', label: 'Scholarship' },
                { value: 'award', label: 'Award' },
                { value: 'loan', label: 'Loan' },
                { value: 'other', label: 'Other' },
              ]
            },
            {
              key: 'status',
              label: t('filters.status'),
              options: [
                { value: 'open', label: 'Open' },
                { value: 'closing_soon', label: 'Closing Soon' },
                { value: 'closed', label: 'Closed' },
                { value: 'postponed', label: 'Postponed' },
              ]
            }
          ]}
          className="mb-8"
        />

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {search || type || status ? (
              <>
                {t('results.showingFiltered', { count: opportunities.length, total: result.count })}
                {search && <> &quot;<strong>{search}</strong>&quot;</>}
                {type && <> {t('results.ofType')} <strong>{type.replace('_', ' ')}</strong></>}
                {status && <> {t('results.withStatus')} <strong>{status.replace('_', ' ')}</strong></>}
              </>
            ) : (
              <>{t('results.showing', { count: opportunities.length, total: result.count })}</>
            )}
          </p>
        </div>

        <FundingOpportunityGrid opportunities={opportunities} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {hasPrevPage && (
              <a
                href={`?page=${currentPage - 1}${search ? `&search=${search}` : ''}${type ? `&type=${type}` : ''}${status ? `&status=${status}` : ''}`}
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
                    href={`?page=${pageNum}${search ? `&search=${search}` : ''}${type ? `&type=${type}` : ''}${status ? `&status=${status}` : ''}`}
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
                href={`?page=${currentPage + 1}${search ? `&search=${search}` : ''}${type ? `&type=${type}` : ''}${status ? `&status=${status}` : ''}`}
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
    console.error('Error fetching funding opportunities:', error);
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

export default async function FundingOpportunitiesPage({ searchParams }: FundingOpportunitiesPageProps) {
  const t = await getTranslations('funding.hero');
  
  return (
    <div className="min-h-screen container">
      {/* Hero Section */}
      <div className="bg-[url('/hero-bg.png')] bg-cover bg-center bg-no-repeat text-white md:min-h-[50vh] flex flex-col justify-center items-center relative">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
              {t('description')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Featured Funding Opportunities Section */}
        <Suspense fallback={<FundingOpportunityCarouselSkeleton />}>
          <FeaturedFundingOpportunities />
        </Suspense>

        {/* All Funding Opportunities Section */}
        <Suspense fallback={<FundingOpportunityGridSkeleton count={12} />}>
          <FundingOpportunitiesList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
