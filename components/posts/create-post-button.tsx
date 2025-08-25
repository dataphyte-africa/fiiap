'use client';

import { Button } from '@/components/ui/button';
import { LucidePlus } from 'lucide-react';
import { useState } from 'react';
import { CreatePostModal } from '@/components/posts/create-post-modal';
import { Database } from '@/types/db';

export function CreatePostButton({profile}: {profile: Database['public']['Tables']['profiles']['Row']}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        <LucidePlus className="mr-2 h-4 w-4" />
        Create Post
      </Button>
      
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        profile={profile}
      />
    </>
  );
}
