import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Folder, FileText } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface OrgCardProps {
  id: string
  logo?: string
  name: string
  location: string
  projects: number
  blogs: number
  description: string
  projectsLabel?: string
  blogsLabel?: string
}

export const OrgCard = ({ 
  id,
  logo, 
  name, 
  location, 
  projects, 
  blogs, 
  description,
  projectsLabel = "Projects",
  blogsLabel = "Blogs"
}: OrgCardProps) => {
  const truncatedName = name.length > 50 ? name.substring(0, 50) + '...' : name;
  const truncatedDescription = description.length > 120 ? description.substring(0, 120) + '...' : description;
  const shouldTruncateName = name.length > 50;
  const shouldTruncateDescription = description.length > 120;

  return (
    <TooltipProvider>
      <Link href={`/organisations/${id}`} className="block">
        <div className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-md cursor-pointer'>
        {/* Header with logo and name */}
        <div className='flex items-start gap-4 mb-4'>
          {logo && <div className='shrink-0'>
            <Image 
              src={logo} 
              alt={`${name} logo`}
              width={40}
              height={40}
              className='rounded-lg object-cover'
            />
          </div>}
          <div className='flex-1 min-w-0'>
            {shouldTruncateName ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className='text-lg font-semibold text-foreground leading-tight mb-2 cursor-help'>
                    {truncatedName}
                  </h3>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <h3 className='text-lg font-semibold text-foreground leading-tight mb-2'>
                {name}
              </h3>
            )}
            <div className='flex items-center text-foreground/60 text-sm'>
              <MapPin className='w-4 h-4 mr-1' />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className='flex items-center gap-6 mb-4 text-sm text-foreground/70'>
          <div className='flex items-center'>
            <Folder className='w-4 h-4 mr-1' />
            <span>{projects} {projectsLabel}</span>
          </div>
          <div className='flex items-center'>
            <FileText className='w-4 h-4 mr-1' />
            <span>{blogs} {blogsLabel}</span>
          </div>
        </div>

        {/* Description */}
        {shouldTruncateDescription ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <p className='text-foreground/80 text-sm leading-relaxed cursor-help'>
                {truncatedDescription}
              </p>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-sm">
              <p className="whitespace-pre-wrap">{description}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <p className='text-foreground/80 text-sm leading-relaxed'>
            {description}
          </p>
        )}
        </div>
      </Link>
    </TooltipProvider>
  )
}
