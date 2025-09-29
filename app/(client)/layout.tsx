import { Header } from '@/components/landing-page/header'
// import { cookies } from 'next/headers';
import React from 'react'
import LoginButton from '@/components/landing-page/login-button'
import { Footer } from '@/components/landing-page/footer'
import { getLocale } from 'next-intl/server';
export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await getLocale();
  return (
    <main className="min-h-screen flex flex-col items-center w-full">
      <Header cookieLang={cookieStore} >
        <LoginButton />
      </Header>
      {children}
      <Footer />
    </main>
  )
}
