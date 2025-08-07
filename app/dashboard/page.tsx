
import { OrganisationSummaryCard } from "@/components/dashboard/organisation-summary-card"
import { ProjectSummaryCard } from "@/components/dashboard/project-summary-card"
import { PostActivityCard } from "@/components/dashboard/post-activity-card"
import { NotificationsCard } from "@/components/dashboard/notifications-card"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { OrganisationLoadingCard } from "@/components/dashboard/organisation-loading-card"
import { ProjectLoadingCard } from "@/components/dashboard/project-loading-card"






const mockNotifications = [
  {
    id: "1",
    title: "New collaboration request",
    message: "Green Future Foundation wants to collaborate on your water project. Review their proposal and respond.",
    type: "info" as const,
    created_at: "2024-01-20T09:30:00Z",
    action_url: "/collaborations/1"
  },
  {
    id: "2", 
    title: "Project milestone achieved",
    message: "Congratulations! Your Clean Water Access Program has reached 75% completion.",
    type: "success" as const,
    created_at: "2024-01-19T16:45:00Z",
    read_at: "2024-01-19T17:00:00Z"
  },
  {
    id: "3",
    title: "Funding opportunity available", 
    message: "A new grant opportunity matching your focus areas is now open for applications. Deadline: Feb 15th.",
    type: "warning" as const,
    created_at: "2024-01-18T11:20:00Z"
  },
  {
    id: "4",
    title: "Welcome to the platform!",
    message: "Get started by completing your organisation profile and creating your first project.",
    type: "info" as const,
    created_at: "2024-01-15T08:00:00Z",
    read_at: "2024-01-15T08:30:00Z"
  }
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  


  const unreadNotifications = mockNotifications.filter(n => !n.read_at).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your organisation&apos;s activity.
          </p>
        </div>
        
        
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        <Suspense fallback={<OrganisationLoadingCard />}>
          <OrganisationSummaryCard userId={user.id} />
        </Suspense>
        
        
        <Suspense fallback={<ProjectLoadingCard />}>
          <ProjectSummaryCard userId={user.id} />
        </Suspense>
        
        <PostActivityCard
         
          totalPosts={8}
          loading={false}
        />
        
        <NotificationsCard
          notifications={mockNotifications}
          unreadCount={unreadNotifications}
          loading={false}
        />
      </div>

      
    </div>
  )
}
