'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, User, ExternalLink, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/types/db';
import { cn } from '@/lib/utils';

type OnlineCourse = Database['public']['Tables']['online_courses']['Row'];

interface CourseCarouselProps {
  courses: OnlineCourse[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function CourseCarousel({ 
  courses, 
  autoPlay = true, 
  autoPlayInterval = 5000 
}: CourseCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || courses.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % courses.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, courses.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % courses.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + courses.length) % courses.length);
  };

  if (courses.length === 0) {
    return null;
  }

  const getDifficultyBadge = (difficulty: string | null) => {
    if (!difficulty) return null;
    
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={colors[difficulty] || 'bg-gray-100 text-gray-800'}>
        {difficulty.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="relative w-full">
      {/* Main Carousel */}
      <div className="relative h-[500px] overflow-hidden rounded-lg">
        {courses.map((course, index) => (
          <div
            key={course.id}
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
                    {course.image_url ? (
                      <Image
                        src={course.image_url}
                        alt={course.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                        <GraduationCap className="h-16 w-16 text-purple-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Featured Badge */}
                    {course.is_featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500 text-yellow-50">
                          Featured Course
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="space-y-4">
                      {/* Difficulty Level */}
                      {course.difficulty_level && getDifficultyBadge(course.difficulty_level)}

                      {/* Course Title */}
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                        {course.title}
                      </h2>

                      {/* Course Description */}
                      {course.description && (
                        <p className="text-gray-600 text-lg leading-relaxed line-clamp-3">
                          {course.description}
                        </p>
                      )}

                      {/* Course Details */}
                      <div className="space-y-2">
                        {/* Instructor */}
                        {course.instructor_name && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="h-5 w-5" />
                            <span className="font-medium">By {course.instructor_name}</span>
                          </div>
                        )}

                        {/* Platform */}
                        <div className="flex items-center gap-2 text-gray-600">
                          <GraduationCap className="h-5 w-5" />
                          <span>{course.platform_name || 'FIAP Learning Platform'}</span>
                        </div>

                        {/* Duration */}
                        {course.duration_hours && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-5 w-5" />
                            <span>{course.duration_hours} hours</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {course.tags && (
                        <div className="flex flex-wrap gap-2">
                          {course.tags.split(',').slice(0, 4).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Link href={`/courses/${course.id}`}>
                          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                            View Course
                          </Button>
                        </Link>
                        
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                        >
                          <a 
                            href={course.course_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Start Course
                          </a>
                        </Button>
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
      {courses.length > 1 && (
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
      {courses.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {courses.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                index === currentSlide ? "bg-purple-600" : "bg-gray-300"
              )}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
