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
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Database } from '@/types/db';
import LanguageSwitcher from './landing-page/langauage-switcher';
import { useTranslations } from 'next-intl';
type NavItem = {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: NavItem[];
};
const getDefaultNavItems = (t: (key: string) => string): NavItem[] => [
    {
        title: t('admin.navigation.dashboard'),
        url: '/dashboard',
        icon: LayoutDashboard,
        isActive: true,
    },
    {
        title: t('admin.navigation.myOrganisation'),
        url: '/dashboard/organisation',
        icon: LucideBuilding,
    },
    {
        title: t('admin.navigation.manageProjects'),
        url: '/dashboard/projects',
        icon: LucideBriefcaseBusiness,
    },
    {
        title: t('admin.navigation.managePosts'),
        url: '/dashboard/posts',
        icon: LucideImagePlus,
    },
    {
        title: t('admin.navigation.manageBlogs'),
        url: '/dashboard/blogs',
        icon: LucideBookOpen,
    },
];

const getAdminNavItems = (t: (key: string) => string) => [
  {
      title: t('admin.navigation.manageOrganisations'),
      url: '/admin/organisations',
      icon: LucideBuilding,
  },
  {
      title: t('admin.navigation.manageUsers'),
      url: '/admin/users',
      icon: LucideUsers,
  },
  {
      title: t('admin.navigation.manageBlogPosts'),
      url: '/admin/blogs',
      icon: LucideBookOpen,
  },
  {
      title: t('admin.navigation.managePosts'),
      url: '/admin/posts',
      icon: LucideImagePlus,
  },
  {
      title: t('admin.navigation.manageResourceLibrary'),
      url: '/admin/resource-library',
      icon: LucideBookOpen,
  },
  {
      title: t('admin.navigation.manageOnlineCourses'),
      url: '/admin/online-courses',
      icon:  LucideGraduationCap,
  },
  {
      title: t('admin.navigation.manageFundingOpportunities'),
      url: '/admin/funding-opportunities',
      icon: LucideBriefcaseBusiness,
  },
  {
      title: t('admin.navigation.manageEvents'),
      url: '/admin/events',
      icon: LucideUsers,
  },
];  

export function AppSidebar({
    user,
    navItems,
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
    const t = useTranslations();
    
    const navmain = useMemo(() => {
        const defaultNavItems = getDefaultNavItems(t);
        const adminNavItems = getAdminNavItems(t);
        const items = (isAdmin ? adminNavItems : (navItems || defaultNavItems)).map((item) => {
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
    }, [pathname, navItems, isAdmin, user.role, t]);
    const navsecondary = useMemo(() => {
        const projects = [];
        if (user.isAdmin && !pathname.includes('/admin')) {
            projects.push({
                title: t('admin.common.gotoAdmin'),
                url: "/admin",
                icon: LucideShieldCheck,
            });
        }
        if(user.isAdmin && pathname.includes('/admin')) {
            projects.push({
                title: t('admin.common.gotoDashboard'),
                url: "/dashboard",
                icon: LayoutDashboard,
            });
        }
        return projects;
    }, [pathname, user.isAdmin, t]);
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div
                    className="flex flex-row items-center justify-between"
                >
                    <div className="text-sidebar-foreground flex items-center justify-center rounded-lg">
                    <Link href="/">
            <h5 className='text-sm md:text-base font-bold'>{t('landingPage.navigation.title')}</h5>
            </Link>
                    
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
