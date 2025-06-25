// Analytics module types

export interface AnalyticsData {
    users: {
        total: number;
        verified: number;
        unverified: number;
        recent: number;
        active_today: number;
    };
    roles: {
        total: number;
        with_users: number;
        without_users: number;
        most_assigned: string;
    };
    permissions: {
        total: number;
        assigned: number;
        unassigned: number;
        categories: number;
    };
    distribution: {
        roles: Array<{
            role: string;
            users: number;
            percentage: number;
        }>;
        permissions_by_category: Array<{
            category: string;
            permissions: number;
        }>;
    };
    growth: {
        users_by_month: Array<{
            month: string;
            count: number;
        }>;
        role_assignments_by_month: Array<{
            month: string;
            roles: Array<{
                role: string;
                count: number;
            }>;
        }>;
    };
}

export interface AnalyticsDashboardProps {
    analytics: AnalyticsData;
}

export interface ChartDataPoint {
    month: string;
    users?: number;
    count?: number;
}

export interface RoleDistribution {
    role: string;
    users: number;
    percentage: number;
}

export interface PermissionCategory {
    category: string;
    permissions: number;
}

export interface UserStats {
    total: number;
    verified: number;
    unverified: number;
    recent: number;
    active_today: number;
    verification_rate?: number;
}

export interface RoleStats {
    total: number;
    with_users: number;
    without_users: number;
    most_assigned: string;
}

export interface PermissionStats {
    total: number;
    assigned: number;
    unassigned: number;
    categories: number;
}

// Chart configuration types
export interface AnalyticsChartConfig {
    [key: string]: {
        label: string;
        color: string;
    };
}
