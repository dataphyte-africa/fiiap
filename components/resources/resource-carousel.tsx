'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Download, FileText, User, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/types/db';
import { cn } from '@/lib/utils';

type ResourceLibrary = Database['public']['Tables']['resource_library']['Row'];

interface ResourceCarouselProps {
  resources: ResourceLibrary[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function ResourceCarousel({ 
  resources, 
  autoPlay = true, 
  autoPlayInterval = 5000 
}: ResourceCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || resources.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % resources.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, resources.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % resources.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + resources.length) % resources.length);
  };

  if (resources.length === 0) {
    return null;
  }

  const getResourceTypeBadge = (resourceType: string | null) => {
    if (!resourceType) return null;
    
    const colors: Record<string, string> = {
      toolkit: 'bg-blue-100 text-blue-800',
      research_paper: 'bg-green-100 text-green-800',
      guide: 'bg-purple-100 text-purple-800',
      template: 'bg-orange-100 text-orange-800',
      video: 'bg-red-100 text-red-800',
      document: 'bg-yellow-100 text-yellow-800',
      report: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800',
    };

    const labels: Record<string, string> = {
      research_paper: 'Research Paper',
      other: 'Other',
    };

    return (
      <Badge className={colors[resourceType] || colors.other}>
        {labels[resourceType] || resourceType?.toUpperCase()}
      </Badge>
    );
  };

  const getResourceIcon = (resourceType: string | null) => {
    switch (resourceType) {
      case 'video':
        return <div className="text-6xl">🎥</div>;
      case 'research_paper':
        return <div className="text-6xl">📄</div>;
      case 'toolkit':
        return <div className="text-6xl">🧰</div>;
      case 'guide':
        return <div className="text-6xl">📖</div>;
      case 'template':
        return <div className="text-6xl">📋</div>;
      case 'report':
        return <div className="text-6xl">📊</div>;
      default:
        return <FileText className="h-16 w-16 text-gray-300" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="relative w-full">
      {/* Main Carousel */}
      <div className="relative h-[500px] overflow-hidden rounded-lg">
        {resources.map((resource, index) => (
          <div
            key={resource.id}
            className={cn(
              "absolute inset-0 transition-transform duration-500 ease-in-out",
              index === currentSlide ? "translate-x-0" : 
              index < currentSlide ? "-translate-x-full" : "translate-x-full"
            )}
          >
            <Card className="h-full border-0 shadow-lg">
              <CardContent className="p-0 h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                  {/* Image Section */}
                  <div className="relative h-64 md:h-full">
                    {resource.image_url ? (
                      <Image
                        src={resource.image_url}
                        alt={resource.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        {getResourceIcon(resource.resource_type)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Featured Badge */}
                    {resource.is_featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500 text-yellow-50">
                          Featured Resource
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="space-y-4">
                      {/* Resource Type */}
                      {resource.resource_type && getResourceTypeBadge(resource.resource_type)}

                      {/* Resource Title */}
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                        {resource.title}
                      </h2>

                      {/* Resource Description */}
                      {resource.description && (
                        <p className="text-gray-600 text-lg leading-relaxed line-clamp-3">
                          {resource.description}
                        </p>
                      )}

                      {/* Resource Details */}
                      <div className="space-y-2">
                        {/* Author */}
                        {resource.author_name && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="h-5 w-5" />
                            <span className="font-medium">By {resource.author_name}</span>
                          </div>
                        )}

                        {/* Created Date */}
                        {resource.created_at && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-5 w-5" />
                            <span>{formatDate(resource.created_at)}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {resource.tags && (
                        <div className="flex flex-wrap gap-2">
                          {resource.tags.split(',').slice(0, 4).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Link href={`/resources/${resource.id}`}>
                          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                            View Resource
                          </Button>
                        </Link>
                        
                        {resource.file_url && (
                          <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                          >
                            <a 
                              href={resource.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {resources.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {resources.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {resources.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                index === currentSlide ? "bg-blue-600" : "bg-gray-300"
              )}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
