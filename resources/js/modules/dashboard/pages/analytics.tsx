import { Head } from '@inertiajs/react';
import { BarChart3, CheckCircle, Clock, PieChart, Shield, TrendingUp, UserCheck, Users, UserX } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Pie, PieChart as RechartsPieChart, XAxis, YAxis } from 'recharts';

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import AppLayout from '@/shared/layouts/app-layout';

interface AnalyticsData {
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

interface AnalyticsDashboardProps {
    analytics: AnalyticsData;
}

export default function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
    const formatMonth = (monthString: string) => {
        const [year, month] = monthString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const calculatePercentage = (value: number, total: number) => {
        return total > 0 ? Math.round((value / total) * 100) : 0;
    };

    // Chart configurations
    const growthChartConfig = {
        users: {
            label: 'Users',
            color: 'hsl(var(--chart-1))',
        },
    } satisfies ChartConfig;

    const rolesChartConfig = {
        ...analytics?.distribution.roles.reduce(
            (acc, role, index) => {
                const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
                acc[role.role.toLowerCase().replace(/\s+/g, '_')] = {
                    label: role.role,
                    color: colors[index % colors.length],
                };
                return acc;
            },
            {} as Record<string, { label: string; color: string }>,
        ),
    } satisfies ChartConfig;

    const permissionsChartConfig = {
        permissions: {
            label: 'Permissions',
            color: 'hsl(var(--chart-3))',
        },
    } satisfies ChartConfig;

    // Prepare chart data
    const prepareGrowthData = () => {
        if (!analytics) return [];
        return analytics.growth.users_by_month.map((item) => ({
            month: formatMonth(item.month),
            users: item.count,
        }));
    };

    const prepareRoleDistributionData = () => {
        if (!analytics) return [];
        return analytics.distribution.roles.map((role) => ({
            role: role.role,
            users: role.users,
            percentage: role.percentage,
        }));
    };

    const preparePermissionCategoryData = () => {
        if (!analytics) return [];
        return analytics.distribution.permissions_by_category.map((category) => ({
            category: category.category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
            permissions: category.permissions,
        }));
    };

    return (
        <AppLayout>
            <Head title="Analytics Dashboard" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">RBAC Analytics</h1>
                        <p className="text-muted-foreground">Monitor your role-based access control system</p>
                    </div>
                    <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                        Refresh Data
                    </Button>
                </div>

                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.users.total.toLocaleString()}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <TrendingUp className="h-3 w-3" />
                                {analytics.users.recent} new this week
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.roles.with_users}</div>
                            <div className="text-xs text-muted-foreground">of {analytics.roles.total} total roles</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.permissions.total}</div>
                            <div className="text-xs text-muted-foreground">{analytics.permissions.categories} categories</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{calculatePercentage(analytics.users.verified, analytics.users.total)}%</div>
                            <div className="text-xs text-muted-foreground">{analytics.users.verified} verified users</div>
                        </CardContent>
                    </Card>
                </div>

                {/* User Status Distribution */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">User Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Verified</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium">{analytics.users.verified}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {calculatePercentage(analytics.users.verified, analytics.users.total)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <UserX className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm">Unverified</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium">{analytics.users.unverified}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {calculatePercentage(analytics.users.unverified, analytics.users.total)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm">Active Today</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium">{analytics.users.active_today}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {calculatePercentage(analytics.users.active_today, analytics.users.total)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Role Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Total Roles</span>
                                    <Badge variant="secondary">{analytics.roles.total}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">With Users</span>
                                    <Badge variant="default">{analytics.roles.with_users}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Empty Roles</span>
                                    <Badge variant="outline">{analytics.roles.without_users}</Badge>
                                </div>
                                <div className="border-t pt-2">
                                    <div className="text-xs text-muted-foreground">Most Assigned Role</div>
                                    <div className="text-sm font-medium">{analytics.roles.most_assigned}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Permission Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Total Permissions</span>
                                    <Badge variant="secondary">{analytics.permissions.total}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Assigned</span>
                                    <Badge variant="default">{analytics.permissions.assigned}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Unassigned</span>
                                    <Badge variant="outline">{analytics.permissions.unassigned}</Badge>
                                </div>
                                <div className="border-t pt-2">
                                    <div className="text-xs text-muted-foreground">Permission Categories</div>
                                    <div className="text-sm font-medium">{analytics.permissions.categories}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* User Growth Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                User Growth
                            </CardTitle>
                            <CardDescription>New user registrations over the last 12 months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={growthChartConfig} className="h-64">
                                <AreaChart data={prepareGrowthData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area type="monotone" dataKey="users" stroke="var(--color-users)" fill="var(--color-users)" fillOpacity={0.3} />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Role Distribution Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5" />
                                Role Distribution
                            </CardTitle>
                            <CardDescription>Users distribution across different roles</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={rolesChartConfig} className="h-64">
                                <RechartsPieChart>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Pie
                                        data={prepareRoleDistributionData()}
                                        dataKey="users"
                                        nameKey="role"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="var(--color-users)"
                                        label={({ percentage }) => `${percentage}%`}
                                    />
                                    <ChartLegend content={<ChartLegendContent />} />
                                </RechartsPieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Permission Categories Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Permission Categories
                        </CardTitle>
                        <CardDescription>Distribution of permissions across different categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={permissionsChartConfig} className="h-64">
                            <BarChart data={preparePermissionCategoryData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="permissions" fill="var(--color-permissions)" />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Role Details Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Role Details</CardTitle>
                        <CardDescription>Detailed breakdown of users per role</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Users</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Percentage</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prepareRoleDistributionData().map((role, index) => (
                                        <tr key={index} className="border-b hover:bg-muted/50">
                                            <td className="px-4 py-3 font-medium">{role.role}</td>
                                            <td className="px-4 py-3">{role.users.toLocaleString()}</td>
                                            <td className="px-4 py-3">{role.percentage}%</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={role.users > 0 ? 'default' : 'secondary'}>
                                                    {role.users > 0 ? 'Active' : 'Empty'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
