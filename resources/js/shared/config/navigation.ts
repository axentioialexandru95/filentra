import { type RBACConfig, type User } from '@/core/types';
import { Building2, Layers, Package, Shield } from 'lucide-react';

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
    canAccess: (rbacConfig: RBACConfig, user?: User) => boolean;
}

/**
 * Vendors Navigation Configuration (Admin/Superadmin only)
 */
export const VENDORS_NAVIGATION: NavigationSection = {
    key: 'vendors',
    label: 'Vendors',
    icon: Building2,
    tooltip: 'Vendor Management',
    isOpen: (url: string) => url.startsWith('/vendors'),
    canAccess: (rbacConfig: RBACConfig, user?: User) => {
        // Only admin and superadmin can access vendor management
        return user?.role?.slug === 'admin' || user?.role?.slug === 'superadmin';
    },
    items: [
        {
            label: 'All Vendors',
            routeName: 'vendors.index',
            urlPattern: '/vendors',
            isActive: (url: string) => url === '/vendors' || url.startsWith('/vendors?'),
        },
        {
            label: 'Add Vendor',
            routeName: 'vendors.create',
            urlPattern: '/vendors/create',
            isActive: (url: string) => url === '/vendors/create',
        },
    ],
};

/**
 * Products Navigation Configuration (Vendors only)
 */
export const PRODUCTS_NAVIGATION: NavigationSection = {
    key: 'products',
    label: 'Products',
    icon: Package,
    tooltip: 'Product Management',
    isOpen: (url: string) => url.startsWith('/products'),
    canAccess: (rbacConfig: RBACConfig, user?: User) => {
        // Only vendors can directly access products
        return user?.role?.slug === 'vendor';
    },
    items: [
        {
            label: 'All Products',
            routeName: 'products.index',
            urlPattern: '/products',
            isActive: (url: string) => url === '/products' || url.startsWith('/products?'),
        },
        {
            label: 'Add Product',
            routeName: 'products.create',
            urlPattern: '/products/create',
            isActive: (url: string) => url === '/products/create',
        },
    ],
};

/**
 * Batches Navigation Configuration
 */
export const BATCHES_NAVIGATION: NavigationSection = {
    key: 'batches',
    label: 'Batches',
    icon: Layers,
    tooltip: 'Batch Management',
    isOpen: (url: string) => url.startsWith('/batches'),
    canAccess: (rbacConfig: RBACConfig, user?: User) => {
        // Vendors can manage their own batches
        // Admin/Superadmin see batches through vendors
        return user?.role?.slug === 'vendor';
    },
    items: [
        {
            label: 'All Batches',
            routeName: 'batches.index',
            urlPattern: '/batches',
            isActive: (url: string) => url === '/batches' || url.startsWith('/batches?'),
        },
        {
            label: 'Create Batch',
            routeName: 'batches.create',
            urlPattern: '/batches/create',
            isActive: (url: string) => url === '/batches/create',
        },
    ],
};

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
    canAccess: (rbacConfig: RBACConfig, user?: User) => {
        // Only admin and superadmin can access RBAC
        const isAdminOrSuperadmin = user?.role?.slug === 'admin' || user?.role?.slug === 'superadmin';
        return isAdminOrSuperadmin && (rbacConfig.features.roles_management || rbacConfig.features.permissions_management);
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

/**
 * Get all navigation sections based on user role
 */
export const getAllNavigationSections = (): NavigationSection[] => {
    return [VENDORS_NAVIGATION, PRODUCTS_NAVIGATION, BATCHES_NAVIGATION, RBAC_NAVIGATION];
};
