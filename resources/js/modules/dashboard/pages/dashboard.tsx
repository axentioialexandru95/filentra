import { type BreadcrumbItem } from '@/core/types';
import { PlaceholderPattern } from '@/shared/components/ui/placeholder-pattern';
import AppLayout from '@/shared/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Activity, DollarSign, Eye, Package, Package2, PackageCheck, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { Progress } from '@/shared/components/ui/progress';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface VendorDashboardProps {
    vendor?: {
        id: number;
        name: string;
        status: string;
        company_email: string;
    };
    stats?: {
        total_products: number;
        total_batches: number;
        active_batches: number;
        completed_batches: number;
        rejected_batches: number;
        total_value: number;
        average_price: number;
    };
    products_by_status?: Record<string, number>;
    recent_products?: Array<{
        id: number;
        title: string;
        sku: string;
        status: string;
        listing_price: number;
        created_at: string;
        created_at_human: string;
    }>;
    recent_batches?: Array<{
        id: number;
        name: string;
        status: string;
        total_products: number;
        created_at: string;
        created_at_human: string;
    }>;
    chart_data?: {
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

export default function Dashboard({ vendor, stats, products_by_status, recent_products, recent_batches, chart_data }: VendorDashboardProps) {
    const formatCurrency = (amount: number | string | null | undefined) => {
        const numAmount = Number(amount || 0);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numAmount);
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

    // If vendor data is available, show vendor dashboard
    if (vendor && stats) {
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
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Vendor Dashboard" />
                <div className="space-y-6 p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Vendor Dashboard</h1>
                            <p className="text-muted-foreground">Monitor your products, batches, and performance</p>
                        </div>
                        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                            <Button asChild className="justify-center">
                                <Link href={route('products.index')}>
                                    <Package className="mr-2 h-4 w-4" />
                                    My Products
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="justify-center">
                                <Link href={route('batches.index')}>
                                    <Package2 className="mr-2 h-4 w-4" />
                                    My Batches
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_products.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">Avg. ${Number(stats.average_price || 0).toFixed(2)} per item</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
                                <Package2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.active_batches}</div>
                                <p className="text-xs text-muted-foreground">of {stats.total_batches} total batches</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(stats.total_value)}</div>
                                <p className="text-xs text-muted-foreground">Total inventory value</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Completed Batches</CardTitle>
                                <PackageCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.completed_batches}</div>
                                <p className="text-xs text-muted-foreground">{stats.rejected_batches} rejected</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    {chart_data && (
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Product Growth Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Product Growth (30 Days)
                                    </CardTitle>
                                    <CardDescription>Daily product additions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {chart_data.product_growth.length > 0 ? (
                                        <ChartContainer config={productGrowthConfig} className="h-48 sm:h-56">
                                            <AreaChart data={chart_data.product_growth}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="date"
                                                    tickFormatter={(value) =>
                                                        new Date(value).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })
                                                    }
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
                                    {chart_data.revenue_trends.length > 0 ? (
                                        <ChartContainer config={revenueConfig} className="h-48 sm:h-56">
                                            <LineChart data={chart_data.revenue_trends}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="date"
                                                    tickFormatter={(value) =>
                                                        new Date(value).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })
                                                    }
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
                        </div>
                    )}

                    {/* Recent Activity */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Recent Products */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Recent Products</CardTitle>
                                        <CardDescription>Your latest product additions</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={route('products.index')}>View All</Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recent_products && recent_products.length === 0 ? (
                                        <div className="py-6 text-center text-muted-foreground">No products found</div>
                                    ) : (
                                        recent_products?.map((product) => (
                                            <div key={product.id} className="flex items-center justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium">{product.title}</p>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        SKU: {product.sku} • {formatCurrency(product.listing_price)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{product.created_at_human}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={getStatusBadgeVariant(product.status)} className="text-xs">
                                                        {product.status}
                                                    </Badge>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={route('products.show', { product: product.id })}>
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

                        {/* Recent Batches */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Recent Batches</CardTitle>
                                        <CardDescription>Your latest batch submissions</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={route('batches.index')}>View All</Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recent_batches && recent_batches.length === 0 ? (
                                        <div className="py-6 text-center text-muted-foreground">No batches found</div>
                                    ) : (
                                        recent_batches?.map((batch) => (
                                            <div key={batch.id} className="flex items-center justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium">{batch.name}</p>
                                                    <p className="truncate text-xs text-muted-foreground">{batch.total_products} products</p>
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
                    </div>

                    {/* Product Status Breakdown */}
                    {products_by_status && Object.keys(products_by_status).length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Product Status Overview
                                </CardTitle>
                                <CardDescription>Breakdown of your products by status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Object.entries(products_by_status).length === 0 ? (
                                        <div className="py-6 text-center text-muted-foreground">No products found</div>
                                    ) : (
                                        Object.entries(products_by_status).map(([status, count]) => {
                                            const maxValue = Math.max(...Object.values(products_by_status), 1);
                                            return (
                                                <div key={status} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium capitalize">{status.replace('_', ' ')}</span>
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
                    )}
                </div>
            </AppLayout>
        );
    }

    // Default dashboard for non-vendor users
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
