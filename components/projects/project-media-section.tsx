'use client';

import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Save, Upload, FileIcon, ImageIcon, VideoIcon, FileTextIcon, MusicIcon, Trash2 } from 'lucide-react';
import { ProjectMediaFormData, ProjectFullFormData, transformProjectMediaDataToInsert } from './project-form-schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storage } from '@/lib/supabase/storage-client';
import { STORAGE_BUCKETS } from '@/lib/supabase/storage-config';
import { formatFileSize } from '@/lib/supabase/storage-client';
import { updateProjectMedia } from '@/lib/data/projects';
import { toast } from 'sonner';

interface ProjectMediaSectionProps {
  onSave?: (data: ProjectMediaFormData[]) => Promise<void>;
  projectId: string;
  userId: string;
  organisationId: string;
}

export function ProjectMediaSection({ projectId, userId, organisationId }: ProjectMediaSectionProps) {
  const {
    control,
    getValues,
    setValue,
    register,
  } = useFormContext<ProjectFullFormData>();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'media',
  });

  const [uploading, setUploading] = useState<{ [key: number]: boolean }>({});
  const queryClient = useQueryClient();
  const saveMediaMutation = useMutation({
    mutationFn: async (data: ProjectMediaFormData[]) => {
      const cleanupFiles = getValues('cleanup_files') || [];
      if (cleanupFiles.length > 0) {
        await storage.deleteMultipleFiles(STORAGE_BUCKETS.PROJECT_MEDIA, cleanupFiles);
      }
      const mediaData = data.map((item, index) => transformProjectMediaDataToInsert(item, userId, projectId, index));
      await updateProjectMedia(projectId, mediaData);
    },
    onSuccess: () => {
      setValue('cleanup_files', []);
      toast.success('Media saved successfully');
      queryClient.invalidateQueries({ queryKey: ['project-related-data', projectId] });
    },
    onError: (error) => {
      console.error('Error saving media:', error);
    },
  });

  

  const handleSave = async () => {
    const mediaData = getValues('media') || [];
    const uploadPromises = mediaData.map(async (media, index) => {
      if (media.file) {
        setUploading(prev => ({ ...prev, [index]: true }));
         return storage.uploadFile(media.file, STORAGE_BUCKETS.PROJECT_MEDIA, {
          organisationId: organisationId,
          userId: userId,
          customPath: `${organisationId}/projects/${projectId}/media/${index}.${media  .file.name.split('.').pop()}`,
        });
        
      }
    });
    const uploadResults = await Promise.all(uploadPromises);
    uploadResults.forEach((result, index) => {
      if (result?.success && result.data) {
        mediaData[index].file_url = result.data.publicUrl || result.data.path;
        mediaData[index].file_size = result.data.file_size;
        mediaData[index].file = undefined
        setUploading(prev => ({ ...prev, [index]: false }));
      }
      else {
        toast.error(result?.error || 'Upload failed');
        setUploading(prev => ({ ...prev, [index]: false }));
      }
    });
    console.log(mediaData);
    saveMediaMutation.mutate(mediaData);
  };

 

  

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <VideoIcon className="h-4 w-4" />;
      case 'audio':
        return <MusicIcon className="h-4 w-4" />;
      case 'pdf':
      case 'document':
        return <FileTextIcon className="h-4 w-4" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const newMedia: ProjectMediaFormData = {
          file: files[i],
          file_type: files[i].type.split('/')[0] as 'image' | 'video' | 'audio' | 'pdf' | 'document',
          caption: '',
          is_featured: false,
          file_size: files[i].size,
          mime_type: files[i].type,
        };
        append(newMedia);
      }
    }
  };

  const handleRemoveMedia = (index: number) => {
    const media = getValues('media')?.[index];
    if (!media) return;
    if (media.file_url) {
      const filePath = storage.extractFilePathFromUrl(media.file_url);
      if (filePath) {
        setValue('cleanup_files', [...(getValues('cleanup_files') || []), filePath]);
      }
    }
    remove(index);
  };

 

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Project Media
         
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={Object.values(uploading).some(Boolean)}
              className="ml-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {saveMediaMutation.isPending ? 'Saving...' : 'Save Section'}
            </Button>
       
        </CardTitle>
        <CardDescription>
          Upload images, documents, videos, and other media files for your project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
      <label htmlFor='media-file-input' className="block text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No media files yet</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop images, documents, videos, or other files to showcase your project
            </p>
            <input
              id='media-file-input'
              type="file"
              accept="image/*,video/*,audio/*,pdf/*,document/*"
              className='hidden'
              multiple
              onChange={handleFileInputChange}
            />
            
      </label>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="border-muted">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getFileIcon(field.file?.type?.split('/')[0] || field.file_type || '')}
                      <h4 className="font-medium">Media File {index + 1}</h4>
                      {field.is_featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMedia(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    
                  {(field.file || field.file_url) && (
                    <div className="mt-4">
                      <Label>Preview</Label>
                      <div className="mt-2">
                        {(field.file?.type?.startsWith('image/') || field.file_type === 'image') ? (
                          <img
                            src={field.file ? URL.createObjectURL(field.file) : field.file_url}
                            alt={field.caption || 'Uploaded image'}
                            className="w-full max-w-md h-48 object-cover rounded-lg border"
                          />
                        ) : field.file?.type?.startsWith('video/') || field.file_type === 'video' ? (
                          <video
                            src={field.file_url}
                            controls
                            className="w-full max-w-md h-48 rounded-lg border"
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : field.file?.type?.startsWith('audio/') || field.file_type === 'audio' ? (
                          <audio
                            src={field.file_url}
                            controls
                            className="w-full max-w-md"
                          >
                            Your browser does not support the audio tag.
                          </audio>
                        ) : (
                          <div className="flex items-center gap-2 p-3 border rounded-lg max-w-md">
                            {getFileIcon(field.file?.type?.split('/')[0] || field.file_type || '')}
                            <div>
                              <p className="font-medium">{field.file?.name || "Uploaded File" }</p>
                              {field.file_size && (
                                <p className="text-sm text-muted-foreground">
                                  {formatFileSize(field.file?.size || field.file_size || 0)}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                      
                      {uploading[index] && (
                        <p className="text-sm text-blue-600 mt-1">Uploading...</p>
                      )}

                    <div>
                      <Label htmlFor={`media-caption-${index}`}>Caption</Label>
                      <Input
                        id={`media-caption-${index}`}
                        {...register(`media.${index}.caption`)}
                        placeholder="Describe this media file"
                        className='w-full'
                      />
                    </div>
                  </div>

                  

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`media-featured-${index}`}
                        checked={field.is_featured}
                        onCheckedChange={(checked) => {
                          update(index, { ...field, is_featured: !!checked });
                        }}
                      />
                      <Label htmlFor={`media-featured-${index}`} className="text-sm">
                        Featured media
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
      

        {saveMediaMutation.error && (
          <div className="text-sm text-red-600 mt-2">
            Error: {saveMediaMutation.error.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
