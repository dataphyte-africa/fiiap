'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export function EventSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [eventType, setEventType] = useState(searchParams.get('type') || 'all');
  const [virtualOnly, setVirtualOnly] = useState(searchParams.get('virtual') === 'true');
  const [showFilters, setShowFilters] = useState(false);

  // Update URL with search and filter parameters
  const updateUrl = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    if (eventType && eventType !== 'all') params.set('type', eventType);
    if (virtualOnly) params.set('virtual', 'true');
    params.set('page', '1'); // Reset to page 1
    
    const queryString = params.toString();
    router.push(`?${queryString}`);
  };

  // Handle search
  const handleSearch = () => {
    updateUrl();
  };

  // Handle filter change
  const handleFilterChange = () => {
    updateUrl();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setEventType('all');
    setVirtualOnly(false);
    router.push('?page=1');
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || eventType !== 'all' || virtualOnly;

  // Handle Enter key in search input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const EVENT_TYPES = [
    { value: 'conference', label: 'Conference' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'training', label: 'Training' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'networking', label: 'Networking' },
    { value: 'fundraiser', label: 'Fundraiser' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events by title, description, or tags..."
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
          {showFilters && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Filter Events</h3>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Event Type Filter */}
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Event Type
                  </label>
                  <Select
                    value={eventType}
                    onValueChange={(value) => {
                      setEventType(value);
                      handleFilterChange();
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Event Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Event Types</SelectItem>
                      {EVENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Virtual Events Filter */}
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="virtual-only"
                    checked={virtualOnly}
                    onCheckedChange={(checked) => {
                      setVirtualOnly(!!checked);
                      handleFilterChange();
                    }}
                  />
                  <label htmlFor="virtual-only" className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Virtual Events Only
                  </label>
                </div>
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
                      updateUrl();
                    }}
                  />
                </Badge>
              )}
              {eventType !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Type: {EVENT_TYPES.find(t => t.value === eventType)?.label || eventType}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => {
                      setEventType('all');
                      handleFilterChange();
                    }}
                  />
                </Badge>
              )}
              {virtualOnly && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Virtual Events Only
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => {
                      setVirtualOnly(false);
                      handleFilterChange();
                    }}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
