import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const NavLinks = [
   {
      label: "Home",
      href: "/"
   },
   {
      label: "Organisations",
      href: "/organisations"
   },
   {
      label: "About",
      href: "/about"
   },
   {
      label: "Contact",
      href: "/contact"
   },
   {
      label: "FAQs",
      href: "/faqs"
   }
]


export const Header = () => {
  return (
    <div className='flex justify-between items-center w-full py-4 px-8 border'>
        <div>
            <Image src="/logo.png" alt="logo" width={100} height={100} className='hidden md:block' />
            <Image src="/logo.png" alt="logo" width={80} height={80} className='block md:hidden' />
        </div>

        <div className='hidden md:flex gap-8 items-center'>
            {NavLinks.map((link) => (
               <Button variant="link" asChild key={link.label}>
                <Link href={link.href}>
                    {link.label}
                </Link>
               </Button>
            ))}
        </div>

        <div className="flex gap-8 items-center">
         
         <Select defaultValue="en">
            <SelectTrigger className='border-none rounded-full bg-gray-100'>
                <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="en">🏴󠁧󠁢󠁥󠁮󠁧󠁿 EN</SelectItem>
               <SelectItem value="fr">🇫🇷 FR</SelectItem>
            </SelectContent>
         </Select>
         <Button variant="default" asChild>
            <Link href="/auth/login">Login</Link>
         </Button>
        </div>
    </div>
  )
}
