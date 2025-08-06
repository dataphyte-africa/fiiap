'use client'
import React, { useMemo } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from './ui/breadcrumb'
import { usePathname } from 'next/navigation';

export default function BreadCrumb() {
    const pathname = usePathname();
    const breadcrumb = useMemo(() => pathname.split('/').slice(1).map((segment, index, array) => {
        const isLast = index === array.length - 1;
        return (
            <BreadcrumbItem key={segment}>
                {isLast ? <BreadcrumbPage>{segment}</BreadcrumbPage> : <BreadcrumbLink href={`/${segment}`}>{segment}</BreadcrumbLink>}
            </BreadcrumbItem>
        );
    }), [pathname]);
  return (
      <Breadcrumb className=''>
        <BreadcrumbList >
            {breadcrumb}
        </BreadcrumbList>
      </Breadcrumb>
  )
}