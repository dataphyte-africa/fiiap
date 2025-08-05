// Storage-related types for the CSO Platform

export type FileType = 'image' | 'document' | 'video' | 'audio' | 'other';

export interface UploadedFile {
  id: string;
  path: string;
  publicUrl?: string;
  bucket: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy?: string;
}

export interface FileUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  result?: UploadedFile;
}

export interface StorageError {
  message: string;
  code?: string;
  details?: unknown;
}

// Database table interfaces for media storage
export interface OrganisationMedia {
  id: string;
  organisation_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: FileType;
  mime_type: string;
  caption?: string;
  alt_text?: string;
  is_logo: boolean;
  uploaded_by: string;
  uploaded_at: string;
}

export interface ProjectMedia {
  id: string;
  project_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: FileType;
  mime_type: string;
  caption?: string;
  alt_text?: string;
  is_featured: boolean;
  sort_order: number;
  uploaded_by: string;
  uploaded_at: string;
}

export interface UserAvatar {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

export interface FunderLogo {
  id: string;
  project_funder_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

// File upload hooks interface
export interface UseFileUploadOptions {
  bucket: string;
  maxFiles?: number;
  maxFileSize?: number;
  allowedTypes?: string[];
  organisationId?: string;
  userId?: string;
  onUploadComplete?: (files: UploadedFile[]) => void;
  onUploadError?: (error: StorageError) => void;
  onUploadProgress?: (progress: FileUploadProgress[]) => void;
}

export interface UseFileUploadReturn {
  files: FileUploadProgress[];
  uploadFiles: (fileList: FileList | File[]) => Promise<void>;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  isUploading: boolean;
  hasErrors: boolean;
}

// File preview interface
export interface FilePreview {
  file: File;
  url: string;
  type: FileType;
  isValid: boolean;
  errors: string[];
} 