'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  LucideX, 
  LucideImage, 
  LucideSmile, 
  LucideTrash2,
  LucideChevronDown,
  LucideFileText,
  LucideVideo,
  LucideAlertCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { STORAGE_BUCKETS } from '@/lib/supabase/storage-config';
import { toast } from 'sonner';
import { Database } from '@/types/db';
import Image from 'next/image';
import { StorageClient, StorageUploadResult } from '@/lib/supabase/storage-client';


interface ForumCategory {
  id: string;
  name_en: string;
  name_fr: string;
  description_en: string | null;
  description_fr: string | null;
  icon: string | null;
  color_hex: string | null;
  is_active: boolean | null;
  sort_order: number | null;
  created_at: string | null;
}
type PostMedia = {
  id: string;
  file_url: string;
  file_name: string | null;
  file_type: string | null;
  mime_type: string | null;
  storage_path: string | null;
  file_size: number | null;
}
interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Database['public']['Tables']['profiles']['Row'];
  content?: string;
  media?: PostMedia[];
  categoryId?: string;
  hashtags?: string[];
  mode?: "add" | "edit";
  postId?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];

export function CreatePostModal({ isOpen, onClose, profile, media:prop_media, content:prop_content, hashtags:prop_hashtags, mode = "add", postId, categoryId }: CreatePostModalProps) {
  const [media, setMedia] = useState<PostMedia[]>(prop_media || []);
  const [removedMedia, setRemovedMedia] = useState<PostMedia[]>([]);
  const [content, setContent] = useState(prop_content || '');
  const [hashtags, setHashtags] = useState<string[]>(prop_hashtags || []);
  const [newHashtag, setNewHashtag] = useState('');
  const [postingIn, setPostingIn] = useState<string>('');
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const searchParams = useSearchParams()
  const router = useRouter();

  const supabase = createClient();
  const storage =  useMemo(() => new StorageClient(), []);
  const queryClient = useQueryClient();

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setMedia(prop_media || []);
      setContent(prop_content || '');
      setHashtags(prop_hashtags || []);
      setSelectedFiles([]);
      setUploadErrors([]);
    }
  }, [isOpen, prop_media, prop_content, prop_hashtags]);


  const removeRemoteMedia = useCallback((index: number) => {
    const file = media[index];
    if(file) {
      setMedia(media.filter((_, i) => i !== index));
      setRemovedMedia((prev) => [...prev, file]);
    }
  }, [media]); 


  // Fetch categories on component mount
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Clear errors when modal opens
  useEffect(() => {
    if (isOpen) {
      setUploadErrors([]);
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      
      setCategories(data || []);
      // Set default category if available
      if (data && data.length > 0 && !postingIn) {
        if(categoryId) {
          const category = data.find(c => c.id === categoryId);
          if(category) {
            setPostingIn(category.id);
          } else {
            setPostingIn(data[0].id);
          }
        } else {
          setPostingIn(data[0].id);
        } 
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      
      // Validate files before upload
      const validFiles: File[] = [];
      const errors: string[] = [];

      selectedFiles.forEach(file => {
        // Check file type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          errors.push(`${file.name}: File type not allowed. Only images and videos are supported.`);
          return;
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
          errors.push(`${file.name}: File too large. Maximum size is 5MB.`);
          return;
        }

        validFiles.push(file);
      });

      setSelectedFiles(validFiles);

      // Show errors if any
      if (errors.length > 0) {
        errors.forEach(error => toast.error(error));
        setUploadErrors(prev => [...prev, ...errors]);
      }
    }
  }, []);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <LucideImage className="h-8 w-8 text-blue-500" />;
    } else if (fileType.startsWith('video/')) {
      return <LucideVideo className="h-8 w-8 text-red-500" />;
    } else {
      return <LucideFileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFilePreview = (file: File | undefined,  remoteFile?: {url: string, type: string}) => {
    if(remoteFile) {
      return  remoteFile.type.startsWith('image/') ? (
        <Image
          src={remoteFile.url}
          alt="Preview"
          width={100}
          height={100}
          className="w-full h-full object-cover rounded"
        />
      ): (
        <LucideVideo className="h-8 w-8 text-red-500" />
      );
    }
    if (file?.type.startsWith('image/')) {
      return (
        <Image
          src={URL.createObjectURL(file)}
          alt="Preview"
          width={100}
          height={100}
          className="w-full h-full object-cover rounded"
        />
      );
    } else {
      return getFileIcon(file?.type || '');
    }
  };

  const addEmoji = (emoji: string) => {
    console.log(emoji);
    setContent(prev => prev + emoji);
    setIsEmojiPickerOpen(false);
  };

  const handleAddHashtag = () => {
    if (newHashtag.trim() && !hashtags.includes(newHashtag.trim())) {
      setHashtags([...hashtags, newHashtag.trim()]);
      setNewHashtag('');
    }
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!content.trim() || !postingIn) return;

    setIsSubmitting(true);
    if(removedMedia.length){
      const promises = removedMedia.map(file => storage.deleteFile(STORAGE_BUCKETS.ORGANISATION_MEDIA, file.storage_path || ''));
      await Promise.all(promises);
    }
    const results: StorageUploadResult["data"][] = [];
    try {
      // Upload new files
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        for (const file of selectedFiles) {
          const result = await storage.uploadFile(file, STORAGE_BUCKETS.ORGANISATION_MEDIA, {
            organisationId: profile.organisation_id || '',
            userId: profile.id,
          });
          if (result.success) {
            results.push(result.data);
          } else {
            throw new Error(result.error || 'Failed to upload file');
          }
        }
        setIsUploading(false);
      }

      if (!profile?.organisation_id) {
        throw new Error('User not associated with an organisation');
      }

      if (mode === "edit") {
        // Handle edit case
        await handleEditPost(results);
      } else {
        // Handle create case
        await handleCreatePost(results);
      }

      toast.success(mode === "edit" ? 'Post updated successfully!' : 'Post created successfully!');
      
      // Invalidate posts query to refetch data
      if (profile?.organisation_id) {
        queryClient.invalidateQueries({ queryKey: ['posts', profile.organisation_id, 'forum', 'thread', 'threads', searchParams.get('category')] });
      }
      
      onClose();
      router.refresh();
    } catch (error) {
      // Clean up files if error
      if (results.length > 0) {
        const promises = results.map(result => storage.deleteFile(STORAGE_BUCKETS.ORGANISATION_MEDIA, result?.path || ''));
        await Promise.all(promises);
      }
      setSelectedFiles([]);
      console.error(`Error ${mode === "edit" ? "updating" : "creating"} post:`, error);
      toast.error(`Failed to ${mode === "edit" ? "update" : "create"} post. Please try again.`);
      
      // Invalidate posts query to ensure fresh data
      if (profile?.organisation_id) {
        queryClient.invalidateQueries({ queryKey: ['posts', profile.organisation_id] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePost = async (uploadResults: StorageUploadResult["data"][]) => {
    // Create the post
    const { data: post, error: postError } = await supabase
      .from('forum_threads')
      .insert({
        title: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        content,
        author_id: profile.id,
        organisation_id: profile.organisation_id,
        category_id: postingIn,
        tags: hashtags,
        language: 'English'
      })
      .select()
      .single();

    if (postError) throw postError;

    // Link the files to the post
    if (uploadResults.length > 0) {
      for (const result of uploadResults) {
        const { error: mediaError } = await supabase.from('forum_media').insert({
          thread_id: post.id,
          file_url: result?.publicUrl || '',
          file_name: result?.file_name,
          file_size: result?.file_size,
          file_type: result?.file_type,
          mime_type: result?.mime_type,
          alt_text: '',
          is_featured: false,
          uploaded_by: profile.id,
          storage_path: result?.path || '',
        });
        if (mediaError) throw mediaError;
      }
    }
  };

  const handleEditPost = async (uploadResults: StorageUploadResult["data"][]) => {
    if (!postId) {
      throw new Error('Post ID is required for editing');
    }

    // Update the post content, title, category, tags
    const { error: postError } = await supabase
      .from('forum_threads')
      .update({
        title: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        content,
        category_id: postingIn,
        tags: hashtags,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId);

    if (postError) throw postError;

    // Handle new media uploads
    if (uploadResults.length > 0) {
      for (const result of uploadResults) {
        const { error: mediaError } = await supabase.from('forum_media').insert({
          thread_id: postId,
          file_url: result?.publicUrl || '',
          file_name: result?.file_name,
          file_size: result?.file_size,
          file_type: result?.file_type,
          mime_type: result?.mime_type,
          alt_text: '',
          is_featured: false,
          uploaded_by: profile.id,
          storage_path: result?.path || '',
        });
        if (mediaError) throw mediaError;
      }
    }

    // Note: For now, we're not handling media deletion in edit mode
    // This would require tracking which media items were removed and deleting them
    // from both storage and database
  };

  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
    '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧',
    '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] md:min-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit post" : "Create post"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Post Content */}
          <div className="space-y-2">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Media Attachments */}
          {(selectedFiles.length > 0 || media.length > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Media Attachments ({selectedFiles.length})</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedFiles([])}
                >
                  Clear All
                </Button>
              </div>
              
              {/* Upload Errors */}
              {uploadErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-800 mb-2">
                    <LucideAlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Upload Issues</span>
                  </div>
                  <ul className="text-xs text-red-700 space-y-1">
                    {uploadErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                
                {media?.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-24 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                      {getFilePreview(undefined, {url: file.file_url, type: file.mime_type || ''})}
                      
                      {/* Upload Status Overlay */}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-white text-xs">Uploading...</div>
                        </div>
                      )}
                      
                      {uploadErrors.length > 0 && (
                        <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                          <div className="text-white text-xs text-center">
                            <LucideAlertCircle className="h-4 w-4 mx-auto mb-1" />
                            Error
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-6 w-6 rounded-full p-0"
                        onClick={() => removeRemoteMedia(index)}
                      >
                        <LucideX className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-1 truncate" title={file.file_name || ''}>
                      {file.file_name || ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.file_size || 0)}
                    </p>
                  </div>
                ))}
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-24 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                      {getFilePreview(file)}
                      
                      {/* Upload Status Overlay */}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-white text-xs">Uploading...</div>
                        </div>
                      )}
                      
                      {uploadErrors.length > 0 && (
                        <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                          <div className="text-white text-xs text-center">
                            <LucideAlertCircle className="h-4 w-4 mx-auto mb-1" />
                            Error
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-6 w-6 rounded-full p-0"
                        onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                      >
                        <LucideX className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-1 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hashtags */}
          <div className="space-y-2">
            <Label>Hashtags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {hashtags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer">
                  {tag}
                  <LucideX 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveHashtag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type hashtags"
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleAddHashtag()}
              />
              <Button variant="outline" onClick={handleAddHashtag}>
                Add
              </Button>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => document.getElementById('media-upload')?.click()}
                disabled={isSubmitting}
              >
                <LucideImage className="h-4 w-4" />
              </Button>
              <input
                id="media-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <LucideSmile className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 overflow-y-auto max-h-[300px]">
                  <div className="grid grid-cols-8 gap-2">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => addEmoji(emoji)}
                        className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <LucideTrash2 className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Posting in:</span>
                <div className="relative">
                  <select
                    value={postingIn}
                    onChange={(e) => setPostingIn(e.target.value)}
                    className="appearance-none bg-white border rounded px-3 py-1 pr-8 text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name_en}
                      </option>
                    ))}
                  </select>
                  <LucideChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <Button 
                onClick={handleSubmit} 
                disabled={!content.trim() || !postingIn || isSubmitting}
              >
                {isSubmitting ? (mode === "edit" ? 'Updating...' : 'Creating...') : (mode === "edit" ? 'Update post' : 'Create post')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
