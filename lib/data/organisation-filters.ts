import { createClient } from "@/lib/supabase/server";
import type { ComboBoxOption } from "@/components/organisations";

export async function getCountryFilterOptions(): Promise<ComboBoxOption[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('organisations')
    .select('country')
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching country options:', error);
    return [];
  }

  // Count occurrences of each country
  const countryCount = data.reduce((acc, org) => {
    const country = org.country;
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to ComboBoxOption format
  return Object.entries(countryCount).map(([value, count]) => ({
    value: value.toLowerCase(),
    label: value,
    count
  })).sort((a, b) => a.label.localeCompare(b.label));
}

export async function getThematicAreaFilterOptions(): Promise<ComboBoxOption[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('organisations')
    .select('thematic_focus')
    .eq('status', 'active')
    .not('thematic_focus', 'is', null);

  if (error) {
    console.error('Error fetching thematic area options:', error);
    return [];
  }

  // Flatten and count all thematic focus areas
  const thematicCount: Record<string, number> = {};
  
  data.forEach(org => {
    if (org.thematic_focus && Array.isArray(org.thematic_focus)) {
      org.thematic_focus.forEach(theme => {
        if (theme) {
          thematicCount[theme] = (thematicCount[theme] || 0) + 1;
        }
      });
    }
  });

  // Convert to ComboBoxOption format
  return Object.entries(thematicCount).map(([value, count]) => ({
    value: value,
    label: value,
    count
  })).sort((a, b) => a.label.localeCompare(b.label));
}

export async function getRegionFilterOptions(): Promise<ComboBoxOption[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('organisations')
    .select('region')
    .eq('status', 'active')
    .not('region', 'is', null);

  if (error) {
    console.error('Error fetching region options:', error);
    return [];
  }

  // Count occurrences of each region
  const regionCount = data.reduce((acc, org) => {
    const region = org.region;
    if (region) {
      acc[region] = (acc[region] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Convert to ComboBoxOption format
  return Object.entries(regionCount).map(([value, count]) => ({
    value: value.toLowerCase().replace(/\s+/g, '_'),
    label: value,
    count
  })).sort((a, b) => a.label.localeCompare(b.label));
}

export async function getAllFilterOptions() {
  try {
    // Use Promise.all to fetch all filter options concurrently
    const [countryOptions, thematicAreaOptions, regionOptions] = await Promise.all([
      getCountryFilterOptions(),
      getThematicAreaFilterOptions(), 
      getRegionFilterOptions()
    ]);

    return {
      countryOptions,
      thematicAreaOptions,
      regionOptions
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    // Return empty arrays as fallback
    return {
      countryOptions: [],
      thematicAreaOptions: [],
      regionOptions: []
    };
  }
} 