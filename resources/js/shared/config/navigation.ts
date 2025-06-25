import { type RBACConfig } from '@/core/types';
import { Shield } from 'lucide-react';

export interface NavigationItem {
    label: string;
    routeName: string;
    urlPattern: string;
    isActive: (url: string) => boolean;
}

export interface NavigationSection {
    key: string;
    label: string;
    icon: typeof Shield;
    tooltip: string;
    items: NavigationItem[];
    isOpen: (url: string) => boolean;
    canAccess: (rbacConfig: RBACConfig) => boolean;
}

/**
 * RBAC Navigation Configuration
 *
 * This configuration object defines the RBAC navigation structure.
 * It provides a centralized way to manage RBAC menu items and their visibility.
 *
 * Features:
 * - Configurable menu items based on RBAC feature flags
 * - Dynamic visibility based on user permissions
 * - Easy to extend and maintain
 *
 * @example
 * // To add a new RBAC menu item:
 * // 1. Add a new item to the items array
 * // 2. Update the feature flags in config/rbac.php
 * // 3. Add the feature check in shouldShowNavigationItem()
 */
export const RBAC_NAVIGATION: NavigationSection = {
    key: 'rbac',
    label: 'RBAC',
    icon: Shield,
    tooltip: 'RBAC Management',
    isOpen: (url: string) => url.startsWith('/rbac'),
    canAccess: (rbacConfig: RBACConfig) => {
        return rbacConfig.features.roles_management || rbacConfig.features.permissions_management;
    },
    items: [
        {
            label: 'Roles',
            routeName: 'rbac.roles.index',
            urlPattern: '/rbac/roles',
            isActive: (url: string) => url.startsWith('/rbac/roles'),
        },
        {
            label: 'Permissions',
            routeName: 'rbac.permissions.index',
            urlPattern: '/rbac/permissions',
            isActive: (url: string) => url.startsWith('/rbac/permissions'),
        },
        // Example: Add more items here
        // {
        //     label: 'Audit Log',
        //     routeName: 'rbac.audit.index',
        //     urlPattern: '/rbac/audit',
        //     isActive: (url: string) => url.startsWith('/rbac/audit'),
        // },
    ],
};

/**
 * Check if a navigation item should be shown based on RBAC configuration
 *
 * @param item - The navigation item to check
 * @param rbacConfig - The RBAC configuration from the backend
 * @returns Whether the item should be displayed
 */
export const shouldShowNavigationItem = (item: NavigationItem, rbacConfig: RBACConfig): boolean => {
    if (item.routeName.includes('roles')) {
        return rbacConfig.features.roles_management;
    }
    if (item.routeName.includes('permissions')) {
        return rbacConfig.features.permissions_management;
    }
    // Add more feature checks here as needed
    // if (item.routeName.includes('audit')) {
    //     return rbacConfig.features.audit_management;
    // }
    return true;
};

/**
 * Get filtered navigation items based on RBAC feature flags
 *
 * @param rbacConfig - The RBAC configuration from the backend
 * @returns Array of navigation items that should be displayed
 */
export const getFilteredRBACItems = (rbacConfig: RBACConfig): NavigationItem[] => {
    return RBAC_NAVIGATION.items.filter((item) => shouldShowNavigationItem(item, rbacConfig));
};
