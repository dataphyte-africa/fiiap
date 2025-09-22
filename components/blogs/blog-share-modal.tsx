'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Share2, 
  Copy, 
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface BlogShareModalProps {
  title: string;
  url: string;
  excerpt?: string;
  trigger?: React.ReactNode;
}

interface SocialPlatform {
  name: string;
  icon: string;
  bgColor: string;
  shareUrl: (url: string, title: string, text?: string) => string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    name: 'WhatsApp',
    icon: '/socials/whatsapp.png',
    bgColor: 'bg-green-500 hover:bg-green-600',
    shareUrl: (url, title) => 
      `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${url}`)}`
  },
  {
    name: 'X',
    icon: '/socials/X.png',
    bgColor: 'bg-black hover:bg-gray-800',
    shareUrl: (url, title) => 
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  },
  {
    name: 'Facebook',
    icon: '/socials/facebook.png',
    bgColor: 'bg-blue-600 hover:bg-blue-700',
    shareUrl: (url, title) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`
  },
  {
    name: 'Gmail',
    icon: '/socials/gmail.png',
    bgColor: 'bg-red-500 hover:bg-red-600',
    shareUrl: (url, title) => 
      `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${url}`)}`
  },
  {
    name: 'LinkedIn',
    icon: '/socials/linkedIn.png',
    bgColor: 'bg-blue-700 hover:bg-blue-800',
    shareUrl: (url) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  },
  {
    name: 'Instagram',
    icon: '/socials/instagram.png',
    bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    shareUrl: () => 
      `https://www.instagram.com/` // Instagram doesn't support direct URL sharing, so we'll just open Instagram
  }
];

export function BlogShareModal({ title, url, excerpt, trigger }: BlogShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = url.startsWith('http') 
    ? url 
    : `${typeof window !== 'undefined' ? window.location.origin : ''}${url}`;

  const handleShare = useCallback((platform: SocialPlatform) => {
    const shareUrl = platform.shareUrl(fullUrl, title, excerpt);
    
    if (platform.name === 'Instagram') {
      // Instagram doesn't support URL sharing, so we'll copy the link and open Instagram
      handleCopyLink();
      toast.info('Link copied! Paste it in your Instagram story or post.');
      window.open('https://www.instagram.com/', '_blank');
    } else {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullUrl, title, excerpt]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link. Please try again.');
    }
  }, [fullUrl]);

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="flex items-center gap-2">
      <Share2 className="h-4 w-4" />
      Share
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className=" w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share
          </DialogTitle>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        
        <div className="space-y-6 w-full max-w-full">
          {/* Social Media Platforms */}
          <div className="grid grid-cols-2 gap-4">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => handleShare(platform)}
                className={`
                  flex flex-col items-center justify-center p-4 rounded-xl text-white transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 shadow-md
                  ${platform.bgColor}
                `}
              >
                <span className="text-2xl mb-2 font-bold" role="img" aria-label={platform.name}>
                  <Image src={platform.icon} alt={platform.name} width={24} height={24} />
                </span>
                <span className="text-xs font-medium">{platform.name}</span>
              </button>
            ))}
          </div>

          {/* Copy Link Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                value={fullUrl}
                readOnly
                className="flex-1 bg-gray-50 text-sm"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 min-w-[80px]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Article Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 text-sm line-clamp-1 mb-1">
              {title}
            </h4>
            {excerpt && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {excerpt}
              </p>
            )}
            {/* <p className="text-xs text-gray-400 mt-2 truncate line-clamp-1">
              {fullUrl}
            </p> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
