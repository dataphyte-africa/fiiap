// Storage bucket configuration for CSO Platform
export const STORAGE_BUCKETS = {
  ORGANISATION_LOGOS: 'organisation-logos',
  ORGANISATION_MEDIA: 'organisation-media', 
  PROJECT_MEDIA: 'project-media',
  PROJECT_GALLERY: 'project-gallery',
  USER_AVATARS: 'user-avatars',
  FUNDER_LOGOS: 'funder-logos',
  EVENT_ATTACHMENTS: 'event-attachments',
} as const;

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  VIDEO: 50 * 1024 * 1024, // 50MB
  AVATAR: 2 * 1024 * 1024, // 2MB
  LOGO: 2 * 1024 * 1024, // 2MB
} as const;

// Allowed file types
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'] as const,
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ] as const,
  VIDEOS: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'] as const,
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg'] as const,
} as const;

// Bucket configurations
export const BUCKET_CONFIGS = {
  [STORAGE_BUCKETS.ORGANISATION_LOGOS]: {
    public: true,
    allowedFileTypes: ALLOWED_FILE_TYPES.IMAGES,
    maxFileSize: FILE_SIZE_LIMITS.LOGO,
    description: 'Public logos for CSO organisations',
  },
  [STORAGE_BUCKETS.ORGANISATION_MEDIA]: {
    public: true,
    allowedFileTypes: [...ALLOWED_FILE_TYPES.IMAGES, ...ALLOWED_FILE_TYPES.DOCUMENTS, ...ALLOWED_FILE_TYPES.VIDEOS],
    maxFileSize: FILE_SIZE_LIMITS.DOCUMENT,
    description: 'Private media files for organisations',
  },
  [STORAGE_BUCKETS.PROJECT_MEDIA]: {
    public: true,
    allowedFileTypes: [...ALLOWED_FILE_TYPES.IMAGES, ...ALLOWED_FILE_TYPES.DOCUMENTS, ...ALLOWED_FILE_TYPES.VIDEOS],
    maxFileSize: FILE_SIZE_LIMITS.VIDEO,
    description: 'Public media files for projects',
  },
  [STORAGE_BUCKETS.PROJECT_GALLERY]: {
    public: true,
    allowedFileTypes: ALLOWED_FILE_TYPES.IMAGES,
    maxFileSize: FILE_SIZE_LIMITS.IMAGE,
    description: 'Public image galleries for projects',
  },
  [STORAGE_BUCKETS.USER_AVATARS]: {
    public: true,
    allowedFileTypes: ALLOWED_FILE_TYPES.IMAGES,
    maxFileSize: FILE_SIZE_LIMITS.AVATAR,
    description: 'Public user avatar images',
  },
  [STORAGE_BUCKETS.FUNDER_LOGOS]: {
    public: true,
    allowedFileTypes: ALLOWED_FILE_TYPES.IMAGES,
    maxFileSize: FILE_SIZE_LIMITS.LOGO,
    description: 'Public logos for funding organisations',
  },
  [STORAGE_BUCKETS.EVENT_ATTACHMENTS]: {
    public: false,
    allowedFileTypes: [...ALLOWED_FILE_TYPES.IMAGES, ...ALLOWED_FILE_TYPES.DOCUMENTS],
    maxFileSize: FILE_SIZE_LIMITS.DOCUMENT,
    description: 'Private attachments for events',
  },
} as const;

// Storage RLS policies (to be applied in Supabase dashboard or via SQL)
export const STORAGE_POLICIES = {
  // Public read policies for public buckets
  PUBLIC_READ_POLICIES: [
    STORAGE_BUCKETS.ORGANISATION_LOGOS,
    STORAGE_BUCKETS.PROJECT_MEDIA,
    STORAGE_BUCKETS.PROJECT_GALLERY,
    STORAGE_BUCKETS.USER_AVATARS,
    STORAGE_BUCKETS.FUNDER_LOGOS,
  ],
  
  // Authenticated upload policies
  AUTHENTICATED_UPLOAD_POLICIES: [
    STORAGE_BUCKETS.ORGANISATION_LOGOS,
    STORAGE_BUCKETS.PROJECT_MEDIA,
    STORAGE_BUCKETS.PROJECT_GALLERY,
    STORAGE_BUCKETS.USER_AVATARS,
    STORAGE_BUCKETS.FUNDER_LOGOS,
  ],
  
  // Restricted access policies (organisation members only)
  RESTRICTED_POLICIES: [
    STORAGE_BUCKETS.ORGANISATION_MEDIA,
    STORAGE_BUCKETS.EVENT_ATTACHMENTS,
  ],
};

// Helper function to get bucket configuration
export function getBucketConfig(bucket: StorageBucket) {
  return BUCKET_CONFIGS[bucket];
}

// Helper function to validate file type
export function isValidFileType(file: File, bucket: StorageBucket): boolean {
  const config = getBucketConfig(bucket);
  return (config.allowedFileTypes as readonly string[]).includes(file.type);
}

// Helper function to validate file size
export function isValidFileSize(file: File, bucket: StorageBucket): boolean {
  const config = getBucketConfig(bucket);
  return file.size <= config.maxFileSize;
}

// Generate file path based on bucket and organization
export function generateFilePath(
  bucket: StorageBucket,
  fileName: string,
  organisationId?: string,
  userId?: string
): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  switch (bucket) {
    case STORAGE_BUCKETS.ORGANISATION_LOGOS:
    case STORAGE_BUCKETS.ORGANISATION_MEDIA:
      return organisationId ? `${organisationId}/${timestamp}_${sanitizedFileName}` : `${timestamp}_${sanitizedFileName}`;
    
    case STORAGE_BUCKETS.PROJECT_MEDIA:
    case STORAGE_BUCKETS.PROJECT_GALLERY:
      return organisationId ? `projects/${organisationId}/${timestamp}_${sanitizedFileName}` : `projects/${timestamp}_${sanitizedFileName}`;
    
    case STORAGE_BUCKETS.USER_AVATARS:
      return userId ? `${userId}/${timestamp}_${sanitizedFileName}` : `${timestamp}_${sanitizedFileName}`;
    
    case STORAGE_BUCKETS.FUNDER_LOGOS:
      return `funders/${timestamp}_${sanitizedFileName}`;
    
    case STORAGE_BUCKETS.EVENT_ATTACHMENTS:
      return organisationId ? `events/${organisationId}/${timestamp}_${sanitizedFileName}` : `events/${timestamp}_${sanitizedFileName}`;
    
    default:
      return `${timestamp}_${sanitizedFileName}`;
  }
} 