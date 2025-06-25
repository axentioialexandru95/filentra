import { Head, Link, router } from '@inertiajs/react';
import { Activity, BarChart3, CheckCircle, Eye, MoreHorizontal, Plus, Shield, TrendingUp, UserCheck, Users, UserX } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { getInitials } from '@/core/lib/utils';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { Progress } from '@/shared/components/ui/progress';
import AppLayout from '@/shared/layouts/app-layout';

interface SuperAdminDashboardProps {
    analytics: {
        users: {
            total: number;
            verified: number;
            unverified: number;
            recent: number;
            active_today: number;
            verification_rate: number;
        };
        roles: {
            total: number;
            with_users: number;
            without_users: number;
        };
        permissions: {
            total: number;
            assigned: number;
            categories: number;
        };
    };
    recentUsers: Array<{
        id: number;
        name: string;
        email: string;
        role: string;
        role_slug: string;
        verified: boolean;
        created_at: string;
        created_at_human: string;
    }>;
    usersByRole: Array<{
        role: string;
        slug: string;
        users: number;
        level: number;
        percentage: number;
    }>;
    systemHealth: {
        users_growth: Array<{
            date: string;
            count: number;
        }>;
        database_status: string;
        last_updated: string;
    };
}

export default function SuperAdminDashboard({ analytics, recentUsers, usersByRole, systemHealth }: SuperAdminDashboardProps) {
    const getRoleBadgeVariant = (slug: string) => {
        switch (slug) {
            case 'superadmin':
                return 'destructive';
            case 'admin':
                return 'default';
            case 'warehouse_manager':
                return 'secondary';
            case 'vendor':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const chartConfig = {
        count: {
            label: 'Users',
            color: 'hsl(var(--chart-1))',
        },
    } satisfies ChartConfig;

    const roleChartConfig = {
        users: {
            label: 'Users',
            color: 'hsl(var(--chart-2))',
        },
    } satisfies ChartConfig;

    const handleUserAction = (userId: number, action: string) => {
        switch (action) {
            case 'view':
                router.visit(route('users.show', { user: userId }));
                break;
            case 'edit':
                router.visit(route('users.edit', { user: userId }));
                break;
            case 'impersonate':
                router.post(`/impersonate/${userId}`);
                break;
        }
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Monitor system activity and manage users</p>
                    </div>
                    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                        <Button asChild className="justify-center">
                            <Link href={route('users.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add User
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="justify-center">
                            <Link href={route('analytics.dashboard')}>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Full Analytics</span>
                                <span className="sm:hidden">Analytics</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.users.total.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="inline-flex items-center">
                                    <TrendingUp className="mr-1 h-3 w-3" />
                                    {analytics.users.recent} new this week
                                </span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.users.verification_rate}%</div>
                            <div className="mt-2">
                                <Progress value={analytics.users.verification_rate} className="h-2" />
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {analytics.users.verified} of {analytics.users.total} verified
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.roles.with_users}</div>
                            <p className="text-xs text-muted-foreground">of {analytics.roles.total} total roles</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.users.active_today}</div>
                            <p className="text-xs text-muted-foreground">users active in last 24h</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* User Growth Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                User Growth (30 Days)
                            </CardTitle>
                            <CardDescription>Daily user registrations over the last month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {systemHealth.users_growth.length > 0 ? (
                                <ChartContainer config={chartConfig} className="h-48 sm:h-56 lg:h-64">
                                    <AreaChart data={systemHealth.users_growth}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        />
                                        <YAxis />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                            labelFormatter={(value) =>
                                                new Date(value).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })
                                            }
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke="var(--color-count)"
                                            fill="var(--color-count)"
                                            fillOpacity={0.3}
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            ) : (
                                <div className="flex h-48 items-center justify-center text-muted-foreground">No data available</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Role Distribution Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Role Distribution
                            </CardTitle>
                            <CardDescription>Users distribution across different roles</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={roleChartConfig} className="h-48 sm:h-56 lg:h-64">
                                <BarChart data={usersByRole}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="role" angle={-45} textAnchor="end" height={80} interval={0} fontSize={12} />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="users" fill="var(--color-users)" />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table and Role Breakdown */}
                <div className="grid gap-6 xl:grid-cols-3">
                    {/* Recent Users */}
                    <Card className="xl:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Users</CardTitle>
                                    <CardDescription>Latest user registrations and activity</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={route('users.index')}>View All</Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentUsers.length === 0 ? (
                                    <div className="py-6 text-center text-muted-foreground">No users found</div>
                                ) : (
                                    recentUsers.map((user) => (
                                        <div key={user.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <Avatar className="h-8 w-8 flex-shrink-0">
                                                    <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium">{user.name}</p>
                                                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                                    <p className="text-xs text-muted-foreground sm:hidden">{user.created_at_human}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-shrink-0 items-center justify-between gap-2 sm:justify-end">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={getRoleBadgeVariant(user.role_slug)} className="text-xs">
                                                        {user.role}
                                                    </Badge>
                                                    {user.verified ? (
                                                        <UserCheck className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <UserX className="h-4 w-4 text-orange-500" />
                                                    )}
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleUserAction(user.id, 'view')}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleUserAction(user.id, 'edit')}>Edit</DropdownMenuItem>
                                                        {user.role_slug !== 'superadmin' && (
                                                            <DropdownMenuItem onClick={() => handleUserAction(user.id, 'impersonate')}>
                                                                Impersonate
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Role Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Role Breakdown</CardTitle>
                            <CardDescription>Detailed user distribution by role</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {usersByRole.map((role) => (
                                    <div key={role.slug} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={getRoleBadgeVariant(role.slug)} className="text-xs">
                                                    {role.role}
                                                </Badge>
                                                <span className="text-sm font-medium">{role.users}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">{role.percentage}%</span>
                                        </div>
                                        <Progress value={role.percentage} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* System Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            System Status
                        </CardTitle>
                        <CardDescription>Current system health and statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 flex-shrink-0 rounded-full bg-green-500"></div>
                                <span className="text-sm">Database: {systemHealth.database_status}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 flex-shrink-0 rounded-full bg-blue-500"></div>
                                <span className="text-sm">Permissions: {analytics.permissions.total} configured</span>
                            </div>
                            <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
                                <div className="h-3 w-3 flex-shrink-0 rounded-full bg-yellow-500"></div>
                                <span className="text-sm">Last updated: {systemHealth.last_updated}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
