import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user?: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface Role {
    id: number;
    name: string;
    slug: string;
    level: number;
}

export interface Permission {
    id: number;
    name: string;
    slug: string;
    description?: string;
    category: string;
    is_active?: boolean;
    roles_count?: number;
    roles?: Role[];
    created_at?: string;
    updated_at?: string;
}

export interface RBACConfig {
    access: {
        super_admin_role: string;
        required_permissions: string[];
    };
    features: {
        roles_management: boolean;
        permissions_management: boolean;
    };
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth?: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    rbac_config: RBACConfig;
    permissions?: {
        data: Permission[];
        links: {
            first: string;
            last: string;
            prev: string | null;
            next: string | null;
        };
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            per_page: number;
            to: number;
            total: number;
        };
    };
    categories?: string[];
    filters?: unknown[];
    [key: string]: unknown;
}

export interface Permissions {
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
    role_id: number;
    role: Role | null;
    role_name: string | null;
    is_superadmin: boolean;
    permissions: Permission[];
    [key: string]: unknown;
}
