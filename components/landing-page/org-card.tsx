import React from 'react'
import Image from 'next/image'
import { MapPin, Folder, FileText } from 'lucide-react'

interface OrgCardProps {
  logo: string
  name: string
  location: string
  projects: number
  blogs: number
  description: string
}

export const OrgCard = ({ 
  logo, 
  name, 
  location, 
  projects, 
  blogs, 
  description 
}: OrgCardProps) => {
  return (
    <div className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-md'>
      {/* Header with logo and name */}
      <div className='flex items-start gap-4 mb-4'>
        <div className='shrink-0'>
          <Image 
            src={logo} 
            alt={`${name} logo`}
            width={60}
            height={60}
            className='rounded-lg object-cover'
          />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-lg font-semibold text-foreground leading-tight mb-2'>
            {name}
          </h3>
          <div className='flex items-center text-foreground/60 text-sm'>
            <MapPin className='w-4 h-4 mr-1' />
            <span>{location}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className='flex items-center gap-6 mb-4 text-sm text-foreground/70'>
        <div className='flex items-center'>
          <Folder className='w-4 h-4 mr-1' />
          <span>{projects} Projects</span>
        </div>
        <div className='flex items-center'>
          <FileText className='w-4 h-4 mr-1' />
          <span>{blogs} Blogs</span>
        </div>
      </div>

      {/* Description */}
      <p className='text-foreground/80 text-sm leading-relaxed'>
        {description}
      </p>
    </div>
  )
}
