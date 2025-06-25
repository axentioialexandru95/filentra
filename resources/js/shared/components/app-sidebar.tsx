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
import { BarChart3, Layers, LayoutGrid, Package, Users } from 'lucide-react';
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

    // Products module (Vendors, Admins, Superadmin)
    if (user?.role?.slug === 'vendor' || user?.role?.slug === 'admin' || user?.role?.slug === 'superadmin') {
        mainNavItems.push({
            title: 'Products',
            href: '/products',
            icon: Package,
        });
    }

    // Batches module (Vendors, Admins, Superadmin)
    if (user?.role?.slug === 'vendor' || user?.role?.slug === 'admin' || user?.role?.slug === 'superadmin') {
        mainNavItems.push({
            title: 'Batches',
            href: '/batches',
            icon: Layers,
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
