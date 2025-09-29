import { AdminUsersTable } from '@/components/admin/admin-users-table'
import { useTranslations } from 'next-intl';

export default function AdminUsersPage() {
  const t = useTranslations();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.pages.users.title')}</h1>
          <p className="text-muted-foreground">
            {t('admin.pages.users.description')}
          </p>
        </div>
      </div>
      
      <AdminUsersTable />
    </div>
  )
}
