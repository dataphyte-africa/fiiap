'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Database } from '@/types/db';
import { FundingOpportunityCard } from './funding-opportunity-card';

type FundingOpportunity = Database['public']['Tables']['funding_opportunities']['Row'];

interface FundingOpportunityCarouselProps {
  opportunities: FundingOpportunity[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function FundingOpportunityCarousel({ 
  opportunities, 
  autoPlay = true, 
  autoPlayInterval = 5000 
}: FundingOpportunityCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || opportunities.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === opportunities.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, opportunities.length]);

  const goToPrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? opportunities.length - 1 : currentIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(
      currentIndex === opportunities.length - 1 ? 0 : currentIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (opportunities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💰</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No featured funding opportunities
        </h3>
        <p className="text-gray-600">
          Check back later for featured opportunities.
        </p>
      </div>
    );
  }

  // For single opportunity, show without carousel controls
  if (opportunities.length === 1) {
    return (
      <div className="max-w-md mx-auto">
        <FundingOpportunityCard opportunity={opportunities[0]} showStats={false} />
      </div>
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Container */}
      <div className="overflow-hidden rounded-lg">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="w-full flex-shrink-0 px-2">
              <div className="max-w-md mx-auto">
                <FundingOpportunityCard opportunity={opportunity} showStats={false} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
        onClick={goToPrevious}
        aria-label="Previous opportunity"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
        onClick={goToNext}
        aria-label="Next opportunity"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-6">
        {opportunities.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentIndex
                ? 'bg-blue-600'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to opportunity ${index + 1}`}
          />
        ))}
      </div>

      {/* Opportunity Counter */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-500">
          {currentIndex + 1} of {opportunities.length} featured opportunities
        </span>
      </div>
    </div>
  );
}
