import { type BreadcrumbItem } from '@/core/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, Calendar, CheckCircle, Clock, Edit, Mail, Package, Phone, Users, XCircle } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import AppLayout from '@/shared/layouts/app-layout';

import { type VendorShowProps } from '../types';

export default function VendorShow({ vendor, recentBatches, stats }: VendorShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Vendors',
            href: '/vendors',
        },
        {
            title: vendor.name,
            href: `/vendors/${vendor.id}`,
        },
    ];

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

    const getBatchStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'rejected':
                return <XCircle className="h-4 w-4 text-red-600" />;
            case 'reviewed':
                return <CheckCircle className="h-4 w-4 text-blue-600" />;
            case 'sent_for_review':
                return <Clock className="h-4 w-4 text-yellow-600" />;
            default:
                return <Package className="h-4 w-4 text-gray-600" />;
        }
    };

    const getBatchStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'approved':
                return 'default';
            case 'rejected':
                return 'destructive';
            case 'reviewed':
                return 'default';
            case 'sent_for_review':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${vendor.name} - Vendors`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('vendors.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Vendors
                            </Button>
                        </Link>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">{vendor.name}</h2>
                            <p className="text-muted-foreground">Vendor business profile and operations</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(vendor.status)} className="capitalize">
                            {vendor.status}
                        </Badge>
                        <Link href={route('vendors.edit', { vendor: vendor.id })}>
                            <Button variant="outline">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Vendor
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.users}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.products}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.batches.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.batches.sent_for_review}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Vendor Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Vendor Information</CardTitle>
                            <CardDescription>Business details and contact information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Company Email:</span>
                                </div>
                                <p className="ml-6 text-sm">{vendor.company_email}</p>
                            </div>

                            {vendor.phone && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Phone:</span>
                                        </div>
                                        <p className="ml-6 text-sm">{vendor.phone}</p>
                                    </div>
                                </>
                            )}

                            {vendor.contact_person && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Contact Person:</span>
                                        </div>
                                        <p className="ml-6 text-sm">{vendor.contact_person}</p>
                                    </div>
                                </>
                            )}

                            {vendor.address && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Address:</span>
                                        </div>
                                        <p className="ml-6 text-sm">{vendor.address}</p>
                                    </div>
                                </>
                            )}

                            {vendor.registration_number && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <span className="font-medium">Registration Number:</span>
                                        <p className="text-sm">{vendor.registration_number}</p>
                                    </div>
                                </>
                            )}

                            {vendor.description && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <span className="font-medium">Description:</span>
                                        <p className="text-sm">{vendor.description}</p>
                                    </div>
                                </>
                            )}

                            <Separator />
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Created {formatDate(vendor.created_at)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Batch Status Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Batch Status Overview</CardTitle>
                            <CardDescription>Current status of all batches from this vendor</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded bg-gray-400"></div>
                                        <span className="text-sm">Draft</span>
                                    </div>
                                    <span className="font-semibold">{stats.batches.draft}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded bg-yellow-400"></div>
                                        <span className="text-sm">Sent for Review</span>
                                    </div>
                                    <span className="font-semibold">{stats.batches.sent_for_review}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded bg-blue-400"></div>
                                        <span className="text-sm">Reviewed</span>
                                    </div>
                                    <span className="font-semibold">{stats.batches.reviewed}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded bg-green-400"></div>
                                        <span className="text-sm">Approved</span>
                                    </div>
                                    <span className="font-semibold">{stats.batches.approved}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded bg-red-400"></div>
                                        <span className="text-sm">Rejected</span>
                                    </div>
                                    <span className="font-semibold">{stats.batches.rejected}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Batches */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Batches</CardTitle>
                        <CardDescription>Latest batch submissions from this vendor</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentBatches.length > 0 ? (
                            <div className="space-y-4">
                                {recentBatches.map((batch) => (
                                    <div key={batch.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center gap-4">
                                            {getBatchStatusIcon(batch.status)}
                                            <div>
                                                <h4 className="font-medium">{batch.name}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {batch.products_count} products • Created by {batch.user.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant={getBatchStatusBadgeVariant(batch.status)}>{batch.status.replace('_', ' ')}</Badge>
                                            <span className="text-sm text-muted-foreground">{formatDate(batch.created_at)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center">
                                <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">No batches yet</h3>
                                <p className="text-muted-foreground">This vendor hasn't submitted any batches.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Vendor Users */}
                <Card>
                    <CardHeader>
                        <CardTitle>Vendor Users</CardTitle>
                        <CardDescription>Team members working for this vendor</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {vendor.users && vendor.users.length > 0 ? (
                            <div className="space-y-4">
                                {vendor.users.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <h4 className="font-medium">{user.name}</h4>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {user.role && <Badge variant="outline">{user.role.name}</Badge>}
                                            <span className="text-sm text-muted-foreground">Joined {formatDate(user.created_at)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center">
                                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">No users assigned</h3>
                                <p className="text-muted-foreground">No users are currently assigned to this vendor.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
