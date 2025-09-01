'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFiltersProps {
  searchPlaceholder?: string;
  filterOptions?: {
    key: string;
    label: string;
    options: FilterOption[];
  }[];
  onSearch?: (search: string) => void;
  onFilter?: (filters: Record<string, string>) => void;
  className?: string;
}

export function SearchFilters({
  searchPlaceholder = "Search...",
  filterOptions = [],
  onSearch,
  onFilter,
  className = ""
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const initialFilters: Record<string, string> = {};
    filterOptions.forEach(option => {
      const value = searchParams.get(option.key);
      if (value) {
        initialFilters[option.key] = value;
      }
    });
    return initialFilters;
  });
  const [showFilters, setShowFilters] = useState(false);

  // Update URL with search and filter parameters
  const updateUrl = (newSearch?: string, newFilters?: Record<string, string>) => {
    const params = new URLSearchParams();
    
    // Add search parameter
    const search = newSearch !== undefined ? newSearch : searchTerm;
    if (search) {
      params.set('search', search);
    }
    
    // Add filter parameters
    const currentFilters = newFilters !== undefined ? newFilters : filters;
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      }
    });
    
    // Reset to page 1 when searching/filtering
    params.set('page', '1');
    
    const queryString = params.toString();
    router.push(`?${queryString}`);
  };

  // Handle search
  const handleSearch = () => {
    updateUrl(searchTerm);
    onSearch?.(searchTerm);
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    if (value === 'all' || !value) {
      delete newFilters[key];
    }
    setFilters(newFilters);
    updateUrl(undefined, newFilters);
    onFilter?.(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({});
    router.push('?page=1');
    onSearch?.('');
    onFilter?.({});
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || Object.keys(filters).length > 0;

  // Handle Enter key in search input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>
              Search
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Filters Section */}
          {showFilters && filterOptions.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Filters</h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterOptions.map((option) => (
                  <div key={option.key}>
                    <label className="text-sm font-medium mb-1 block">
                      {option.label}
                    </label>
                    <Select
                      value={filters[option.key] || 'all'}
                      onValueChange={(value) => handleFilterChange(option.key, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`All ${option.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All {option.label}</SelectItem>
                        {option.options.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchTerm}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => {
                      setSearchTerm('');
                      updateUrl('');
                      onSearch?.('');
                    }}
                  />
                </Badge>
              )}
              {Object.entries(filters).map(([key, value]) => {
                const option = filterOptions.find(opt => opt.key === key);
                const optionLabel = option?.options.find(opt => opt.value === value)?.label || value;
                return (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    {option?.label}: {optionLabel}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange(key, 'all')}
                    />
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
