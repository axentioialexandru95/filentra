import { type NavItem, type SharedData, type User } from '@/core/types';
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
import { BATCHES_NAVIGATION, getFilteredRBACItems, PRODUCTS_NAVIGATION, RBAC_NAVIGATION, VENDORS_NAVIGATION } from '../config/navigation';
import { useRBACAccess } from '../hooks/use-rbac-access.hook';
import { useRBACConfig } from '../hooks/use-rbac-config.hook';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage<SharedData>();
    const { canAccessRBAC } = useRBACAccess(page.props);
    const { rbacConfig } = useRBACConfig();
    const user = page.props.auth?.user as User;

    const rbacItems = getFilteredRBACItems(rbacConfig);
    const showRBACSection = canAccessRBAC && RBAC_NAVIGATION.canAccess(rbacConfig) && rbacItems.length > 0;

    // Get navigation sections based on user role
    const navigationSections = [VENDORS_NAVIGATION, PRODUCTS_NAVIGATION, BATCHES_NAVIGATION];
    const visibleSections = navigationSections.filter((section) => section.canAccess(rbacConfig, user));

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

                {/* Role-based navigation sections */}
                {visibleSections.map((section) => (
                    <SidebarMenuItem key={section.key}>
                        <Collapsible asChild defaultOpen={section.isOpen(page.url)}>
                            <div>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={section.tooltip}>
                                        <section.icon className="h-4 w-4" />
                                        <span>{section.label}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {section.items.map((item) => (
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
                ))}

                {/* RBAC Section */}
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
