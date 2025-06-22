// Types for dashboard module

export interface DashboardData {
    stats: DashboardStats;
    recentActivity: RecentActivity[];
    quickActions: QuickAction[];
}

export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalProjects: number;
    completedTasks: number;
    revenue: number;
    growth: number;
}

export interface RecentActivity {
    id: number;
    type: 'user_registered' | 'project_created' | 'task_completed' | 'payment_received';
    title: string;
    description: string;
    user?: {
        id: number;
        name: string;
        avatar?: string;
    };
    timestamp: string;
    icon?: string;
}

export interface QuickAction {
    id: string;
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
    color: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
    permission?: string;
}

// Dashboard widget types
export interface DashboardWidget {
    id: string;
    title: string;
    type: 'stat' | 'chart' | 'list' | 'table';
    position: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    data: unknown;
    config?: DashboardWidgetConfig;
}

export interface DashboardWidgetConfig {
    refreshInterval?: number;
    showHeader?: boolean;
    allowResize?: boolean;
    allowMove?: boolean;
}

// Dashboard page props interfaces
export interface DashboardPageProps {
    stats: DashboardStats;
    recentActivity: RecentActivity[];
    quickActions: QuickAction[];
    widgets?: DashboardWidget[];
}

export interface WelcomePageProps {
    user: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
    };
    getting_started_steps: GettingStartedStep[];
}

// Getting started steps for welcome page
export interface GettingStartedStep {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    href?: string;
    action?: string;
}

// Chart data interfaces
export interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}

export interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
}

// Dashboard filters
export interface DashboardFilters {
    dateRange: {
        start: string;
        end: string;
    };
    period: 'today' | 'week' | 'month' | 'quarter' | 'year';
}

// Notification types for dashboard
export interface DashboardNotification {
    id: number;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    actions?: NotificationAction[];
}

export interface NotificationAction {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'destructive';
}

// Dashboard preferences
export interface DashboardPreferences {
    layout: 'grid' | 'list';
    widgets: string[];
    refreshInterval: number;
    theme: 'light' | 'dark' | 'auto';
    compactMode: boolean;
}
