import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/db';

export type CountryStatistics = {
  country: Database['public']['Enums']['country_enum'];
  organisation_count: number;
  project_count: number;
};

export function useCountryStatistics() {
  return useQuery({
    queryKey: ['country-statistics'],
    queryFn: async (): Promise<CountryStatistics[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .rpc('get_country_statistics');
      
      if (error) {
        throw new Error(`Failed to fetch country statistics: ${error.message}`);
      }
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
