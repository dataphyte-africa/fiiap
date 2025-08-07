"use client"

import { Bell, Check, AlertCircle, Info, CheckCircle, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface NotificationData {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read_at?: string
  action_url?: string
  created_at: string
}

interface NotificationsCardProps {
  notifications?: NotificationData[]
  unreadCount?: number
  loading?: boolean
  className?: string
  onMarkAllRead?: () => void
  onViewAll?: () => void
  onNotificationClick?: (notification: NotificationData) => void
  onMarkAsRead?: (notificationId: string) => void
}

export function NotificationsCard({
  notifications = [],
  unreadCount = 0,
  loading = false,
  className,
  onMarkAllRead,
  onViewAll,
  onNotificationClick,
  onMarkAsRead
}: NotificationsCardProps) {
  if (loading) {
    return (
      <Card className={cn(
        "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
        className
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
            <Bell className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (notifications.length === 0) {
    return (
      <Card className={cn(
        "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
        className
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
            <Bell className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <h3 className="font-semibold text-sm mb-2">You&apos;re all caught up!</h3>
          <p className="text-sm text-muted-foreground">
            No new notifications at the moment. We&apos;ll notify you when something important happens.
          </p>
        </CardContent>
      </Card>
    )
  }

  const getNotificationIcon = (type: string) => {
    const icons = {
      info: <Info className="h-4 w-4 text-blue-500" />,
      success: <CheckCircle className="h-4 w-4 text-green-500" />,
      warning: <AlertCircle className="h-4 w-4 text-yellow-500" />,
      error: <AlertCircle className="h-4 w-4 text-red-500" />
    }
    return icons[type as keyof typeof icons] || icons.info
  }

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return "bg-muted/30"
    
    const colors = {
      info: "bg-blue-50 border-blue-200",
      success: "bg-green-50 border-green-200",
      warning: "bg-yellow-50 border-yellow-200",
      error: "bg-red-50 border-red-200"
    }
    return colors[type as keyof typeof colors] || colors.info
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs px-2 py-0.5">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Bell className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {unreadCount > 0 && (
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllRead}
              className="text-xs h-7"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          </div>
        )}

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {notifications.slice(0, 4).map((notification) => {
            const isRead = !!notification.read_at
            return (
              <div
                key={notification.id}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all",
                  getNotificationBgColor(notification.type, isRead),
                  isRead ? "opacity-70" : ""
                )}
                onClick={() => onNotificationClick?.(notification)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={cn(
                          "text-sm font-medium truncate",
                          isRead ? "text-muted-foreground" : "text-foreground"
                        )}>
                          {notification.title}
                        </h4>
                        <p className={cn(
                          "text-xs mt-1 line-clamp-2",
                          isRead ? "text-muted-foreground/70" : "text-muted-foreground"
                        )}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.created_at)}
                          </span>
                          {notification.action_url && (
                            <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                              View
                            </Button>
                          )}
                        </div>
                      </div>
                      {!isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            onMarkAsRead?.(notification.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <Bell className="h-4 w-4 mr-1" />
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onViewAll?.()
            }}
          >
            View All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 