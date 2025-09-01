
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { setLanguage } from '@/app/actions';

export default function LanguageSwitcher({cookieLang}: {cookieLang: string}) {
  return (
   <Select defaultValue={cookieLang} onValueChange={async (value) => {
      await setLanguage(value)
   }}>
      <SelectTrigger className='border-none rounded-full bg-gray-100'>
          <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
         <SelectItem value="en" > 🏴󠁧󠁢󠁥󠁮󠁧󠁿 EN</SelectItem>
         <SelectItem value="fr" > 🇫🇷 FR</SelectItem>
         <SelectItem value="es" > 🇪🇸 ES</SelectItem>
      </SelectContent>
   </Select>
  )
}
