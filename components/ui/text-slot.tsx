import { cn } from '@/lib/utils';
import React from 'react'
type TextSlotProps = {
   title: string;
   subtitle?: string;
   titleClassName?: string;
   subtitleClassName?: string;
   containerClassName?: string;
}

export const TextSlot = ({ title, subtitle, titleClassName, subtitleClassName, containerClassName }: TextSlotProps) => {
  return (
    <div className={cn("flex flex-col gap-4", containerClassName)}>
        <h1 className={cn("text-4xl font-bold", titleClassName)}>
            {title}
        </h1>
        {subtitle && <p className={cn("", subtitleClassName)}>{subtitle}</p>}
    </div>
  )
}
