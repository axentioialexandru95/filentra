import { type NavItem, type SharedData } from '@/core/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/shared/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { RBAC_NAVIGATION, getFilteredRBACItems } from '../config/navigation';
import { useRBACAccess } from '../hooks/use-rbac-access.hook';
import { useRBACConfig } from '../hooks/use-rbac-config.hook';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage<SharedData>();
    const { canAccessRBAC } = useRBACAccess(page.props);
    const { rbacConfig } = useRBACConfig();

    const rbacItems = getFilteredRBACItems(rbacConfig);
    const showRBACSection = canAccessRBAC && RBAC_NAVIGATION.canAccess(rbacConfig) && rbacItems.length > 0;

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                {showRBACSection && (
                    <SidebarMenuItem>
                        <Collapsible asChild defaultOpen={RBAC_NAVIGATION.isOpen(page.url)}>
                            <div>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={RBAC_NAVIGATION.tooltip}>
                                        <RBAC_NAVIGATION.icon className="h-4 w-4" />
                                        <span>{RBAC_NAVIGATION.label}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {rbacItems.map((item) => (
                                            <SidebarMenuSubItem key={item.routeName}>
                                                <SidebarMenuSubButton asChild isActive={item.isActive(page.url)}>
                                                    <Link href={route(item.routeName)}>
                                                        <span>{item.label}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </div>
                        </Collapsible>
                    </SidebarMenuItem>
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
