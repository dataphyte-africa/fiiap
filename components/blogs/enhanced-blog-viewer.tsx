'use client';

import { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import "./blog-post-viewer.css";
import { useEffect, useState } from 'react';

interface EnhancedBlogViewerProps {
  content?: PartialBlock[] | string; // Can be JSON blocks or HTML string
  contentHtml?: string;
  className?: string;
  showEmpty?: boolean;
}

export function EnhancedBlogViewer({ 
  content, 
  contentHtml, 
  className = "",
  showEmpty = true
}: EnhancedBlogViewerProps) {
  const [parsedContent, setParsedContent] = useState<PartialBlock[] | null>(null);
  const [isContentReady, setIsContentReady] = useState(false);

  // Parse content if it's a string
  useEffect(() => {
    if (typeof content === 'string') {
      try {
        const parsed = JSON.parse(content);
        setParsedContent(Array.isArray(parsed) ? parsed : [parsed]);
      } catch (error) {
        console.error('Error parsing content JSON:', error);
        setParsedContent(null);
      }
    } else if (Array.isArray(content)) {
      setParsedContent(content);
    }
    setIsContentReady(true);
  }, [content]);

  // Create a read-only editor for JSON content
  const editor = useCreateBlockNote({
    initialContent: parsedContent || undefined,
  });

  // If we have HTML content, use it (fastest option)
  if (contentHtml && contentHtml.trim()) {
    return (
      <div className={`bn-container ${className}`}>
        <div
          className="bn-default-styles blocknote-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    );
  }

  // If we have JSON content, render with BlockNote (more accurate)
  if (isContentReady && parsedContent && parsedContent.length > 0) {
    return (
      <div className={`bn-container blocknote-viewer ${className}`}>
        <BlockNoteView
          editor={editor}
          editable={false}
          theme="light"
        />
      </div>
    );
  }

  // Show empty state if no content and showEmpty is true
  if (showEmpty) {
    return (
      <div className={`text-gray-500 italic text-center py-8 ${className}`}>
        <div className="max-w-md mx-auto">
          <p className="text-lg mb-2">No content available</p>
          <p className="text-sm">Start writing to see your content here.</p>
        </div>
      </div>
    );
  }

  return null;
}

// Hook for handling content conversion
export function useBlockNoteContent(initialContent?: PartialBlock[] | string) {
  const [content, setContent] = useState<PartialBlock[]>([]);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const editor = useCreateBlockNote({
    initialContent: content.length > 0 ? content : undefined,
  });

  // Parse initial content
  useEffect(() => {
    if (typeof initialContent === 'string') {
      try {
        const parsed = JSON.parse(initialContent);
        setContent(Array.isArray(parsed) ? parsed : [parsed]);
      } catch (error) {
        console.error('Error parsing initial content:', error);
        setContent([]);
      }
    } else if (Array.isArray(initialContent)) {
      setContent(initialContent);
    }
  }, [initialContent]);

  // Convert blocks to HTML
  const convertToHtml = async (blocks: PartialBlock[]) => {
    if (!editor || blocks.length === 0) return '';
    
    setIsLoading(true);
    try {
      const html = await editor.blocksToFullHTML(blocks);
      setHtmlContent(html);
      return html;
    } catch (error) {
      console.error('Error converting to HTML:', error);
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = async (newContent: PartialBlock[]) => {
    setContent(newContent);
    await convertToHtml(newContent);
  };

  return {
    content,
    htmlContent,
    isLoading,
    updateContent,
    convertToHtml,
    editor
  };
}
