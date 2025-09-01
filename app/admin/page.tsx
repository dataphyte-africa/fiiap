import { redirect } from 'next/navigation';
import React from 'react'

export default function page() {
  redirect('/admin/organisations');
  return (
    <div>page</div>
  )
}
