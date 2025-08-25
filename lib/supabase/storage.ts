import { createClient as createServerClient } from './server';
import { StorageDeleteResult, StorageUploadResult, validateFile } from './storage-client';
import { 
  StorageBucket, 
  getBucketConfig, 
 
  generateFilePath 
} from './storage-config';







// Server-side storage operations (for server components and API routes)
export class ServerStorageClient {
  private async getSupabase() {
    return await createServerClient();
  }

  async uploadFile(
    file: File,
    bucket: StorageBucket,
    options?: {
      organisationId?: string;
      userId?: string;
      customPath?: string;
      upsert?: boolean;
    }
  ): Promise< StorageUploadResult> {
    try {
      const supabase = await this.getSupabase();
      
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
      const { data, error } = await supabase.storage
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
        const { data: urlData } = supabase.storage
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
          file_name: file.name,
          file_size: file.size,
          file_type: file.type.split('/')[0],
          mime_type: file.type,
        },
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
      const supabase = await this.getSupabase();
      
      const { error } = await supabase.storage
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
}



// Export instances for easy use
export const serverStorage = new ServerStorageClient(); 