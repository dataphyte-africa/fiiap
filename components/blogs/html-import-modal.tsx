'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert } from '@/components/ui/alert';
import { Loader2, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { importHtmlFromUrl, ImportHtmlResult } from '@/lib/actions/import-html';

interface HtmlImportModalProps {
  onImport: (html: string) => Promise<void>;
  trigger?: React.ReactNode;
}

export function HtmlImportModal({ onImport, trigger }: HtmlImportModalProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportHtmlResult | null>(null);

  const handleImport = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const importResult = await importHtmlFromUrl(url.trim());
      setResult(importResult);

      if (importResult.success && importResult.html) {
        await onImport(importResult.html);
        // Close modal on successful import
        setTimeout(() => {
          setOpen(false);
          setUrl('');
          setResult(null);
        }, 1500);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      setOpen(newOpen);
      if (!newOpen) {
        setUrl('');
        setResult(null);
      }
    }
  };

  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Download className="w-4 h-4 mr-2" />
      Import from URL
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Content from URL</DialogTitle>
          <DialogDescription>
            Enter a URL to import HTML content into your blog post. The content will be converted to BlockNote format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/blog-post"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Enter the full URL of the webpage you want to import content from.
            </p>
          </div>

          {result && (
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <div className="flex-1">
                  {result.success ? (
                    <div className="text-green-800">
                      <p className="font-medium">Content imported successfully!</p>
                      <p className="text-sm">The content has been added to your editor.</p>
                    </div>
                  ) : (
                    <div className="text-red-800">
                      <p className="font-medium">Import failed</p>
                      <p className="text-sm">{result.error}</p>
                    </div>
                  )}
                </div>
              </div>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleImport}
            disabled={loading || !url.trim() || !isValidUrl(url.trim())}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Import Content
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
