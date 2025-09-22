import { createClient } from '@/lib/supabase/server';
import React from 'react'
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function LoginButton() {
   const supabase = await createClient();
   const {data} = await supabase.auth.getClaims()
   const user = data?.claims
   const t = await getTranslations('landingPage.navigation')
   return user ? (
      <Avatar asChild>
         <Link href="/dashboard">
         <AvatarImage src={user.user_metadata.avatar_url} />
         <AvatarFallback>
            {user.user_metadata.displayName?.charAt(0)}
         </AvatarFallback>
         </Link>
      </Avatar>
   ) : (
      <Button variant="default" asChild>
         <Link href="/auth/login">{t('register')}</Link>
      </Button>
   )   
  
}
