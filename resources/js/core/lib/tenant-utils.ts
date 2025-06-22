import { usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

export interface Tenant {
    id: number;
    name: string;
    subdomain: string;
}

interface PageProps {
    tenant?: Tenant | null;
    [key: string]: unknown;
}

/**
 * Get the current tenant from Inertia shared data
 */
export function useCurrentTenant(): Tenant | null {
    const { props } = usePage<PageProps>();
    return props.tenant || null;
}

/**
 * Generate route for current context (tenant is resolved from user)
 * Routes are now clean URLs like: /dashboard, /users, etc.
 */
export function tenantRoute(routeName: string, params: Record<string, string | number> = {}): string {
    // Simply use the route function with clean route names
    // The backend will resolve tenant from authenticated user
    return route(routeName, params);
}

/**
 * Check if we're in a tenant context (helper function, not a hook)
 */
export function getCurrentTenant(): Tenant | null {
    // Note: This should only be used in non-React contexts
    // For React components, use useCurrentTenant() hook instead
    return null; // Can't access page props outside React context
}

/**
 * Set tenant data in window for global access
 */
export function setGlobalTenant(tenant: Tenant | null): void {
    if (typeof window !== 'undefined') {
        (window as unknown as { tenant?: Tenant | null }).tenant = tenant;
    }
}
