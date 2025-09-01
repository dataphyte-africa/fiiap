'use client';

import * as React from 'react';
import {
    LayoutDashboard,
    LucideBookOpen,
    LucideBriefcaseBusiness,
    LucideBuilding,
    LucideGraduationCap,
    LucideIcon,
    LucideImagePlus,
    LucideShieldCheck,
    LucideUserPlus,
    LucideUsers,
} from 'lucide-react';
import Link from 'next/link';
import { NavMain } from '@/components/nav-main';
import { NavBarSecondary } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
   
    SidebarRail,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Database } from '@/types/db';
import LanguageSwitcher from './landing-page/langauage-switcher';
type NavItem = {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: NavItem[];
};
const defaultNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
        isActive: true,
    },
    {
        title: 'My Organisation',
        url: '/dashboard/organisation',
        icon: LucideBuilding,
    },
    {
        title: 'Manage Projects',
        url: '/dashboard/projects',
        icon: LucideBriefcaseBusiness,
        // items: [
        //     {
        //         title: 'Water Initiative',
        //         url: '#',
        //     },
        //     {
        //         title: 'Another Project',
        //         url: '#',
        //     },
        //     {
        //         title: 'Projects Project',
        //         url: '#',
        //     },
        // ],
    },
    {
        title: 'Manage Posts',
        url: '/dashboard/posts',
        icon: LucideImagePlus,
    },
    {
        title: 'Manage Blogs',
        url: '/dashboard/blogs',
        icon: LucideBookOpen,
    },
];

const adminNavItems = [
  {
      title: 'Manage Organisations',
      url: '/admin/organisations',
      icon: LucideBuilding,
  },
  {
      title: 'Manage Users',
      url: '/admin/users',
      icon: LucideUsers,
  },
  {
      title: 'Manage Blog Posts',
      url: '/admin/blogs',
      icon: LucideBookOpen,
  },
  {
      title: 'Manage Posts',
      url: '/admin/posts',
      icon: LucideImagePlus,
  },
  {
      title: "Manage Resource Library",
      url: '/admin/resource-library',
      icon: LucideBookOpen,
  },
  {
      title: "Manage Online Courses",
      url: '/admin/online-courses',
      icon:  LucideGraduationCap,
  },
  {
      title: "Manage Events",
      url: '/admin/events',
      icon: LucideUsers,
  },
];  

export function AppSidebar({
    user,
    navItems = defaultNavItems,
    // projects = defaultProjects,
    cookieLang,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    user: {
        name: string;
        email: string;
        avatar: string;
        isAdmin?: boolean;
        role?: Database['public']['Enums']['user_role_enum'];
    };
    navItems?: NavItem[];
    projects?: NavItem[];
    cookieLang: string;
}) {
    const pathname = usePathname();
    const isAdmin = user.isAdmin && pathname.includes('/admin');
    
    const navmain = useMemo(() => {
        
        const items =  (isAdmin ? adminNavItems : navItems).map((item) => {
            return {
                ...item,
                isActive: pathname === item.url,
                url: item.url,
            };
        });
        if (user.role === 'cso_rep') {
            items.push({
                title: "Affiliation Requests",
                url: "/dashboard/affiliation-requests",
                icon: LucideUserPlus,
                isActive: pathname === "/dashboard/affiliation-requests",
            });
        }
        return items;
    }, [pathname, navItems, isAdmin, user.role]);
    const navsecondary = useMemo(() => {
        const projects = [];
        if (user.isAdmin && !pathname.includes('/admin')) {
            projects.push({
                title: "Goto Admin",
                url: "/admin",
                icon: LucideShieldCheck,
            });
        }
        if(user.isAdmin && pathname.includes('/admin')) {
            projects.push({
                title: "Goto Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
            });
        }
        return projects;
    }, [pathname, user.isAdmin]);
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div
                    className="flex flex-row items-center justify-between"
                >
                    <div className="text-sidebar-primary-foreground flex aspect-auto size-12 items-center justify-center rounded-lg">
                        <Link href="/"> <Image
                            src="/logo.png"
                            alt="logo"
                            // className='w-full h-full'
                            width={250}
                            height={90}
                        /></Link>
                    
                    </div>
                    <LanguageSwitcher cookieLang={cookieLang} />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navmain} />
                <NavBarSecondary projects={navsecondary} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
