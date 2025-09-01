'use client';

import { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import "./blog-post-viewer.css";
import { useCallback, useState } from 'react';
import { HtmlImportModal } from './html-import-modal';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface BlogPostEditorProps {
  initialContent?: PartialBlock[]; // BlockNote JSON content
  onChange?: (content: PartialBlock[], html: string) => void;
  readOnly?: boolean;
  className?: string;
  showImportButton?: boolean;
}

export function BlogPostEditor({ 
  initialContent, 
  onChange, 
  readOnly = false,
  className = "",
  showImportButton = true
}: BlogPostEditorProps) {
  console.log(initialContent,'initialContent ℹ️');
  const [isImporting, setIsImporting] = useState(false);
  
  // Create the BlockNote editor
  const editor = useCreateBlockNote({
    initialContent: initialContent|| undefined,
    uploadFile: async (file: File) => {
      // TODO: Implement file upload to your storage
      // For now, return a placeholder URL
      console.log('File upload not implemented yet:', file.name);
      return 'https://via.placeholder.com/400x300?text=Image+Upload+Not+Implemented';
    },
    
  });

  // Handle editor changes
  const handleEditorChange = useCallback(async () => {
    if (!onChange || readOnly) return;

    try {
      const blocks = editor.document;
      // Use blocksToFullHTML for better styling preservation
      const html = await editor.blocksToFullHTML(blocks);
      onChange(blocks, html);
    } catch (error) {
      console.error('Error converting blocks to HTML:', error);
    }
  }, [editor, onChange, readOnly]);

  // Handle HTML import
  const handleHtmlImport = useCallback(async (html: string) => {
    if (readOnly) return;

    setIsImporting(true);
    try {
      // Parse HTML to BlockNote blocks
      const blocks = await editor.tryParseHTMLToBlocks(html);
      
      if (blocks && blocks.length > 0) {
        // Replace current content with imported blocks
        editor.replaceBlocks(editor.document, blocks);
        
        // Trigger onChange if provided
        if (onChange) {
          const newHtml = await editor.blocksToFullHTML(blocks);
          onChange(blocks, newHtml);
        }
      }
    } catch (error) {
      console.error('Error parsing HTML to blocks:', error);
      throw new Error('Failed to parse HTML content. Please check if the URL contains valid content.');
    } finally {
      setIsImporting(false);
    }
  }, [editor, onChange, readOnly]);

  // Set up the editor when it's ready
  

//   if (!isReady) {
//     return (
//       <div className={`min-h-[400px] border rounded-lg bg-gray-50 animate-pulse ${className}`}>
//         <div className="p-4 space-y-3">
//           <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//           <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//           <div className="h-4 bg-gray-200 rounded w-5/6"></div>
//         </div>
//       </div>
//     );
//   }

  return (
    <div className={`min-h-[400px] border rounded-lg overflow-hidden ${className}`}>
      {/* Import Button - Show only when not read-only and import is enabled */}
      {!readOnly && showImportButton && (
        <div className="flex justify-end p-3 border-b bg-gray-50/50">
          <HtmlImportModal 
            onImport={handleHtmlImport}
            trigger={
              <Button 
                variant="outline" 
                size="sm" 
                disabled={isImporting}
              >
                <Download className="w-4 h-4 mr-2" />
                {isImporting ? 'Importing...' : 'Import from URL'}
              </Button>
            }
          />
        </div>
      )}
      
      <BlockNoteView
        editor={editor}
        onChange={handleEditorChange}
        editable={!readOnly}
        theme="light"
        data-theming-css-variables-demo
      />
    </div>
  );
}

// Read-only viewer component for displaying blog posts
export function BlogPostViewer({ 
  content, 
  contentHtml, 
  useHtml = true,
  className = ""
}: {
  content?: PartialBlock[];
  contentHtml?: string;
  useHtml?: boolean;
  className?: string;
}) {
  if (useHtml && contentHtml) {
    // Use pre-rendered HTML with proper BlockNote container classes
    return (
      <div className={`bn-container ${className}`}>
        <div
          className="bn-default-styles blocknote-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    );
  }

  if (content && content.length > 0) {
    // Re-render from BlockNote JSON (slower but more accurate)
    return (
      <div className={`blocknote-viewer ${className}`}>
        <BlogPostEditor
          initialContent={content}
          readOnly={true}
          className="border-0"
        />
      </div>
    );
  }

  return (
    <div className={`text-gray-500 italic text-center py-8 ${className}`}>
      <div className="max-w-md mx-auto">
        <p className="text-lg mb-2">No content available</p>
        <p className="text-sm">Start writing to see your content here.</p>
      </div>
    </div>
  );
}
