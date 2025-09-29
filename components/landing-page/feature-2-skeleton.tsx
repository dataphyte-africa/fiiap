import React from 'react';
import { Skeleton } from '../ui/skeleton';

export const Feature2Skeleton = () => {
  return (
    <div className='bg-primary py-16 px-4 relative overflow-hidden bg-[url("/landing/feature-2.svg")] bg-cover bg-center w-full'>
      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-12'>
          <Skeleton className='h-10 w-96 mx-auto mb-4 bg-white/20' />
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[1, 2, 3].map((index) => (
            <div key={index} className='bg-white rounded-2xl p-8 shadow-lg relative overflow-hidden'>
              {/* Map background placeholder */}
              <div className='absolute right-4 top-4 opacity-5'>
                <Skeleton className='w-[170px] h-[120px] bg-gray-100' />
              </div>
              
              <div className='relative z-10'>
                {/* Flag placeholder */}
                <Skeleton className='w-16 h-16 mb-4 bg-gray-100' />
                
                {/* Country name placeholder */}
                <Skeleton className='h-8 w-32 mb-6 bg-gray-100' />
                
                {/* Statistics placeholders */}
                <div className='space-y-2 mb-8'>
                  <div className='flex items-center'>
                    <Skeleton className='w-6 h-6 mr-2 bg-gray-100' />
                    <Skeleton className='h-5 w-28 bg-gray-100' />
                  </div>
                  <div className='flex items-center'>
                    <Skeleton className='w-6 h-6 mr-2 bg-gray-100' />
                    <Skeleton className='h-5 w-24 bg-gray-100' />
                  </div>
                </div>
                
                {/* Button placeholder */}
                <Skeleton className='w-full h-10 bg-gray-100' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
