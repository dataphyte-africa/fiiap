"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  LayoutDashboard,
  LucideBookOpen,
  LucideBriefcaseBusiness,
  LucideBuilding,
  LucideHelpCircle,
  LucideImagePlus,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { useMemo } from "react"
import { usePathname } from "next/navigation"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "My Organisation",
      url: "/dashboard/organisation",
      icon: LucideBuilding,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: LucideBriefcaseBusiness,
      items: [
        {
          title: "Water Initiative",
          url: "#",
        },
        {
          title: "Another Project",
          url: "#",
        },
        {
          title: "Projects Project",
          url: "#",
        }
      ],
    },
    {
      title: "Posts",
      url: "/dashboard/posts",
      icon: LucideImagePlus,
      
    },
  ],
  projects: [
    {
      name: "Help Support",
      url: "#",
      icon: LucideHelpCircle,
    },
    {
      name: "Blogs",
      url: "#",
      icon: LucideBookOpen,
    },
  ],
}

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & {user: {name: string, email: string, avatar: string}}) {
  const pathname = usePathname(); 
  const navmain = useMemo(() => {
    return data.navMain.map((item) => {
      return {
        ...item,
        isActive: pathname === item.url,
        url: item.url,
      }
    })
  }, [pathname])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
               <Image src="/logo.png" alt="logo" width={32} height={32} />
              </div>
            
            </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navmain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
