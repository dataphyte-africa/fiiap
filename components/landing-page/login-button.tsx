import { createClient } from '@/lib/supabase/server';
import React from 'react'
import { Button } from '../ui/button';
import { Link } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default async function LoginButton() {
   const supabase = await createClient();
   const {data} = await supabase.auth.getClaims()
   const user = data?.claims
   
   return user ? (
      <Avatar>
         <AvatarImage src={user.user_metadata.avatar_url} />
         <AvatarFallback>
            {user.user_metadata.displayName?.charAt(0)}
         </AvatarFallback>
      </Avatar>
   ) : (
      <Button variant="default" asChild>
         <Link href="/auth/login">Login</Link>
      </Button>
   )   
  
}
