'use client';

import * as React from 'react';
import {
    LayoutDashboard,
    LucideBookOpen,
    LucideBriefcaseBusiness,
    LucideBuilding,
    LucideHelpCircle,
    LucideIcon,
    LucideImagePlus,
    LucideUserPlus,
    LucideUsers,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuButton,
    SidebarRail,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Database } from '@/types/db';
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
        title: 'Projects',
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
        title: 'Posts',
        url: '/dashboard/posts',
        icon: LucideImagePlus,
    },
];
const defaultProjects: NavItem[] = [
    {
        title: 'Help Support',
        url: '#',
        icon: LucideHelpCircle,
    },
    {
        title: 'Blogs',
        url: '#',
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
      title: 'Manage Posts',
      url: '/admin/posts',
      icon: LucideImagePlus,
  },
];  

export function AppSidebar({
    user,
    navItems = defaultNavItems,
    projects = defaultProjects,
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
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                        <Image
                            src="/logo.png"
                            alt="logo"
                            width={32}
                            height={32}
                        />
                    </div>
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navmain} />
                <NavProjects projects={projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
