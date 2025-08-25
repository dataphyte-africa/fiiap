'use client';

import { useState, useCallback } from 'react';
import { storage, validateFile } from '../supabase/storage-client';
import { StorageBucket } from '../supabase/storage-config';
import type { FileUploadProgress, UseFileUploadOptions, UseFileUploadReturn } from '../../types/storage';

export function useFileUpload(
  bucket: StorageBucket,
  options: Omit<UseFileUploadOptions, 'bucket'> = {},
  customPath?: string
): UseFileUploadReturn {
  const [files, setFiles] = useState<FileUploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = useCallback(async (fileList: FileList | File[]) => {
    const fileArray = Array.from(fileList);
    
    // Validate max files limit
    if (options.maxFiles && files.length + fileArray.length > options.maxFiles) {
      options.onUploadError?.({
        message: `Maximum ${options.maxFiles} files allowed`,
        code: 'MAX_FILES_EXCEEDED'
      });
      return;
    }

    // Initialize file progress states
    const newFiles: FileUploadProgress[] = fileArray.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }));

    setFiles(prev => [...prev, ...newFiles]);
    setIsUploading(true);

    try {
      // Upload files sequentially to avoid overwhelming the server
      for (let i = 0; i < newFiles.length; i++) {
        const fileProgress = newFiles[i];
        const { file } = fileProgress;

        // Update status to uploading
        setFiles(prev => prev.map((f, index) => 
          index === files.length + i 
            ? { ...f, status: 'uploading' as const, progress: 0 }
            : f
        ));

        // Validate file
        const validation = validateFile(file, bucket);
        if (!validation.isValid) {
          setFiles(prev => prev.map((f, index) => 
            index === files.length + i 
              ? { ...f, status: 'error' as const, error: validation.errors.join(', ') }
              : f
          ));
          continue;
        }

        try {
          // Upload the file
          const result = await storage.uploadFile(file, bucket, {
            organisationId: options.organisationId,
            userId: options.userId,
            customPath: customPath,
          });

          if (result.success && result.data) {
            // Success
            setFiles(prev => prev.map((f, index) => 
              index === files.length + i 
                ? { 
                    ...f, 
                    status: 'completed' as const, 
                    progress: 100,
                    result: {
                      id: result.data!.id,
                      path: result.data!.path,
                      publicUrl: result.data!.publicUrl,
                      bucket,
                      fileName: file.name,
                      fileSize: file.size,
                      mimeType: file.type,
                      uploadedAt: new Date(),
                    }
                  }
                : f
            ));
          } else {
            // Upload failed
            setFiles(prev => prev.map((f, index) => 
              index === files.length + i 
                ? { ...f, status: 'error' as const, error: result.error || 'Upload failed' }
                : f
            ));
          }
        } catch (error) {
          setFiles(prev => prev.map((f, index) => 
            index === files.length + i 
              ? { 
                  ...f, 
                  status: 'error' as const, 
                  error: error instanceof Error ? error.message : 'Upload failed' 
                }
              : f
          ));
        }
      }

      // Call completion callback with successful uploads
      const completedFiles = files
        .filter(f => f.status === 'completed' && f.result)
        .map(f => f.result!);
      
      if (completedFiles.length > 0) {
        options.onUploadComplete?.(completedFiles);
      }

    } catch (error) {
      options.onUploadError?.({
        message: error instanceof Error ? error.message : 'Upload failed',
        code: 'UPLOAD_ERROR',
        details: error
      });
    } finally {
      setIsUploading(false);
    }
  }, [bucket, files, options, customPath]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const hasErrors = files.some(f => f.status === 'error');

  return {
    files,
    uploadFiles,
    removeFile,
    clearFiles,
    isUploading,
    hasErrors,
  };
}

// Additional hook for single file upload
export function useSingleFileUpload(
  bucket: StorageBucket,
  options: Omit<UseFileUploadOptions, 'bucket' | 'maxFiles'> = {}
) {
  const { files, uploadFiles, clearFiles, isUploading, hasErrors } = useFileUpload(bucket, {
    ...options,
    maxFiles: 1,
  });

  const uploadFile = useCallback(async (file: File) => {
    clearFiles();
    await uploadFiles([file]);
  }, [uploadFiles, clearFiles]);

  const file = files[0] || null;

  return {
    file,
    uploadFile,
    clearFile: clearFiles,
    isUploading,
    hasError: hasErrors,
  };
} 