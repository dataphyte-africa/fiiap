'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Clock,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  GraduationCap,
  Plus,
  Search,
  Star,
  StarOff,
  Trash2,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { getOnlineCourses, deleteCourse, updateCourse, type OnlineCourseFilters } from '@/lib/data/admin-content';
import { CourseForm } from './course-form';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { OnlineCourseFormData } from '@/lib/schemas/admin-content-schemas';
import { Database } from '@/types/db';

type DBCourse = Database['public']['Tables']['online_courses']['Row'];

export function CoursesTable() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<OnlineCourseFilters>({
    page: 1,
    limit: 20,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('all');

  // Modal states
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    courseData?: DBCourse;
  }>({
    isOpen: false,
    mode: 'create',
    courseData: undefined,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    courseId: string | null;
    courseTitle: string;
  }>({
    isOpen: false,
    courseId: null,
    courseTitle: '',
  });

  // Fetch courses with React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['courses', filters, searchTerm, selectedDifficulty, selectedVisibility],
    queryFn: () => getOnlineCourses({
      ...filters,
      search: searchTerm || undefined,
      difficulty_level: selectedDifficulty === 'all' ? undefined : selectedDifficulty,
      is_visible: selectedVisibility === 'all' ? undefined : selectedVisibility === 'visible',
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted successfully!');
      setDeleteModal({ isOpen: false, courseId: null, courseTitle: '' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete course');
    },
  });

  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: ({ id, is_visible }: { id: string; is_visible: boolean }) =>
      updateCourse(id, { is_visible }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course visibility updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update visibility');
    },
  });

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, is_featured }: { id: string; is_featured: boolean }) =>
      updateCourse(id, { is_featured }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course featured status updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update featured status');
    },
  });

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleDifficultyFilter = useCallback((difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleVisibilityFilter = useCallback((visibility: string) => {
    setSelectedVisibility(visibility);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleSort = useCallback((sortBy: OnlineCourseFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handleEdit = (course: DBCourse) => {
    setFormModal({
      isOpen: true,
      mode: 'edit',
      courseData: course,
    });
  };

  const handleDelete = (course: DBCourse) => {
    setDeleteModal({
      isOpen: true,
      courseId: course.id || null,
      courseTitle: course.title,
    });
  };

  const handleToggleVisibility = (course: DBCourse) => {
    toggleVisibilityMutation.mutate({
      id: course.id || '',
      is_visible: !course.is_visible,
    });
  };

  const handleToggleFeatured = (course: DBCourse) => {
    toggleFeaturedMutation.mutate({
      id: course.id || '',
      is_featured: !course.is_featured,
    });
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={colors[difficulty] || 'bg-gray-100 text-gray-800'}>
        {difficulty?.toUpperCase()}
      </Badge>
    );
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-600 mb-4">Failed to load courses</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Online Courses</h2>
          <p className="text-muted-foreground">
            Manage links to online courses and training programs
          </p>
        </div>
        <Button onClick={() => setFormModal({ isOpen: true, mode: 'create' })}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedDifficulty} onValueChange={handleDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedVisibility} onValueChange={handleVisibilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              {data?.count || 0} courses found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('title')}
                >
                  Course {filters.sortBy === 'title' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Instructor/Platform</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('created_at')}
                >
                  Created {filters.sortBy === 'created_at' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </TableCell>
                    <TableCell className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No courses found
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {course.image_url ? (
                          <img
                            src={course.image_url}
                            alt={course.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                            <GraduationCap className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-muted-foreground ellipsis line-clamp-1">
                            {course.description?.substring(0, 30)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col gap-1'>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {course.instructor_name || 'Not specified'}
                        </span>
                      </div>
                      <span className="text-sm">
                        {course.platform_name || 'FIAP Learning Platform'}
                      </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {course.duration_hours ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {course.duration_hours}h
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {course.difficulty_level ? (
                        getDifficultyBadge(course.difficulty_level)
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {course.created_at ? format(new Date(course.created_at), 'MMM dd, yyyy') : 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={course.is_visible ? 'default' : 'secondary'}>
                          {course.is_visible ? 'Visible' : 'Hidden'}
                        </Badge>
                        {course.is_featured && (
                          <Badge variant="outline" className="w-fit">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      
                        <div className='flex items-center gap-2'>
                          <Tooltip>
                            <TooltipContent>View Course</TooltipContent>
                            <TooltipTrigger asChild>
                          <Button asChild size="icon" variant="outline">
                            <a 
                              href={course.course_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              <ExternalLink className="h-4 w-4" />

                            </a>
                          </Button>
                          </TooltipTrigger>
                          </Tooltip>
                          <Tooltip>
                            <TooltipContent>Edit Course</TooltipContent>
                            <TooltipTrigger asChild>
                          <Button onClick={() => handleEdit(course)} size="icon" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          </TooltipTrigger>
                          </Tooltip>
                          <Tooltip>
                            <TooltipContent>{course.is_visible ? 'Hide' : 'Show'} Course</TooltipContent>
                            <TooltipTrigger asChild>
                          <Button onClick={() => handleToggleVisibility(course)} size="icon" variant="outline">
                            {course.is_visible ? (
                              <><EyeOff className="h-4 w-4" /> </>
                            ) : (
                              <><Eye className="h-4 w-4" /> </>
                            )}
                          </Button>
                          </TooltipTrigger>
                          </Tooltip>
                          <Tooltip>
                            <TooltipContent>{course.is_featured ? 'Unfeature' : 'Feature'} Course</TooltipContent>
                            <TooltipTrigger asChild>
                         
                          <Button onClick={() => handleToggleFeatured(course)} size="icon" variant="outline">
                            {course.is_featured ? (
                              <><StarOff className="h-4 w-4" /> </>
                            ) : (
                              <><Star className="h-4 w-4" /> </>
                            )}
                          </Button>
                          </TooltipTrigger>
                          </Tooltip>
                          <Tooltip>
                            <TooltipContent>Delete Course</TooltipContent>
                            <TooltipTrigger asChild>
                          <Button onClick={() => handleDelete(course)} className="text-red-600" size="icon" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>   
                          </TooltipTrigger>
                          </Tooltip>
                        </div>
                      
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(filters.page! - 1)}
            disabled={!data.hasPrevPage}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {data.currentPage} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(filters.page! + 1)}
            disabled={!data.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}

      {/* Form Modal */}
      <Dialog open={formModal.isOpen} onOpenChange={(open) => setFormModal({ ...formModal, isOpen: open })}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <CourseForm
            initialData={formModal.courseData as OnlineCourseFormData & { id?: string }}
            mode={formModal.mode}
            onSuccess={() => setFormModal({ isOpen: false, mode: 'create', courseData: undefined })}
            onCancel={() => setFormModal({ isOpen: false, mode: 'create', courseData: undefined })}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal.isOpen} onOpenChange={(open) => setDeleteModal({ ...deleteModal, isOpen: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteModal.courseTitle}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, courseId: null, courseTitle: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteModal.courseId && deleteMutation.mutate(deleteModal.courseId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
