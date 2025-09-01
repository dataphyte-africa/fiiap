import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CourseCarousel } from '@/components/courses/course-carousel';
import { CourseGrid } from '@/components/courses/course-grid';
import { CourseCarouselSkeleton, CourseGridSkeleton } from '@/components/courses/course-skeleton';
import { SearchFilters } from '@/components/ui/search-filters';
import { getFeaturedCourses, getPublicCourses } from '@/lib/data/public-content';

export const metadata: Metadata = {
  title: 'Online Courses | FIIAP',
  description: 'Access online courses and training programs from FIAP and partner organizations across West Africa.',
  openGraph: {
    title: 'Online Courses | FIIAP',
    description: 'Access online courses and training programs from FIAP and partner organizations across West Africa.',
    type: 'website',
  },
};

interface CoursesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    difficulty?: string;
  }>;
}

async function FeaturedCourses() {
  const t = await getTranslations('courses.featured');
  
  try {
    const featuredCourses = await getFeaturedCourses();

    if (featuredCourses.length === 0) {
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
        <CourseCarousel courses={featuredCourses} />
      </section>
    );
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    return null;
  }
}

async function CoursesList({ searchParams }: { searchParams: CoursesPageProps['searchParams'] }) {
  const t = await getTranslations('courses');
  const { page, search, difficulty } = await searchParams;

  try {
    const result = await getPublicCourses({
      page: page ? parseInt(page) : 1,
      search,
      type: difficulty, // Using type field for difficulty
      featured: false, // Only non-featured courses for this section
      limit: 12
    });

    const { data: courses, totalPages, currentPage, hasNextPage, hasPrevPage } = result;

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
              key: 'difficulty',
              label: t('filters.difficulty'),
              options: [
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]
            }
          ]}
          className="mb-8"
        />

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {search || difficulty ? (
              <>
                {t('results.showingFiltered', { count: courses.length, total: result.count })}
                {search && <> &quot;<strong>{search}</strong>&quot;</>}
                {difficulty && <> {t('results.atLevel', { level: difficulty })}</>}
              </>
            ) : (
              <>{t('results.showing', { count: courses.length, total: result.count })}</>
            )}
          </p>
        </div>

        <CourseGrid courses={courses} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {hasPrevPage && (
              <a
                href={`?page=${currentPage - 1}${search ? `&search=${search}` : ''}${difficulty ? `&difficulty=${difficulty}` : ''}`}
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
                    href={`?page=${pageNum}${search ? `&search=${search}` : ''}${difficulty ? `&difficulty=${difficulty}` : ''}`}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      pageNum === currentPage
                        ? 'bg-purple-600 text-white'
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
                href={`?page=${currentPage + 1}${search ? `&search=${search}` : ''}${difficulty ? `&difficulty=${difficulty}` : ''}`}
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
    console.error('Error fetching courses:', error);
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

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const t = await getTranslations('courses.hero');
  
  return (
    <div className="min-h-screen container">
      {/* Hero Section */}
      <div className="bg-[url('/hero-bg.png')] bg-cover bg-center text-white md:min-h-[50vh] flex flex-col justify-center items-center relative">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              {t('description')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Featured Courses Section */}
        <Suspense fallback={<CourseCarouselSkeleton />}>
          <FeaturedCourses />
        </Suspense>

        {/* All Courses Section */}
        <Suspense fallback={<CourseGridSkeleton count={12} />}>
          <CoursesList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
