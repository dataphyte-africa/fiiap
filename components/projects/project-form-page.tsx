'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Save,
    
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Upload,
    Calendar,
    Target,
    Info,
} from 'lucide-react';
import {
    projectFullFormSchema,
    ProjectFullFormData,
    transformProjectDataToInsert,
    transformProjectMediaDataToInsert,
    transformProjectEventDataToInsert,
    transformProjectMilestoneDataToInsert,
} from './project-form-schemas';
import { ProjectBasicInfoSection } from './project-basic-info-section';
import { ProjectMediaSection } from './project-media-section';
import { ProjectEventsSection } from './project-events-section';
import { ProjectMilestonesSection } from './project-milestones-section';
import { createClient } from '@/lib/supabase/client';
import { getProjectById, updateProjectMedia } from '@/lib/data/projects';
import { storage } from '@/lib/supabase/storage-client';
import { STORAGE_BUCKETS } from '@/lib/supabase/storage-config';

interface ProjectFormPageProps {
    projectId: string;
    organisationId: string;
    userId: string;
    isEditing?: boolean;
    mode?: 'create' | 'edit';
}

type TabId = 'basic' | 'media' | 'events' | 'milestones';

interface TabInfo {
    id: TabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
}

const TABS: TabInfo[] = [
    {
        id: 'basic',
        label: 'Basic Info',
        icon: Info,
        description: 'Project details, timeline, and contact information',
    },
    {
        id: 'media',
        label: 'Media',
        icon: Upload,
        description: 'Images, documents, videos, and other files',
    },
    {
        id: 'events',
        label: 'Events',
        icon: Calendar,
        description: 'Workshops, meetings, and project activities',
    },
    {
        id: 'milestones',
        label: 'Milestones',
        icon: Target,
        description: 'Key milestones and deliverables',
    },
];

