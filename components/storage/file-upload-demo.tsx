'use client';

import { useState } from 'react';
import { useFileUpload } from '../../lib/hooks/use-file-upload';
import { STORAGE_BUCKETS } from '../../lib/supabase/storage-config';
import { formatFileSize } from '../../lib/supabase/storage-client';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export function FileUploadDemo() {
  const [selectedBucket, setSelectedBucket] = useState(STORAGE_BUCKETS.PROJECT_MEDIA);
  
  const { files, uploadFiles, removeFile, clearFiles, isUploading, hasErrors } = useFileUpload(
    selectedBucket,
    {
      maxFiles: 5,
      onUploadComplete: (uploadedFiles) => {
        console.log('Upload completed:', uploadedFiles);
      },
      onUploadError: (error) => {
        console.error('Upload error:', error);
      },
    }
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      uploadFiles(fileList);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'uploading': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'error': return '❌';
      case 'uploading': return '⏳';
      default: return '📄';
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Storage Upload Demo</h2>
      
      {/* Bucket Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Storage Bucket:</label>
        <select
          value={selectedBucket}
          onChange={(e) => setSelectedBucket(e.target.value as typeof selectedBucket)}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={isUploading}
        >
          {Object.entries(STORAGE_BUCKETS).map(([key, value]) => (
            <option key={key} value={value}>
              {key.replace(/_/g, ' ')} ({value})
            </option>
          ))}
        </select>
      </div>

      {/* File Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Choose Files:</label>
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          disabled={isUploading}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Upload Progress */}
      {files.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Upload Progress:</h3>
          <div className="space-y-2">
            {files.map((fileProgress, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getStatusIcon(fileProgress.status)}</span>
                  <div>
                    <p className="font-medium">{fileProgress.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(fileProgress.file.size)} • {fileProgress.file.type}
                    </p>
                    {fileProgress.error && (
                      <p className="text-sm text-red-600">{fileProgress.error}</p>
                    )}
                    {fileProgress.result?.publicUrl && (
                      <a 
                        href={fileProgress.result.publicUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View File
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getStatusColor(fileProgress.status)}`}>
                    {fileProgress.status.toUpperCase()}
                  </span>
                  {fileProgress.status !== 'uploading' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {files.length > 0 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={clearFiles}
            disabled={isUploading}
          >
            Clear All
          </Button>
          <div className="text-sm text-gray-600">
            {files.filter(f => f.status === 'completed').length}/{files.length} completed
            {hasErrors && ' (some failed)'}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="font-semibold text-blue-900 mb-2">Storage Configuration Test</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• File type validation is enabled</li>
          <li>• File size limits are enforced</li>
          <li>• Files are organized by bucket type</li>
          <li>• Public URLs are generated for public buckets</li>
          <li>• Upload progress is tracked</li>
        </ul>
      </div>
    </Card>
  );
} 