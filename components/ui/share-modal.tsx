'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ShareModalProps {
  title: string;
  url: string;
  description?: string;
  triggerClassName?: string;
}

export function ShareModal({ title, url, description, triggerClassName }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Construct full URL
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
  
  // Encode text for sharing
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');
  const encodedUrl = encodeURIComponent(fullUrl);

  // Social media share URLs
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link +, ERROR: ' + error?.toString());
    }
  };

  const openShareUrl = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={triggerClassName}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this content</DialogTitle>
          <DialogDescription>
            Share &quot;{title}&quot; with others
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Copy Link Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Copy Link</label>
            <div className="flex gap-2">
              <Input
                value={fullUrl}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Media Sharing */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Share on social media</label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => openShareUrl(shareUrls.facebook)}
                className="flex items-center gap-2 justify-start"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              
              <Button
                variant="outline"
                onClick={() => openShareUrl(shareUrls.twitter)}
                className="flex items-center gap-2 justify-start"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                Twitter
              </Button>
              
              <Button
                variant="outline"
                onClick={() => openShareUrl(shareUrls.linkedin)}
                className="flex items-center gap-2 justify-start"
              >
                <Linkedin className="h-4 w-4 text-blue-700" />
                LinkedIn
              </Button>
              
              <Button
                variant="outline"
                onClick={() => openShareUrl(shareUrls.email)}
                className="flex items-center gap-2 justify-start"
              >
                <Mail className="h-4 w-4 text-gray-600" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
