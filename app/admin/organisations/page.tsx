import React from 'react';
import OrganisationsListable from '@/components/admin/organisations-listable';
import { useTranslations } from 'next-intl';

export default function AdminOrganisationsPage() {
  const t = useTranslations();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.pages.organisations.title')}</h1>
        <p className="text-muted-foreground">
          {t('admin.pages.organisations.description')}
        </p>
      </div>
      
      <OrganisationsListable />
    </div>
  );
}
