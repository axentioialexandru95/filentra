import { type BreadcrumbItem } from '@/core/types';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Eye, Mail, Phone, Plus, Search, Users } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import AppLayout from '@/shared/layouts/app-layout';

import { CreateVendorDialog } from '../components';
import { type VendorsIndexProps } from '../types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vendors',
        href: '/vendors',
    },
];

export default function VendorsIndex({ vendors, stats, filters }: VendorsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = () => {
        const searchParams: { search?: string; status?: string } = {};
        if (search) searchParams.search = search;
        if (status && status !== 'all') searchParams.status = status;

        router.get(route('vendors.index'), searchParams, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        router.get(
            route('vendors.index'),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'active':
                return 'default';
            case 'inactive':
                return 'secondary';
            case 'pending':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vendor Management" />

            <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
                {/* Header Section - Responsive */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Vendor Management</h2>
                        <p className="text-sm text-muted-foreground sm:text-base">Manage vendor businesses and their operations</p>
                    </div>
                    <div className="flex justify-end">
                        <CreateVendorDialog />
                    </div>
                </div>

                {/* Stats Cards - Improved Responsive Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card className="transition-all duration-200 hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card className="transition-all duration-200 hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active</CardTitle>
                            <Badge variant="default" className="h-4 shrink-0 px-1 text-xs">
                                Active
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active}</div>
                        </CardContent>
                    </Card>
                    <Card className="transition-all duration-200 hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                            <Badge variant="secondary" className="h-4 shrink-0 px-1 text-xs">
                                Inactive
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.inactive}</div>
                        </CardContent>
                    </Card>
                    <Card className="transition-all duration-200 hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Badge variant="outline" className="h-4 shrink-0 px-1 text-xs">
                                Pending
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters - Improved Mobile Layout */}
                <Card>
                    <CardHeader>
                        <CardTitle>Search & Filter</CardTitle>
                        <CardDescription>Find vendors by name, email, or contact person</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                            <div className="min-w-0 flex-1">
                                <Input
                                    placeholder="Search vendors..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 lg:flex-row lg:space-x-2">
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="w-full sm:w-48">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex space-x-2">
                                    <Button onClick={handleSearch} className="flex-1 sm:flex-none">
                                        <Search className="mr-2 h-4 w-4" />
                                        Search
                                    </Button>
                                    <Button variant="outline" onClick={handleReset} className="flex-1 sm:flex-none">
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Vendors List - Better Responsive Grid */}
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {vendors.data.map((vendor) => (
                        <Card key={vendor.id} className="transition-all duration-200 hover:shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between space-x-4">
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <CardTitle className="text-lg leading-tight">{vendor.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-1 text-sm break-all">
                                            <Mail className="h-3 w-3 shrink-0" />
                                            <span className="truncate">{vendor.company_email}</span>
                                        </CardDescription>
                                    </div>
                                    <Badge variant={getStatusBadgeVariant(vendor.status)} className="shrink-0 capitalize">
                                        {vendor.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-3">
                                    {vendor.contact_person && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="h-3 w-3 shrink-0" />
                                            <span className="truncate">{vendor.contact_person}</span>
                                        </div>
                                    )}
                                    {vendor.phone && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Phone className="h-3 w-3 shrink-0" />
                                            <span className="truncate">{vendor.phone}</span>
                                        </div>
                                    )}

                                    {vendor.stats && (
                                        <div className="grid grid-cols-3 gap-2 border-t pt-3">
                                            <div className="text-center">
                                                <div className="text-lg font-semibold">{vendor.stats.total_users}</div>
                                                <div className="text-xs text-muted-foreground">Users</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-semibold">{vendor.stats.total_batches}</div>
                                                <div className="text-xs text-muted-foreground">Batches</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-semibold">{vendor.stats.total_products}</div>
                                                <div className="text-xs text-muted-foreground">Products</div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col space-y-2 pt-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                        <span className="text-xs text-muted-foreground">Created {formatDate(vendor.created_at)}</span>
                                        <Link href={route('vendors.show', { vendor: vendor.id })}>
                                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                                <Eye className="mr-1 h-3 w-3" />
                                                View
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {vendors.data.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-semibold">No vendors found</h3>
                            <p className="mb-4 max-w-md text-muted-foreground">
                                {search || status !== 'all'
                                    ? 'No vendors match your current filters.'
                                    : 'Get started by adding your first vendor business.'}
                            </p>
                            {!search && status === 'all' && (
                                <CreateVendorDialog>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add First Vendor
                                    </Button>
                                </CreateVendorDialog>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Pagination - Responsive */}
                {vendors.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                        {vendors.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className="min-w-0 px-2 sm:px-3"
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
