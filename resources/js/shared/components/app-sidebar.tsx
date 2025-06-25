import { User, type NavItem, type SharedData } from '@/core/types';
import { NavUser } from '@/modules/users/components/nav-user';
import { NavMain } from '@/shared/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/shared/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { BarChart3, LayoutGrid, Shield, Tag, Users } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user as User;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    // Users management (Superadmin only)
    if (user?.role?.slug === 'superadmin') {
        mainNavItems.push({
            title: 'Users',
            href: '/users',
            icon: Users,
        });
    }

    // Analytics (Superadmin only)
    if (user?.role?.slug === 'superadmin') {
        mainNavItems.push({
            title: 'Analytics',
            href: '/analytics',
            icon: BarChart3,
        });
    }

    // Roles and Permissions (Superadmin and Admin only)
    if (user?.role?.slug === 'superadmin' || user?.role?.slug === 'admin') {
        mainNavItems.push({
            title: 'Roles',
            href: '/rbac/roles',
            icon: Tag,
        });
        mainNavItems.push({
            title: 'Permissions',
            href: '/rbac/permissions',
            icon: Shield,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