export function ProjectFormPage({
    projectId,
    organisationId,
    userId,
    isEditing = true,
}: ProjectFormPageProps) {
    const [activeTab, setActiveTab] = useState<TabId>('basic');
    // const [savedSections, setSavedSections] = useState<Set<TabId>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    const methods = useForm({
        resolver: zodResolver(projectFullFormSchema),
        defaultValues: {
            project: {
                title: '',
                summary: '',
                description: '',
                status: 'planning' as const,
                location: '',
                start_date: '',
                end_date: '',
                budget: undefined,
                currency: 'USD',
                beneficiaries_count: undefined,
                contact_person: '',
                contact_email: '',
                contact_phone: '',
                project_website: '',
                public_visibility: true,
                objectives: [],
                outcomes: [],
                sdg_goals: [],
                featured: false,
                featured_image_url: '',
                gallery_images: [],
                documents_urls: [],
            },
            media: [],
            events: [],
            milestones: [],
        },
    });

    const {
        reset,
        handleSubmit,
        formState: { isDirty },
    } = methods;

    // Load existing project data if editing
    const { data: existingProject, isLoading: loadingProject } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => getProjectById(projectId!),
        enabled: isEditing && !!projectId,
    });

    // Load related data (media, events, milestones) if editing
    const { data: relatedData, isLoading: loadingRelatedData } = useQuery({
        queryKey: ['project-related-data', projectId],
        queryFn: async () => {
            if (!projectId) return null;

            const supabase = createClient();

            const [mediaResult, eventsResult, milestonesResult] =
                await Promise.all([
                    supabase
                        .from('project_media')
                        .select('*')
                        .eq('project_id', projectId)
                        .order('sort_order'),
                    supabase
                        .from('project_events')
                        .select('*')
                        .eq('project_id', projectId)
                        .order('event_date'),
                    supabase
                        .from('project_milestones')
                        .select('*')
                        .eq('project_id', projectId)
                        .order('sort_order'),
                ]);

            return {
                media: mediaResult.data || [],
                events: eventsResult.data || [],
                milestones: milestonesResult.data || [],
            };
        },
        enabled: isEditing && !!projectId,
    });

    // Populate form with existing data
    useEffect(() => {
        if (existingProject || relatedData) {
            const formData: ProjectFullFormData = {
                project: {
                    title: existingProject?.title || '',
                    summary: existingProject?.summary || '',
                    description: existingProject?.description || '',
                    status: existingProject?.status || 'planning',
                    location: existingProject?.location || '',
                    start_date: existingProject?.start_date || '',
                    end_date: existingProject?.end_date || '',
                    budget: existingProject?.budget || undefined,
                    currency: existingProject?.currency || 'USD',
                    beneficiaries_count:
                        existingProject?.beneficiaries_count || undefined,
                    contact_person: existingProject?.contact_person || '',
                    contact_email: existingProject?.contact_email || '',
                    contact_phone: existingProject?.contact_phone || '',
                    project_website: existingProject?.project_website || '',
                    public_visibility:
                        existingProject?.public_visibility || true,
                    objectives: existingProject?.objectives || [],
                    outcomes: existingProject?.outcomes || [],
                    sdg_goals: existingProject?.sdg_goals || [],
                    featured: existingProject?.featured || false,
                    featured_image_url:
                        existingProject?.featured_image_url || '',
                    gallery_images: existingProject?.gallery_images || [],
                    documents_urls: existingProject?.documents_urls || [],
                },
                media:
                    relatedData?.media.map((item) => ({
                        project_id: item.project_id,
                        file_url: item.file_url,
                        file_name: item.file_name || '',
                        file_size: item.file_size || undefined,
                        file_type:
                            (item.file_type as
                                | 'image'
                                | 'pdf'
                                | 'video'
                                | 'audio'
                                | 'document'
                                | 'other') || undefined,
                        mime_type: item.mime_type || '',
                        caption: item.caption || '',
                        alt_text: item.alt_text || '',
                        is_featured: item.is_featured || false,
                        sort_order: item.sort_order || 0,
                    })) || [],
                events: relatedData?.events.map((item) => ({
                    project_id: item.project_id,
                    title: item.title,
                    description: item.description || '',
                    event_type: item.event_type || '',
                    event_date: item.event_date,
                    event_end_date: item.event_end_date || '',
                    event_location: item.event_location || '',
                    venue_details: item.venue_details || {} as string,
                    is_virtual: !!item.is_virtual,
                    meeting_link: item.meeting_link || '',
                    registration_link: item.registration_link || '',
                    registration_deadline: item.registration_deadline || '',
                    max_participants: item.max_participants || undefined,
                    current_participants: item.current_participants || 0,
                    event_status: item.event_status || 'scheduled',
                    attachments: item.attachments as Record<string, unknown>[] || [],
                    contact_person: item.contact_person || '',
                    contact_email: item.contact_email || '',
                    tags: item.tags || [],
                })),
                milestones: relatedData?.milestones.map((item) => ({
                    project_id: item.project_id,
                    title: item.title,
                    description: item.description || '',
                    due_date: item.due_date || '',
                    completion_date: item.completion_date || '',
                    status: item.status || 'planned',
                    progress_percentage: item.progress_percentage || 0,
                    deliverables: item.deliverables || [],
                    notes: item.notes || '',
                    evidence_urls: item.evidence_urls || [],
                    sort_order: item.sort_order || 0,
                })),
            };

            reset(formData);
        }
    }, [existingProject, relatedData, reset]);

    console.log(methods.getValues(), 'methods.getValues()');

    const saveProjectMutation = useMutation({
        mutationFn: async (data: ProjectFullFormData) => {
            const supabase = createClient();

            //  update project
            const projectData = transformProjectDataToInsert(
                data.project,
                organisationId,
                userId
            );
            const { error: updateError } = await supabase
                .from('projects')
                .update(projectData)
                .eq('id', projectId);

            if (updateError) throw updateError;

            // Save media
            const mediaData = data.media || [];
            if (mediaData.length > 0) {
                const uploadPromises = mediaData.map(async (media, index) => {
                    if (media.file) {
                        return storage.uploadFile(
                            media.file,
                            STORAGE_BUCKETS.PROJECT_MEDIA,
                            {
                                organisationId: organisationId,
                                userId: userId,
                                customPath: `${organisationId}/projects/${projectId}/media/${index}.${media.file.name
                                    .split('.')
                                    .pop()}`,
                            }
                        );
                    }
                });
                const uploadResults = await Promise.all(uploadPromises);
                uploadResults.forEach((result, index) => {
                    if (result?.success && result.data) {
                        mediaData[index].file_url =
                            result.data.publicUrl || result.data.path;
                        mediaData[index].file_size = result.data.file_size;
                        mediaData[index].file = undefined;
                    }
                });
                const mediaDataToInsert = mediaData.map((item, index) =>
                    transformProjectMediaDataToInsert(
                        item,
                        userId,
                        projectId,
                        index
                    )
                );
                await updateProjectMedia(projectId, mediaDataToInsert);
            }

            // Save events
            if (data.events && data.events.length > 0) {
                // Delete existing events if editing
                if (isEditing && projectId) {
                    await supabase
                        .from('project_events')
                        .delete()
                        .eq('project_id', projectId);
                }

                const eventsData = data.events.map((item) =>
                    transformProjectEventDataToInsert({
                        ...item,
                        project_id: projectId,
                    })
                );
                const { error: eventsError } = await supabase
                    .from('project_events')
                    .insert(eventsData);
                if (eventsError) throw eventsError;
            }

            // Save milestones
            if (data.milestones && data.milestones.length > 0) {
                // Delete existing milestones if editing
                if (isEditing && projectId) {
                    await supabase
                        .from('project_milestones')
                        .delete()
                        .eq('project_id', projectId);
                }

                const milestonesData = data.milestones.map((item) =>
                    transformProjectMilestoneDataToInsert(
                        { ...item, project_id: projectId },
                        userId
                    )
                );
                const { error: milestonesError } = await supabase
                    .from('project_milestones')
                    .insert(milestonesData);
                if (milestonesError) throw milestonesError;
            }

            // Delete cleanup files
            if (data.cleanup_files && data.cleanup_files.length > 0) {
                await storage.deleteMultipleFiles(STORAGE_BUCKETS.PROJECT_MEDIA, data.cleanup_files);
            }

            return projectId;
        },
        onSuccess: (savedProjectId) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({
                queryKey: ['project', savedProjectId],
            });

            // Redirect to project detail page
            router.push(`/dashboard/projects/${savedProjectId}`);
        },
        onError: (error) => {
            console.error('Error saving project:', error);
        },
    });

   

    const onSubmit = async (data: ProjectFullFormData) => {
        setIsSubmitting(true);
        try {
            await saveProjectMutation.mutateAsync(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextTab = () => {
        const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);
        if (currentIndex < TABS.length - 1) {
            setActiveTab(TABS[currentIndex + 1].id);
        }
    };

    const prevTab = () => {
        const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);
        if (currentIndex > 0) {
            setActiveTab(TABS[currentIndex - 1].id);
        }
    };

    

    const isLoading = loadingProject || loadingRelatedData;

    if (isLoading) {
        return (
            <div className="container mx-auto py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-muted rounded w-1/3"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-32 bg-muted rounded"
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">
                                {isEditing
                                    ? 'Edit Project'
                                    : 'Create New Project'}
                            </h1>
                            <p className="text-muted-foreground">
                                {isEditing
                                    ? 'Update your project information, media, events, and milestones'
                                    : 'Fill out the form sections below to create a comprehensive project profile'}
                            </p>
                        </div>
                    </div>

                    {/* Progress */}
                    {/* <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                    Form Completion
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {savedSections.size}/{TABS.length} sections
                                    saved
                                </span>
                            </div>
                            <Progress
                                value={getCompletionPercentage()}
                                className="h-2"
                            />
                        </CardContent>
                    </Card> */}
                </div>

                {/* Form */}
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <Tabs
                            value={activeTab}
                            onValueChange={(value) =>
                                setActiveTab(value as TabId)
                            }
                        >
                            <TabsList className="grid w-full grid-cols-4">
                                {TABS.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <TabsTrigger
                                            key={tab.id}
                                            value={tab.id}
                                            className="flex items-center gap-2"
                                        >
                                            <Icon className="h-4 w-4" />
                                            <span className="hidden sm:inline">
                                                {tab.label}
                                            </span>
                                           
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>

                            <TabsContent value="basic" className="mt-6">
                                <ProjectBasicInfoSection
                                    isEditing={isEditing}
                                    projectId={projectId}
                                    userId={userId}
                                    organisationId={organisationId}
                                />
                            </TabsContent>

                            <TabsContent value="media" className="mt-6">
                                <ProjectMediaSection
                                   
                                    projectId={projectId}
                                    userId={userId}
                                    organisationId={organisationId}
                                />
                            </TabsContent>

                            <TabsContent value="events" className="mt-6">
                                <ProjectEventsSection
                                    
                                    isEditing={isEditing}
                                    projectId={projectId}
                                />
                            </TabsContent>

                            <TabsContent value="milestones" className="mt-6">
                                <ProjectMilestonesSection
                                    isEditing={isEditing}
                                    projectId={projectId}
                                />
                            </TabsContent>
                        </Tabs>

                        {/* Navigation and Submit */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={prevTab}
                                            disabled={activeTab === 'basic'}
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Previous
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={nextTab}
                                            disabled={
                                                activeTab === 'milestones'
                                            }
                                        >
                                            Next
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {isDirty && (
                                            <Alert className="w-auto">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription className="text-sm">
                                                    You have unsaved changes
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={
                                                isSubmitting ||
                                                saveProjectMutation.isPending
                                            }
                                            className="min-w-[120px]"
                                        >
                                            {isSubmitting ||
                                            saveProjectMutation.isPending ? (
                                                'Saving...'
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    {isEditing
                                                        ? 'Update Project'
                                                        : 'Create Project'}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {saveProjectMutation.error && (
                                    <Alert className="mt-4">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Error:{' '}
                                            {saveProjectMutation.error.message}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
