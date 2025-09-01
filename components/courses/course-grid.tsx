import { CourseCard } from './course-card';
import { Database } from '@/types/db';

type OnlineCourse = Database['public']['Tables']['online_courses']['Row'];

interface CourseGridProps {
  courses: OnlineCourse[];
  showStats?: boolean;
}

export function CourseGrid({ courses, showStats = true }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎓</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No courses found
        </h3>
        <p className="text-gray-600">
          Check back later for new online courses and training programs from our community.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard 
          key={course.id} 
          course={course} 
          showStats={showStats}
        />
      ))}
    </div>
  );
}
