// Storage bucket setup utility for CSO Platform
// This script helps create storage buckets and apply policies

import { createClient } from '@supabase/supabase-js';
import { STORAGE_BUCKETS, BUCKET_CONFIGS } from '../supabase/storage-config';
const NEXT_PUBLIC_SUPABASE_URL="https://pkbzzvstzpskwdkdvmkt.supabase.co";
const NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYnp6dnN0enBza3dka2R2bWt0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMzMTkxNCwiZXhwIjoyMDY5OTA3OTE0fQ.z6OoM5dlFMMqeAITE5XCURmdSfaLUW0GGlLLvVX2kT4";
// Initialize Supabase client with service role key for admin operations
export function createAdminClient() {
  const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Create all required storage buckets
export async function createStorageBuckets() {
  const supabase = createAdminClient();
  const results = [];

  console.log('🪣 Creating storage buckets...');

  for (const bucketName of Object.values(STORAGE_BUCKETS)) {
    const config = BUCKET_CONFIGS[bucketName];
    
    try {
      // Check if bucket already exists
      const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error(`❌ Error listing buckets: ${listError.message}`);
        continue;
      }

      const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketName);

      if (bucketExists) {
        console.log(`✅ Bucket '${bucketName}' already exists`);
        results.push({ bucket: bucketName, status: 'exists', error: null });
        continue;
      }

      // Create the bucket
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: config.public,
        allowedMimeTypes: [...config.allowedFileTypes],
        fileSizeLimit: config.maxFileSize,
      });

      if (error) {
        console.error(`❌ Error creating bucket '${bucketName}': ${error.message}`);
        results.push({ bucket: bucketName, status: 'error', error: error.message });
      } else {
        console.log(`✅ Created bucket '${bucketName}' (${config.public ? 'public' : 'private'})`);
        results.push({ bucket: bucketName, status: 'created', error: null });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`❌ Unexpected error creating bucket '${bucketName}': ${errorMessage}`);
      results.push({ bucket: bucketName, status: 'error', error: errorMessage });
    }
  }

  return results;
}

// SQL policies for storage buckets
export const STORAGE_RLS_POLICIES = `
-- =====================================================
-- STORAGE RLS POLICIES FOR CSO PLATFORM
-- =====================================================

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PUBLIC READ POLICIES (for public buckets)
-- =====================================================

-- Public can view organisation logos
CREATE POLICY "Public can view organisation logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'organisation-logos');

-- Public can view project media
CREATE POLICY "Public can view project media" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-media');

-- Public can view project gallery
CREATE POLICY "Public can view project gallery" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-gallery');

-- Public can view user avatars
CREATE POLICY "Public can view user avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

-- Public can view funder logos
CREATE POLICY "Public can view funder logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'funder-logos');

-- =====================================================
-- AUTHENTICATED UPLOAD POLICIES
-- =====================================================

-- Authenticated users can upload organisation logos
CREATE POLICY "Authenticated users can upload organisation logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'organisation-logos' AND
    auth.role() = 'authenticated'
  );

-- Authenticated users can upload project media
CREATE POLICY "Authenticated users can upload project media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-media' AND
    auth.role() = 'authenticated'
  );

-- Authenticated users can upload project gallery images
CREATE POLICY "Authenticated users can upload project gallery" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-gallery' AND
    auth.role() = 'authenticated'
  );

-- Users can upload their own avatars
CREATE POLICY "Users can upload own avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-avatars' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can upload funder logos
CREATE POLICY "Authenticated users can upload funder logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'funder-logos' AND
    auth.role() = 'authenticated'
  );

-- =====================================================
-- RESTRICTED ACCESS POLICIES
-- =====================================================

-- Organisation members can access their organisation media
CREATE POLICY "Organisation members can view organisation media" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'organisation-media' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND organisation_id::text = (storage.foldername(name))[1]
    )
  );

-- Organisation members can upload to their organisation media
CREATE POLICY "Organisation members can upload organisation media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'organisation-media' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND organisation_id::text = (storage.foldername(name))[1]
    )
  );

-- Organisation members can access event attachments
CREATE POLICY "Organisation members can view event attachments" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'event-attachments' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND organisation_id::text = (storage.foldername(name))[1]
    )
  );

-- Organisation members can upload event attachments
CREATE POLICY "Organisation members can upload event attachments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'event-attachments' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND organisation_id::text = (storage.foldername(name))[1]
    )
  );

-- =====================================================
-- UPDATE AND DELETE POLICIES
-- =====================================================

-- Users can update/delete their own uploads
CREATE POLICY "Users can update own uploads" ON storage.objects
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND
    owner = auth.uid()
  );

CREATE POLICY "Users can delete own uploads" ON storage.objects
  FOR DELETE USING (
    auth.role() = 'authenticated' AND
    owner = auth.uid()
  );

-- Admins can manage all files
CREATE POLICY "Admins can manage all files" ON storage.objects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
`;

// Function to apply storage policies
export async function applyStoragePolicies() {
  console.log('🔒 Storage policies need to be applied manually in Supabase SQL Editor:');
  console.log('---');
  console.log(STORAGE_RLS_POLICIES);
  console.log('---');
  console.log('📝 Copy the above SQL and run it in your Supabase SQL Editor');
  
  return {
    message: 'Policies ready to apply',
    sql: STORAGE_RLS_POLICIES
  };
}

// Main setup function
export async function setupStorage() {
  console.log('🚀 Setting up CSO Platform storage...\n');

  try {
    // Step 1: Create buckets
    const bucketResults = await createStorageBuckets();
    
    // Step 2: Display policy instructions
    console.log('\n📋 Bucket Creation Summary:');
    bucketResults.forEach(result => {
      const status = result.status === 'created' ? '✅ Created' : 
                    result.status === 'exists' ? '💡 Exists' : '❌ Error';
      console.log(`  ${status}: ${result.bucket}${result.error ? ` (${result.error})` : ''}`);
    });

    console.log('\n🔒 Next Steps:');
    const policyResult = applyStoragePolicies();
    
    return {
      buckets: bucketResults,
      policies: policyResult
    };
  } catch (error) {
    console.error('❌ Setup failed:', error);
    throw error;
  }
}

// Export for use in scripts
export { STORAGE_BUCKETS, BUCKET_CONFIGS };

// If running directly
if (require.main === module) {
  setupStorage()
    .then(() => {
      console.log('\n✅ Storage setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Storage setup failed:', error);
      process.exit(1);
    });
} 