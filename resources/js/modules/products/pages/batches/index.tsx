import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import AppLayout from '@/shared/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, Eye, Plus, Search, Send, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Batch {
    id: number;
    name: string;
    description?: string;
    status: string;
    status_display: string;
    total_products: number;
    verified_products: number;
    sent_for_review_at?: string;
    reviewed_at?: string;
    created_at: string;
    vendor?: {
        id: number;
        name: string;
        email: string;
    };
    reviewer?: {
        id: number;
        name: string;
        email: string;
    };
    can_send_for_review: boolean;
    can_edit: boolean;
    can_delete: boolean;
}

interface PageProps {
    data: {
        data: Batch[];
        current_page: number;
        last_page: number;
        total: number;
    };
    stats: {
        total: number;
        draft: number;
        sent_for_review: number;
        reviewed: number;
    };
    filters: {
        search?: string;
        status?: string;
        vendor_id?: string;
    };
    can_create_batch: boolean;
    can_review_batches: boolean;
}

export default function BatchesIndex({ data, stats, filters, can_create_batch, can_review_batches }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = () => {
        router.get(
            route('batches.index'),
            {
                search: search || undefined,
                status: status === 'all' ? undefined : status || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const sendForReview = (batchId: number) => {
        router.patch(
            route('batches.send-for-review', { batch: batchId }),
            {},
            {
                preserveState: true,
            },
        );
    };

    const reviewBatch = (batchId: number, status: 'approved' | 'rejected', notes?: string) => {
        router.patch(
            route('batches.review', { batch: batchId }),
            {
                status,
                notes,
            },
            {
                preserveState: true,
            },
        );
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'approved':
                return 'default';
            case 'rejected':
                return 'destructive';
            case 'sent_for_review':
                return 'secondary';
            case 'reviewed':
                return 'default';
            default:
                return 'outline';
        }
    };

    return (
        <AppLayout>
            <Head title="Product Batches" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Product Batches</h1>
                        <p className="text-muted-foreground">Manage product batches for verification and quality control</p>
                    </div>
                    {can_create_batch && (
                        <Link href={route('batches.create')}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Batch
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Draft</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.draft}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.sent_for_review}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.reviewed}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search batches by name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="sent_for_review">Sent for Review</SelectItem>
                                    <SelectItem value="reviewed">Reviewed</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleSearch}>
                                <Search className="mr-2 h-4 w-4" />
                                Search
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Batches Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Batches ({data.total})</CardTitle>
                        <CardDescription>A list of all product batches and their verification status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Batch Name</TableHead>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Products</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.data.map((batch) => (
                                    <TableRow key={batch.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{batch.name}</div>
                                                {batch.description && (
                                                    <div className="text-sm text-muted-foreground">{batch.description.substring(0, 50)}...</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {batch.vendor && (
                                                <div>
                                                    <div className="font-medium">{batch.vendor.name}</div>
                                                    <div className="text-sm text-muted-foreground">{batch.vendor.email}</div>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{batch.total_products} total</div>
                                                <div className="text-sm text-muted-foreground">{batch.verified_products} verified</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(batch.status)}>{batch.status_display}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{new Date(batch.created_at).toLocaleDateString()}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Link href={route('batches.show', { batch: batch.id })}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {batch.can_send_for_review && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => sendForReview(batch.id)}
                                                        className="text-blue-600"
                                                    >
                                                        <Send className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {can_review_batches && batch.status === 'sent_for_review' && (
                                                    <div className="flex space-x-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => reviewBatch(batch.id, 'approved', 'Approved')}
                                                            className="text-green-600"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => reviewBatch(batch.id, 'rejected', 'Rejected')}
                                                            className="text-red-600"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
