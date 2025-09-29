'use client'
import { cn } from '@/lib/utils'
import React from 'react'
// import { ChevronDown } from 'lucide-react'
import { Input } from '../ui/input'
import { useTranslations } from 'next-intl'

interface SearchBoxProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const SearchBox = ({ label, value, onChange, placeholder }: SearchBoxProps) => {
  const t = useTranslations('organisations-client.search');
  
  return (
   <div
   className={cn(
     "justify-between text-sm font-normal  border-input rounded-md px-4 py-2 cursor-pointer flex items-center focus-within:border-primary",
   )}
 >
   <div className="flex flex-col items-start gap-1">
   {label && <span className="text-sm font-bold text-muted-foreground">{label}</span>}
    <Input
    placeholder={placeholder || t('placeholder')}
    className="w-full border-none  shadow-none py-0 h-5 px-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    />
   </div>
   {/* <ChevronDown className="ml-2 h-4 w-4 opacity-50" /> */}
 </div>
  )
}
