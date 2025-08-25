import { AdminUsersTable } from '@/components/admin/admin-users-table'

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user roles and organisation assignments
          </p>
        </div>
      </div>
      
      <AdminUsersTable />
    </div>
  )
}
