'use client';

import Link from 'next/link';
import { Clock, User, ExternalLink, GraduationCap, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database } from '@/types/db';

type OnlineCourse = Database['public']['Tables']['online_courses']['Row'];

interface CourseCardProps {
  course: OnlineCourse;
  showStats?: boolean;
}

export function CourseCard({ course }: CourseCardProps) {
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
      <CardContent className="p-0">
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          {course.image_url ? (
            <img
              src={course.image_url}
              alt={course.title}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
              <GraduationCap className="h-12 w-12 text-purple-400" />
            </div>
          )}
          
          {/* Difficulty Badge */}
          {course.difficulty_level && (
            <div className="absolute top-3 left-3">
              {getDifficultyBadge(course.difficulty_level)}
            </div>
          )}

          {/* Featured Badge */}
          {course.is_featured && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-yellow-500 text-yellow-50">
                Featured
              </Badge>
            </div>
          )}

          {/* External Link Indicator */}
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-blue-500 text-blue-50">
              <ExternalLink className="h-3 w-3 mr-1" />
              External
            </Badge>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          {/* Course Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>

          {/* Course Description */}
          {course.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {course.description}
            </p>
          )}

          {/* Course Details */}
          <div className="space-y-2 mb-4">
            {/* Instructor */}
            {course.instructor_name && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <User className="h-4 w-4" />
                <span>{course.instructor_name}</span>
              </div>
            )}

            {/* Platform */}
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <GraduationCap className="h-4 w-4" />
              <span>{course.platform_name || 'FIAP Learning Platform'}</span>
            </div>

            {/* Duration */}
            {course.duration_hours && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Clock className="h-4 w-4" />
                <span>{course.duration_hours} hours</span>
              </div>
            )}

            {/* Created Date */}
            {course.created_at && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(course.created_at)}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {course.tags && (
            <div className="flex flex-wrap gap-1 mb-4">
              {course.tags.split(',').slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link href={`/courses/${course.id}`} className="flex-1">
              <Button className="w-full" variant="outline">
                View Details
              </Button>
            </Link>
            
            <Button
              asChild
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <a 
                href={course.course_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
