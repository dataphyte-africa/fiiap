import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

export const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[75vh] md:min-h-[85vh] bg-[url("/hero-bg.png")] bg-cover bg-center w-full'>
        <div className='grid md:grid-cols-2 gap-4 w-full px-3 md:px-20'>
            <div className='flex flex-col justify-center gap-4 max-w-sm md:max-w-lg'>
                <h1 className='text-3xl md:text-4xl font-bold text-white'>
                <span className='text-yellow-300'>Connect. Collaborate. Grow:</span> The CSO Network for West Africa
                </h1>
                <p className='text-lg text-white/50 mb-4'>
                The CSO Network for West Africa is a platform that connects and supports civil society organisations in West Africa.
                </p>
                <div className='flex gap-4'>
                    <Button size="lg" asChild>
                      <Link href="auth/sign-up">Join as Organisation</Link>
                    </Button>
                    <Button size="lg" variant="outline" className='hidden md:block'>Search Organisations</Button>
                </div>
            </div>
            <div className=' hidden md:flex flex-col items-center justify-center'>
            </div>
        </div>
    </div>
  )
}
