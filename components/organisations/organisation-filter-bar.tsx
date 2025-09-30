"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { FilterComboBox, type ComboBoxOption } from "./filter-combo-box";
import { SearchBox } from "./search-box";
import { Separator } from "../ui/separator";

interface OrganisationFilterBarProps {
  thematicAreaOptions?: ComboBoxOption[];
  countryOptions?: ComboBoxOption[];
  regionOptions?: ComboBoxOption[];
  className?: string;
}

export function OrganisationFilterBar({
  thematicAreaOptions = [],
  countryOptions = [],
  regionOptions = [],
  className,
}: OrganisationFilterBarProps) {
  const t = useTranslations('organisations-client');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for all filters before applying to URL
  const [filters, setFilters] = React.useState({
    name: "",
    thematicArea: [] as string[],
    country: [] as string[],
    region: [] as string[],
  });

  // Initialize filters from URL on mount
  React.useEffect(() => {
    const name = searchParams.get("name") || "";
    const thematicArea = searchParams.get("thematic_area")?.split(",").filter(Boolean) || [];
    const country = searchParams.get("country")?.split(",").filter(Boolean) || [];
    const region = searchParams.get("region")?.split(",").filter(Boolean) || [];

    setFilters({
      name,
      thematicArea,
      country,
      region,
    });
  }, [searchParams]);

  const handleNameChange = (value: string) => {
    setFilters(prev => ({ ...prev, name: value }));
  };

  const handleThematicAreaChange = (value: string | string[]) => {
    setFilters(prev => ({ 
      ...prev, 
      thematicArea: Array.isArray(value) ? value : [value].filter(Boolean)
    }));
  };

  const handleCountryChange = (value: string | string[]) => {
    setFilters(prev => ({ 
      ...prev, 
      country: Array.isArray(value) ? value : [value].filter(Boolean)
    }));
  };

  const handleRegionChange = (value: string | string[]) => {
    setFilters(prev => ({ 
      ...prev, 
      region: Array.isArray(value) ? value : [value].filter(Boolean)
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    // Add name filter
    if (filters.name.trim()) {
      params.set("name", filters.name.trim());
    }

    // Add thematic area filter
    if (filters.thematicArea.length > 0) {
      params.set("thematic_area", filters.thematicArea.join(","));
    }

    // Add country filter
    if (filters.country.length > 0) {
      params.set("country", filters.country.join(","));
    }

    // Add region filter
    if (filters.region.length > 0) {
      params.set("region", filters.region.join(","));
    }

    // Preserve other existing query parameters that aren't filter-related
    const currentParams = new URLSearchParams(searchParams.toString());
    for (const [key, value] of currentParams.entries()) {
      if (!['name', 'thematic_area', 'country', 'region'].includes(key)) {
        params.set(key, value);
      }
    }

    // Update URL
    
    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.push(newUrl, { scroll: false });
  };

  const handleClearFilters = () => {
    setFilters({
      name: "",
      thematicArea: [],
      country: [],
      region: [],
    });

    // Clear filter params from URL but preserve others
    const params = new URLSearchParams(searchParams.toString());
    params.delete("name");
    params.delete("thematic_area");
    params.delete("country");
    params.delete("region");

    const newUrl = params.toString() ? `?${params.toString()}` : "/organisations";
    router.push(newUrl, { scroll: false });
  };

  // Check if any filters are active
  const hasActiveFilters = 
    filters.name.trim() !== "" ||
    filters.thematicArea.length > 0 ||
    filters.country.length > 0 ||
    filters.region.length > 0;

  return (
    <div className={`md:bg-white md:border md:border-gray-200  flex md:rounded-full p-2 md:shadow-sm ${className}`}>
      <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-center w-full">
        {/* Name Search */}
        <div className="min-w-[200px]">
          <SearchBox
            label={t('search.label')}
            placeholder="Input keywords"
            value={filters.name}
            onChange={handleNameChange}
          />
        </div>
        <Separator orientation="vertical"  className="h-full w-0.5 hidden md:block"/>
        {/* Thematic Area Filter */}
        {thematicAreaOptions.length > 0 && (
          <div className="min-w-[200px]">
            <FilterComboBox
              options={thematicAreaOptions}
              placeholder={t('filters.selectThematicArea')}
              label={t('filters.thematicArea')}
              multiple={true}
              value={filters.thematicArea}
              onSelectionChange={handleThematicAreaChange}
              className="w-full"
            />
          </div>
        )}
        <Separator orientation="vertical"  className="h-full w-0.5 hidden md:block"/>
        {/* Country Filter */}
        {countryOptions.length > 0 && (
          <div className="min-w-[200px]">
            <FilterComboBox
              options={countryOptions}
              placeholder={t('filters.selectCountry')}
              label={t('filters.country')}
              multiple={true}
              value={filters.country}
              onSelectionChange={handleCountryChange}
              className="w-full"
            />
          </div>
        )}
        <Separator orientation="vertical"  className="h-full w-0.5 hidden md:block"/>
        {/* Region Filter */}
        {regionOptions.length > 0 && (
          <div className="min-w-[200px]">
            <FilterComboBox
              options={regionOptions}
              placeholder={t('filters.selectRegion')}
              label={t('filters.region')}
              multiple={true}
              value={filters.region}
              onSelectionChange={handleRegionChange}
              className="w-full"
            />
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleSearch}
            className=" rounded-full"
            size="lg"
          >
            <Search className="h-4 w-4" />
            {t('search.searchButton')}
          </Button>

          {hasActiveFilters && (
            <Button 
              onClick={handleClearFilters}
              variant="outline"
              className=" rounded-full"
              size="lg"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      
    </div>
  );
} 