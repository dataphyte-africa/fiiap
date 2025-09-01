import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ResourceCarousel } from '@/components/resources/resource-carousel';
import { ResourceGrid } from '@/components/resources/resource-grid';
import { ResourceCarouselSkeleton, ResourceGridSkeleton } from '@/components/resources/resource-skeleton';
import { SearchFilters } from '@/components/ui/search-filters';
import { getFeaturedResources, getPublicResources } from '@/lib/data/public-content';

export const metadata: Metadata = {
  title: 'Resource Library | FIIAP',
  description: 'Access toolkits, research papers, guides, and educational materials from CSOs across West Africa.',
  openGraph: {
    title: 'Resource Library | FIIAP',
    description: 'Access toolkits, research papers, guides, and educational materials from CSOs across West Africa.',
    type: 'website',
  },
};

interface ResourcesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    type?: string;
  }>;
}

async function FeaturedResources() {
  const t = await getTranslations('resources.featured');
  
  try {
    const featuredResources = await getFeaturedResources();

    if (featuredResources.length === 0) {
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
        <ResourceCarousel resources={featuredResources} />
      </section>
    );
  } catch (error) {
    console.error('Error fetching featured resources:', error);
    return null;
  }
}

async function ResourcesList({ searchParams }: { searchParams: ResourcesPageProps['searchParams'] }) {
  const t = await getTranslations('resources');
  const { page, search, type } = await searchParams;
  
  try {
    const result = await getPublicResources({
      page: page ? parseInt(page) : undefined,
      search,
      type,
      featured: false, // Only non-featured resources for this section
      limit: 12
    });

    const { data: resources, totalPages, currentPage, hasNextPage, hasPrevPage } = result;

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
                { value: 'toolkit', label: 'Toolkit' },
                { value: 'research_paper', label: 'Research Paper' },
                { value: 'guide', label: 'Guide' },
                { value: 'template', label: 'Template' },
                { value: 'video', label: 'Video' },
                { value: 'document', label: 'Document' },
                { value: 'report', label: 'Report' },
                { value: 'other', label: 'Other' },
              ]
            }
          ]}
          className="mb-8"
        />

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {search || type ? (
              <>
                {t('results.showingFiltered', { count: resources.length, total: result.count })}
                {search && <> &quot;<strong>{search}</strong>&quot;</>}
                {type && <> {t('results.ofType')} <strong>{type.replace('_', ' ')}</strong></>}
              </>
            ) : (
              <>{t('results.showing', { count: resources.length, total: result.count })}</>
            )}
          </p>
        </div>

        <ResourceGrid resources={resources} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {hasPrevPage && (
              <a
                href={`?page=${currentPage - 1}${search ? `&search=${search}` : ''}${type ? `&type=${type}` : ''}`}
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
                    href={`?page=${pageNum}${search ? `&search=${search}` : ''}${type ? `&type=${type}` : ''}`}
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
                href={`?page=${currentPage + 1}${search ? `&search=${search}` : ''}${type ? `&type=${type}` : ''}`}
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
    console.error('Error fetching resources:', error);
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

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const t = await getTranslations('resources.hero');
  
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
        {/* Featured Resources Section */}
        <Suspense fallback={<ResourceCarouselSkeleton />}>
          <FeaturedResources />
        </Suspense>

        {/* All Resources Section */}
        <Suspense fallback={<ResourceGridSkeleton count={12} />}>
          <ResourcesList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
