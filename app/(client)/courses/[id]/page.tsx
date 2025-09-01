import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ExternalLink, 
  GraduationCap, 
  User, 
  Calendar,
  Clock,
  Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShareModal } from '@/components/ui/share-modal';
import { CourseGrid } from '@/components/courses/course-grid';
import { CourseGridSkeleton } from '@/components/courses/course-skeleton';
import { getCourseById, getPublicCourses } from '@/lib/data/public-content';

interface CoursePageProps {
  params: Promise< {
    id: string;
  }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const {id} = await params;
  const course = await getCourseById(id);

  if (!course) {
    return {
      title: 'Course Not Found | FIIAP',
      description: 'The requested course could not be found.',
    };
  }

  return {
    title: `${course.title} | FIIAP Courses`,
    description: course.description || `Learn with ${course.title} - an online course from FIAP`,
    openGraph: {
      title: course.title,
      description: course.description || `Learn with ${course.title} - an online course from FIAP`,
      type: 'article',
      images: course.image_url ? [
        {
          url: course.image_url,
          alt: course.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.description || `Learn with ${course.title} - an online course from FIAP`,
      images: course.image_url ? [course.image_url] : undefined,
    },
  };
}

async function RelatedCourses({ currentCourseId, difficulty }: { currentCourseId: string; difficulty: string | null }) {
  try {
    const { data: relatedCourses } = await getPublicCourses({
      type: difficulty || undefined,
      limit: 3,
    });

    const filtered = relatedCourses.filter(course => course.id !== currentCourseId);

    if (filtered.length === 0) {
      return null;
    }

    return (
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Related Courses
        </h2>
        <CourseGrid courses={filtered} showStats={false} />
      </section>
    );
  } catch (error) {
    console.error('Error fetching related courses:', error);
    return null;
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const {id} = await params;
  const course = await getCourseById(id);

  if (!course) {
    notFound();
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/courses" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
        </div>
      </div>

      {/* Course Header */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          {/* Course Difficulty and Status */}
          <div className="flex items-center gap-3 mb-6">
            {course.difficulty_level && getDifficultyBadge(course.difficulty_level)}
            {course.is_featured && (
              <Badge className="bg-yellow-500 text-yellow-50">
                Featured Course
              </Badge>
            )}
            <Badge className="bg-blue-500 text-blue-50">
              <ExternalLink className="h-3 w-3 mr-1" />
              External Course
            </Badge>
          </div>

          {/* Course Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {course.title}
          </h1>

          {/* Course Description */}
          {course.description && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {course.description}
            </p>
          )}

          {/* Course Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Instructor */}
            {course.instructor_name && (
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Instructor</h3>
                  <p className="text-gray-600">{course.instructor_name}</p>
                </div>
              </div>
            )}

            {/* Platform */}
            <div className="flex items-start gap-3">
              <GraduationCap className="h-5 w-5 text-purple-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Platform</h3>
                <p className="text-gray-600">{course.platform_name || 'FIAP Learning Platform'}</p>
              </div>
            </div>

            {/* Duration */}
            {course.duration_hours && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Duration</h3>
                  <p className="text-gray-600">{course.duration_hours} hours</p>
                </div>
              </div>
            )}

            {/* Added Date */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-orange-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Added</h3>
                <p className="text-gray-600">{formatDate(course.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {course.tags && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.split(',').map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 py-4 border-y border-gray-200">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <a href={course.course_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Start Course
              </a>
            </Button>

            <Button asChild variant="outline" size="lg">
              <a href={course.course_url} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2" />
                Visit Course Page
              </a>
            </Button>

            <ShareModal
              title={course.title}
              url={`/courses/${course.id}`}
              description={course.description || undefined}
            />
          </div>
        </header>

        {/* Course Image */}
        <div className="mb-8">
          {course.image_url ? (
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
              <Image
                src={course.image_url}
                alt={course.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                priority
              />
            </div>
          ) : (
            <div className="h-64 md:h-96 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-24 w-24 text-purple-400" />
            </div>
          )}
        </div>

        {/* Course Information */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              About This Course
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Difficulty Level</h4>
                <p className="text-gray-600 capitalize">
                  {course.difficulty_level || 'Not specified'}
                </p>
              </div>
              
              {course.instructor_name && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Instructor</h4>
                  <p className="text-gray-600">{course.instructor_name}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Platform</h4>
                <p className="text-gray-600">{course.platform_name || 'FIAP Learning Platform'}</p>
              </div>
              
              {course.duration_hours && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Estimated Duration</h4>
                  <p className="text-gray-600">{course.duration_hours} hours</p>
                </div>
              )}
            </div>

            {/* Course Access Section */}
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-purple-900">Ready to Start Learning?</h4>
                  <p className="text-sm text-purple-700">
                    This course is hosted on an external platform. Click the button to access the full course content.
                  </p>
                </div>
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <a href={course.course_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Start Course
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </article>

      {/* Related Courses */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<CourseGridSkeleton count={3} />}>
            <RelatedCourses 
              currentCourseId={course.id || ''} 
              difficulty={course.difficulty_level} 
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
