"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { OrgCard } from "../landing-page/org-card";
import { organisationService } from "@/client-services/organisations";
import { useTranslations } from "next-intl";

// Mock data for the organisations
interface Organisation {
  id: string;
  name: string;
  city: string | null;
  region: string | null;
  country: string;
  logo_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface OrganisationResult {
  data: Organisation[];
  count: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function OrganisationsGrid() {
  const t = useTranslations('organisations.grid');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [result, setResult] = useState<OrganisationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { data: organisations, count, totalPages, currentPage, hasNextPage, hasPrevPage } = result || {
    data: [],
    count: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false
  };

  // Fetch organisations based on search params
  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        setLoading(true);
        setError(null);

        const filters = {
          name: searchParams.get('name') || undefined,
          countries: searchParams.get('country') ? searchParams.get('country')!.split(',') : undefined,
          thematic_areas: searchParams.get('thematic_area') ? searchParams.get('thematic_area')!.split(',') : undefined,
          regions: searchParams.get('region') ? searchParams.get('region')!.split(',') : undefined,
          sortBy: (searchParams.get('sortBy') as 'name' | 'created_at' | 'updated_at') || 'created_at',
          sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
          page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1,
          limit: 12,
        };

        const data = await organisationService.getActiveOrganisations(filters);
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch organisations');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisations();
  }, [searchParams]);

  const updateURL = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    updateURL('sortBy', sortBy);
    updateURL('sortOrder', sortOrder);
  };

  const handlePageChange = (page: number) => {
    updateURL('page', page.toString());
  };

  const sortValue = `${searchParams.get('sortBy') || 'created_at'}-${searchParams.get('sortOrder') || 'desc'}`;

  // Helper function to format organisation data for OrgCard
  const formatOrganisationForCard = (org: Organisation) => ({
    id: org.id,
    logo: org.logo_url || '/landing/hfai-logo.png', // Fallback logo
    name: org.name,
    location: [org.city, org.region, org.country].filter(Boolean).join(', '),
    projects: Math.floor(Math.random() * 100), // Mock data - replace with real data
    blogs: Math.floor(Math.random() * 50), // Mock data - replace with real data
    description: `Working to make a difference in ${org.country}`, // Mock description - replace with real data
  });

  if (loading) {
    return (
      <div className="w-full">
        {/* Loading skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading organisations</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try again</Button>
        </div>
      </div>
    );
  }

  if (!loading && organisations.length === 0) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noResults.title')}</h3>
          <p className="text-gray-500">{t('noResults.description')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Results header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {count === 1 ? `1 ${t('results.organisation')}` : `${count.toLocaleString()} ${t('results.organisations')}`}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t('results.page')} {currentPage} {t('results.of')} {totalPages}
          </p>
        </div>
        
        {/* Sort dropdown */}
        <Select value={sortValue} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[200px]">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t('sort.sortBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at-desc">{t('sort.newest')}</SelectItem>
            <SelectItem value="created_at-asc">{t('sort.oldest')}</SelectItem>
            <SelectItem value="name-asc">{t('sort.nameAZ')}</SelectItem>
            <SelectItem value="name-desc">{t('sort.nameZA')}</SelectItem>
            <SelectItem value="updated_at-desc">{t('sort.recentlyUpdated')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Organisations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {organisations.map((org) => (
          <OrgCard
            key={org.id}
            {...formatOrganisationForCard(org)}
            projectsLabel={t('projects')}
            blogsLabel={t('posts')}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden md:block">{t('pagination.previous')}</span>
          </Button>
          
          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                  className="w-8 h-8 md:w-10 md:h-10"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="flex items-center gap-1"
          >
            <span className="hidden md:block">{t('pagination.next')}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
} 