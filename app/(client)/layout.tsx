import { Header } from '@/components/landing-page/header'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col items-center w-full">
      <Header />
      {children}
    </main>
  )
}
