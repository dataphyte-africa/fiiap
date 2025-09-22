'use client'
import React, { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import LanguageSwitcher from './langauage-switcher'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { MenuIcon } from 'lucide-react'



export const Header =  ({cookieLang, children}: {cookieLang: string, children: React.ReactNode}) => {
   const t = useTranslations('landingPage.navigation')
   const pathname = usePathname()
   console.log(pathname, "pathname");
   const NavLinks = [
      {
         label: t('home'),
         href: "/"
      },
      {
         label: t('organisations'),
         href: "/organisations"
      },
      {
         label: t('resources'),
         href: "/resources"
      },
      {
         label: t('posts'),
         href: "/posts"
      },
      {
         label: t('blogs'),
         href: "/blogs"
      }, 
      {
         label: t('courses'),
         href: "/courses"
      },
      {
         label: t('funding'),
         href: "/funding-opportunities"
      },
      {
         label: t('events'),
         href: "/events"

      }
   ]
  return (
    <div className='flex justify-between items-center w-full py-4 px-8 border'>
        <div>
            {/* <Image src="/logo.png" alt="logo" width={100} height={100} className='hidden md:block' />
            <Image src="/logo.png" alt="logo" width={80} height={80} className='block md:hidden' /> */}
            <Link href="/">
            <h1 className='text-lg md:text-xl font-bold'>{t('title')}</h1>
            </Link>
        </div>

        <div className='hidden md:flex gap-4 items-center'>
            {NavLinks.map((link) => (
               <Button variant="link" asChild key={link.label} className={pathname === link.href ? "bg-primary/20" : ""}>
                <Link href={link.href}>
                    {link.label}
                </Link>
               </Button>
            ))}
        </div>

        <div className="flex md:gap-8 gap-2 items-center">
         
         <LanguageSwitcher cookieLang={cookieLang} />
         <Suspense>
            {children}
         </Suspense>
         <Sheet>
            <SheetTrigger className='md:hidden'>
               <MenuIcon className='size-6' />
            </SheetTrigger>
            <SheetContent>
               <SheetTitle className='hidden'>Menu</SheetTitle>
               <SheetHeader>
                  <Image src="/logo.png" alt="logo" width={80} height={80} className='block md:hidden' />
               </SheetHeader>
               <div className='flex flex-col items-start justify-start gap-4'>
                  {NavLinks.map((link) => (
                     <Button variant="link" asChild key={link.label}>
                        <Link href={link.href}>{link.label}</Link>
                     </Button>
                  ))}
               </div>
            </SheetContent>
         </Sheet>
        </div>
    </div>
  )
}
