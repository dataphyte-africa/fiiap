
import { FolderOpen, Calendar, Target, TrendingUp, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { getTranslations } from "next-intl/server"



interface ProjectSummaryCardProps {
  userId: string
  className?: string
}

export async function ProjectSummaryCard({
  userId,
  className
}: ProjectSummaryCardProps) {
  const t = await getTranslations('dashboard.projects')
  const supabase = await createClient()
  const { data: projects, error, count } = await supabase.from('projects').select('*', { count: 'exact' }).eq('created_by', userId)

  if ((projects && projects.length === 0) || error) {
    return (
      <Card className={cn(
        "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
        className
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{t('title')}</CardTitle>
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
            <FolderOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-sm mb-2">{t('noProjectsYet')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('noProjectsDescription')}
          </p>
          <Button asChild size="sm">
            <Link href={`/dashboard/projects/`}>
              <Plus className="h-4 w-4 mr-1" />
              {t('createFirstProject')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      planning: "bg-blue-100 text-blue-800",
      ongoing: "bg-green-100 text-green-800", 
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
      on_hold: "bg-yellow-100 text-yellow-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const activeProjects = projects.filter(p => p.status === 'ongoing').length
  const completedProjects = projects.filter(p => p.status === 'completed').length

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{t('title')}</CardTitle>
          <FolderOpen className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{t('active')}</p>
            <p className="text-2xl font-bold text-green-600">{activeProjects}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{t('completed')}</p>
            <p className="text-2xl font-bold text-gray-600">{completedProjects}</p>
          </div>
        </div>

        <div className="space-y-3">
          {projects.slice(0, 2).map((project) => (
            <div key={project.id} className="space-y-2 p-3 rounded-lg bg-muted/50">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm truncate flex-1 mr-2">{project.title}</h4>
                <Badge variant="secondary" className={cn("text-xs", getStatusColor(project.status || ''))}>
                  {project.status?.replace('_', ' ')}
                </Badge>
              </div>
              
              {/* {project.progress_percentage !== undefined && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress_percentage}%</span>
                  </div>
                  <Progress value={project.progress_percentage} className="h-1.5" />
                </div>
              )} */}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {project.start_date && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(project.start_date).toLocaleDateString()}
                  </div>
                )}
                {project.beneficiaries_count && (
                  <div className="flex items-center">
                    <Target className="h-3 w-3 mr-1" />
                    {project.beneficiaries_count.toLocaleString()} {t('beneficiaries')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 mr-1" />
            {count} {t('totalProjects')}
          </div>
          <div className="flex space-x-2">
            
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={`/dashboard/projects`}>
                {t('viewAll')}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 