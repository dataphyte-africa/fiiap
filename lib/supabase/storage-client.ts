import { createClient } from './client';
import { 
  StorageBucket, 
  getBucketConfig, 
  isValidFileType, 
  isValidFileSize, 
  generateFilePath 
} from './storage-config';

// Storage operation result types
export interface StorageUploadResult {
  success: boolean;
  data?: {
    path: string;
    publicUrl?: string;
    id: string;
  };
  error?: string;
}

export interface StorageDownloadResult {
  success: boolean;
  data?: Blob;
  error?: string;
}

export interface StorageDeleteResult {
  success: boolean;
  error?: string;
}

export interface StorageListResult {
  success: boolean;
  data?: Array<{
    name: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: Record<string, unknown>;
  }>;
  error?: string;
}

// Validation result interface
export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
}

// File validation function
export function validateFile(file: File, bucket: StorageBucket): FileValidationResult {
  const errors: string[] = [];
  const config = getBucketConfig(bucket);

  // Check file type
  if (!isValidFileType(file, bucket)) {
    errors.push(`Invalid file type. Allowed types: ${config.allowedFileTypes.join(', ')}`);
  }

  // Check file size
  if (!isValidFileSize(file, bucket)) {
    const maxSizeMB = Math.round(config.maxFileSize / (1024 * 1024));
    errors.push(`File too large. Maximum size: ${maxSizeMB}MB`);
  }

  // Check if file is empty
  if (file.size === 0) {
    errors.push('File is empty');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Client-side storage operations
export class StorageClient {
  private supabase = createClient();

  async uploadFile(
    file: File,
    bucket: StorageBucket,
    options?: {
      organisationId?: string;
      userId?: string;
      customPath?: string;
      upsert?: boolean;
    }
  ): Promise<StorageUploadResult> {
    try {
      // Validate file
      const validation = validateFile(file, bucket);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', '),
        };
      }

      // Generate file path
      const filePath = options?.customPath || generateFilePath(
        bucket,
        file.name,
        options?.organisationId,
        options?.userId
      );

      // Upload file
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: options?.upsert || false,
        });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Get public URL if bucket is public
      const config = getBucketConfig(bucket);
      let publicUrl: string | undefined;
      
      if (config.public) {
        const { data: urlData } = this.supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);
        publicUrl = urlData.publicUrl;
      }

      return {
        success: true,
        data: {
          path: data.path,
          publicUrl,
          id: data.id,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async downloadFile(bucket: StorageBucket, path: string): Promise<StorageDownloadResult> {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .download(path);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async deleteFile(bucket: StorageBucket, path: string): Promise<StorageDeleteResult> {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async deleteMultipleFiles(bucket: StorageBucket, paths: string[]): Promise<StorageDeleteResult> {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove(paths);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async listFiles(bucket: StorageBucket, folder?: string): Promise<StorageListResult> {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .list(folder);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  getPublicUrl(bucket: StorageBucket, path: string): string {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }

  createSignedUrl(bucket: StorageBucket, path: string, expiresIn: number = 3600): Promise<{ signedUrl: string; error?: string }> {
    return this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)
      .then(({ data, error }) => ({
        signedUrl: data?.signedUrl || '',
        error: error?.message,
      }));
  }
}



// Utility functions for file handling
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(fileName: string): string {
  return fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2);
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

export function isDocumentFile(file: File): boolean {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ];
  return documentTypes.includes(file.type);
}

// Export instances for easy use
export const storage = new StorageClient();
 