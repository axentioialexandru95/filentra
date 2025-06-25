import { Head, Link } from '@inertiajs/react';
import { Activity, BarChart3, Building2, DollarSign, Eye, Package, Package2, PackageCheck, Shield, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { Progress } from '@/shared/components/ui/progress';
import AppLayout from '@/shared/layouts/app-layout';

interface SuperAdminDashboardProps {
    platformAnalytics: {
        total_users: number;
        total_vendors: number;
        active_vendors: number;
        total_products: number;
        unique_products: number;
        total_batches: number;
        active_batches: number;
        platform_value: number;
    };
    vendorAnalytics: {
        top_vendors: Array<{
            id: number;
            name: string;
            email: string;
            products_count: number;
            status: string;
            created_at: string;
        }>;
        by_status: Record<string, number>;
        new_this_month: number;
        total_revenue_processed: number;
    };
    productAnalytics: {
        by_status: Record<string, number>;
        by_quality: Record<string, number>;
        batches_by_status: Record<string, number>;
        top_categories: Record<string, number>;
        top_brands: Record<string, number>;
        verified_products: number;
        pending_review: number;
        avg_batch_size: number;
    };
    rbacAnalytics: {
        total_roles: number;
        total_permissions: number;
        users_by_role: Array<{
            role: string;
            slug: string;
            users: number;
            level: number;
            percentage: number;
        }>;
        roles_with_users: number;
        permissions_categories: number;
    };
    recentActivity: {
        recent_batches: Array<{
            id: number;
            name: string;
            vendor_name: string;
            status: string;
            products_count: number;
            created_at: string;
            created_at_human: string;
        }>;
        recent_vendors: Array<{
            id: number;
            name: string;
            email: string;
            status: string;
            products_count: number;
            created_at: string;
            created_at_human: string;
        }>;
    };
    chartData: {
        product_growth: Array<{
            date: string;
            count: number;
        }>;
        batch_progress: Array<{
            date: string;
            total: number;
            completed: number;
            completion_rate: number;
        }>;
        revenue_trends: Array<{
            date: string;
            revenue: number;
            products: number;
        }>;
    };
}

export default function SuperAdminDashboard({
    platformAnalytics,
    vendorAnalytics,
    productAnalytics,
    rbacAnalytics,
    recentActivity,
    chartData,
}: SuperAdminDashboardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'active':
            case 'approved':
            case 'verified':
                return 'default';
            case 'pending':
            case 'draft':
                return 'secondary';
            case 'sent_for_review':
                return 'outline';
            case 'inactive':
            case 'rejected':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

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

    const productGrowthConfig = {
        count: {
            label: 'Products',
            color: 'hsl(var(--chart-1))',
        },
    } satisfies ChartConfig;

    const revenueConfig = {
        revenue: {
            label: 'Revenue',
            color: 'hsl(var(--chart-2))',
        },
    } satisfies ChartConfig;

    return (
        <AppLayout>
            <Head title="Platform Dashboard" />

            <div className="space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Platform Dashboard</h1>
                        <p className="text-muted-foreground">Monitor platform metrics, vendors, and business operations</p>
                    </div>
                    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                        <Button asChild className="justify-center">
                            <Link href={route('vendors.index')}>
                                <Building2 className="mr-2 h-4 w-4" />
                                Manage Vendors
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

                {/* Platform Overview Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{platformAnalytics.total_products.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">{platformAnalytics.unique_products.toLocaleString()} unique items</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{platformAnalytics.active_vendors}</div>
                            <p className="text-xs text-muted-foreground">of {platformAnalytics.total_vendors} total vendors</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Platform Value</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(platformAnalytics.platform_value)}</div>
                            <p className="text-xs text-muted-foreground">Total inventory value</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
                            <Package2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{platformAnalytics.active_batches}</div>
                            <p className="text-xs text-muted-foreground">of {platformAnalytics.total_batches} total batches</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {/* Product Growth Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Product Growth (30 Days)
                            </CardTitle>
                            <CardDescription>Daily product additions to platform</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {chartData.product_growth.length > 0 ? (
                                <ChartContainer config={productGrowthConfig} className="h-48 sm:h-56">
                                    <AreaChart data={chartData.product_growth}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        />
                                        <YAxis />
                                        <ChartTooltip content={<ChartTooltipContent />} />
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

                    {/* Revenue Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Revenue Trends (30 Days)
                            </CardTitle>
                            <CardDescription>Daily inventory value trends</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {chartData.revenue_trends.length > 0 ? (
                                <ChartContainer config={revenueConfig} className="h-48 sm:h-56">
                                    <LineChart data={chartData.revenue_trends}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        />
                                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                            formatter={(value) => [formatCurrency(value as number), 'Revenue']}
                                        />
                                        <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
                                    </LineChart>
                                </ChartContainer>
                            ) : (
                                <div className="flex h-48 items-center justify-center text-muted-foreground">No data available</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Batch Progress */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PackageCheck className="h-5 w-5" />
                                Batch Completion
                            </CardTitle>
                            <CardDescription>Batch processing efficiency</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Pending Review</span>
                                    <span className="text-2xl font-bold">{productAnalytics.pending_review}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Avg Batch Size</span>
                                    <span className="text-2xl font-bold">{Math.round(productAnalytics.avg_batch_size)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Verified Products</span>
                                    <span className="text-2xl font-bold">{productAnalytics.verified_products.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Analytics Grid */}
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {/* Top Vendors */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Top Vendors</CardTitle>
                                    <CardDescription>Most active vendors by product count</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={route('vendors.index')}>View All</Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {vendorAnalytics.top_vendors.length === 0 ? (
                                    <div className="py-6 text-center text-muted-foreground">No vendors found</div>
                                ) : (
                                    vendorAnalytics.top_vendors.map((vendor) => (
                                        <div key={vendor.id} className="flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">{vendor.name}</p>
                                                <p className="truncate text-xs text-muted-foreground">{vendor.email}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={getStatusBadgeVariant(vendor.status)} className="text-xs">
                                                    {vendor.status}
                                                </Badge>
                                                <span className="text-sm font-medium">{vendor.products_count}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Categories */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Categories</CardTitle>
                            <CardDescription>Most popular product categories</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(productAnalytics.top_categories).length === 0 ? (
                                    <div className="py-6 text-center text-muted-foreground">No categories found</div>
                                ) : (
                                    Object.entries(productAnalytics.top_categories).map(([category, count]) => {
                                        const maxValue = Math.max(...Object.values(productAnalytics.top_categories), 1);
                                        return (
                                            <div key={category} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">{category}</span>
                                                    <span className="text-sm text-muted-foreground">{count}</span>
                                                </div>
                                                <Progress value={(count / maxValue) * 100} className="h-2" />
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* RBAC Analytics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                RBAC Overview
                            </CardTitle>
                            <CardDescription>User roles and permissions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold">{rbacAnalytics.total_roles}</div>
                                        <div className="text-xs text-muted-foreground">Total Roles</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{rbacAnalytics.total_permissions}</div>
                                        <div className="text-xs text-muted-foreground">Permissions</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {rbacAnalytics.users_by_role.map((role) => (
                                        <div key={role.slug} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={getRoleBadgeVariant(role.slug)} className="text-xs">
                                                    {role.role}
                                                </Badge>
                                                <span className="text-sm">{role.users}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{role.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Batches */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Batches</CardTitle>
                                    <CardDescription>Latest batch submissions and activity</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={route('batches.index')}>View All</Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.recent_batches.length === 0 ? (
                                    <div className="py-6 text-center text-muted-foreground">No batches found</div>
                                ) : (
                                    recentActivity.recent_batches.map((batch) => (
                                        <div key={batch.id} className="flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">{batch.name}</p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {batch.vendor_name} • {batch.products_count} products
                                                </p>
                                                <p className="text-xs text-muted-foreground">{batch.created_at_human}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={getStatusBadgeVariant(batch.status)} className="text-xs">
                                                    {batch.status.replace('_', ' ')}
                                                </Badge>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={route('batches.show', { batch: batch.id })}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Vendors */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Vendors</CardTitle>
                                    <CardDescription>Latest vendor registrations</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={route('vendors.index')}>View All</Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.recent_vendors.length === 0 ? (
                                    <div className="py-6 text-center text-muted-foreground">No vendors found</div>
                                ) : (
                                    recentActivity.recent_vendors.map((vendor) => (
                                        <div key={vendor.id} className="flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">{vendor.name}</p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {vendor.email} • {vendor.products_count} products
                                                </p>
                                                <p className="text-xs text-muted-foreground">{vendor.created_at_human}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={getStatusBadgeVariant(vendor.status)} className="text-xs">
                                                    {vendor.status}
                                                </Badge>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={route('vendors.show', { vendor: vendor.id })}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Platform Health
                        </CardTitle>
                        <CardDescription>Key platform metrics and status indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 flex-shrink-0 rounded-full bg-green-500"></div>
                                <span className="text-sm">New vendors this month: {vendorAnalytics.new_this_month}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 flex-shrink-0 rounded-full bg-blue-500"></div>
                                <span className="text-sm">Total users: {platformAnalytics.total_users}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 flex-shrink-0 rounded-full bg-yellow-500"></div>
                                <span className="text-sm">Permission categories: {rbacAnalytics.permissions_categories}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 flex-shrink-0 rounded-full bg-purple-500"></div>
                                <span className="text-sm">Revenue: {formatCurrency(vendorAnalytics.total_revenue_processed)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
