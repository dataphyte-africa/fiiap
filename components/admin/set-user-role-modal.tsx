'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Shield } from 'lucide-react'
import { setUserRole } from '@/lib/data/admin-users'
import type { Database } from '@/types/db'
import { useTranslations } from 'next-intl'

type UserRole = Database['public']['Enums']['user_role_enum']

interface SetUserRoleModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    name: string
    avatar_url: string | null
    currentRole: UserRole | null
  }
  onSuccess: () => void
}

const getRoleLabels = (t: (key: string) => string): Record<UserRole, string> => ({
  admin: t('admin.common.administrator'),
  cso_rep: t('admin.common.csoRepresentative'),
  donor: t('admin.common.donor'),
  media: t('admin.common.media'),
  'policy_maker': t('admin.common.policyMaker'),
  public: t('admin.common.publicUser')
})

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-800 border-red-200',
  cso_rep: 'bg-blue-100 text-blue-800 border-blue-200',
  donor: 'bg-green-100 text-green-800 border-green-200',
  media: 'bg-purple-100 text-purple-800 border-purple-200',
  'policy_maker': 'bg-orange-100 text-orange-800 border-orange-200',
  public: 'bg-gray-100 text-gray-800 border-gray-200'
}

export function SetUserRoleModal({ isOpen, onClose, user, onSuccess }: SetUserRoleModalProps) {
  const t = useTranslations()
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const ROLE_LABELS = getRoleLabels(t)

  // Set initial role when modal opens
  useEffect(() => {
    if (isOpen && user.currentRole) {
      setSelectedRole(user.currentRole)
    } else {
      setSelectedRole('')
    }
  }, [isOpen, user.currentRole])

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError(t('admin.forms.validation.required'))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await setUserRole(user.id, selectedRole as UserRole)
      
      if (result) {
        onSuccess()
        onClose()
      } else {
        setError(t('admin.errors.saving'))
      }
    } catch (error) {
      setError(t('admin.errors.saving'))
      console.error('Error updating user role:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('admin.forms.edit')} {t('admin.common.status')}
          </DialogTitle>
          <DialogDescription>
            {t('admin.forms.edit')} {t('admin.common.status')} {t('admin.common.for')} {t('admin.common.this')} {t('admin.common.user')}. {t('admin.common.this')} {t('admin.common.will')} {t('admin.common.affect')} {t('admin.common.their')} {t('admin.common.permissions')} {t('admin.common.and')} {t('admin.common.access')} {t('admin.common.levels')}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              {user.currentRole && (
                <Badge className={ROLE_COLORS[user.currentRole]}>
                  {ROLE_LABELS[user.currentRole]}
                </Badge>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">{t('admin.forms.selectRole')}</Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder={t('admin.forms.selectOption')} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ROLE_LABELS).map(([role, label]) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center gap-2">
                      <Badge className={ROLE_COLORS[role as UserRole]} variant="outline">
                        {label}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {t('admin.common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !selectedRole}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('admin.common.updating')}
              </>
            ) : (
              t('admin.common.updateRole')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
