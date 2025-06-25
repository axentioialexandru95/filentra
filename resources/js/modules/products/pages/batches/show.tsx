import { type BreadcrumbItem } from '@/core/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, Calendar, CheckCircle, Edit, Filter, Package, Search, Send, User } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Separator } from '@/shared/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import AppLayout from '@/shared/layouts/app-layout';

import { type BatchShowProps, type Product, type ProductBatch } from '../../types';

export default function BatchShow({ batch, products, filters }: BatchShowProps) {
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [productReviewDialogOpen, setProductReviewDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [qualityFilter, setQualityFilter] = useState(filters.quality || 'all');
    const [conditionFilter, setConditionFilter] = useState(filters.condition || 'all');

    // The actual batch data is nested under batch.data
    const batchData = (batch as unknown as { data?: ProductBatch })?.data || batch;
    const batchProducts: Product[] = products.data || [];

    console.log('BatchShow - batchData:', batchData);
    console.log('BatchShow - products:', products);
    console.log('BatchShow - batchProducts length:', batchProducts.length);

    const {
        data: reviewData,
        setData: setReviewData,
        patch: submitReview,
        processing: reviewProcessing,
    } = useForm({
        status: '',
        notes: '',
    });

    const {
        data: productData,
        setData: setProductData,
        patch: submitProductReview,
        processing: productProcessing,
    } = useForm({
        quality_rating: '',
        notes: '',
    });

    // Handle case where batch is undefined
    if (!batch) {
        return (
            <AppLayout breadcrumbs={[]}>
                <Head title="Batch Not Found" />
                <div className="flex min-h-[400px] items-center justify-center">
                    <div className="text-center">
                        <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                        <h1 className="mb-2 text-xl font-semibold">Batch Not Found</h1>
                        <p className="mb-4 text-muted-foreground">The requested batch could not be loaded.</p>
                        <Link href={route('batches.index')}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Batches
                            </Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Batches',
            href: '/batches',
        },
        {
            title: batchData?.name || 'Batch Details',
            href: `/batches/${batchData?.id}`,
        },
    ];

    const getStatusBadgeVariant = (status: string) => {
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

    const getQualityBadgeVariant = (quality: string) => {
        switch (quality) {
            case 'A':
                return 'default';
            case 'B':
                return 'secondary';
            case 'C':
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
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const handleSearch = () => {
        const searchParams: Record<string, string> = {};
        if (search) searchParams.search = search;
        if (statusFilter && statusFilter !== 'all') searchParams.status = statusFilter;
        if (qualityFilter && qualityFilter !== 'all') searchParams.quality = qualityFilter;
        if (conditionFilter && conditionFilter !== 'all') searchParams.condition = conditionFilter;

        router.get(route('batches.show', { batch: batchData.id }), searchParams, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setStatusFilter('all');
        setQualityFilter('all');
        setConditionFilter('all');
        router.get(
            route('batches.show', { batch: batchData.id }),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handlePageChange = (page: number) => {
        const searchParams: Record<string, string | number> = { page };
        if (search) searchParams.search = search;
        if (statusFilter && statusFilter !== 'all') searchParams.status = statusFilter;
        if (qualityFilter && qualityFilter !== 'all') searchParams.quality = qualityFilter;
        if (conditionFilter && conditionFilter !== 'all') searchParams.condition = conditionFilter;

        router.get(route('batches.show', { batch: batchData.id }), searchParams, {
            preserveState: true,
            replace: true,
        });
    };

    const sendForReview = () => {
        router.patch(
            route('batches.send-for-review', { batch: batchData.id }),
            {},
            {
                preserveState: true,
            },
        );
    };

    const handleReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitReview(route('batches.review', { batch: batchData.id }), {
            onSuccess: () => {
                setReviewDialogOpen(false);
                setReviewData({ status: '', notes: '' });
            },
        });
    };

    const handleProductReview = (product: Product) => {
        setSelectedProduct(product);
        setProductData({
            quality_rating: product.quality_rating || '',
            notes: product.notes || '',
        });
        setProductReviewDialogOpen(true);
    };

    const handleProductReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedProduct) return;

        submitProductReview(route('products.update-quality', { product: selectedProduct.id }), {
            onSuccess: () => {
                setProductReviewDialogOpen(false);
                setSelectedProduct(null);
                setProductData({ quality_rating: '', notes: '' });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${batchData.name} - Batch Details`} />

            <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
                {/* Back Button */}
                <div className="flex items-center">
                    <Link href={route('batches.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Back to Batches</span>
                            <span className="sm:hidden">Back</span>
                        </Button>
                    </Link>
                </div>

                {/* Header Section */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{batchData?.name || 'Batch Details'}</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">Batch details and product verification</p>
                    </div>
                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                        <Badge variant={getStatusBadgeVariant(batchData.status || 'draft')} className="w-fit capitalize">
                            {(batchData.status || 'draft').replace('_', ' ')}
                        </Badge>

                        {batchData.status === 'draft' && (
                            <Button onClick={sendForReview} className="w-full sm:w-auto">
                                <Send className="mr-2 h-4 w-4" />
                                Send for Review
                            </Button>
                        )}

                        {batchData.status === 'sent_for_review' && (
                            <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full sm:w-auto">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Review Batch
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Review Batch</DialogTitle>
                                        <DialogDescription>Approve or reject this batch with optional notes.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Decision</Label>
                                            <Select value={reviewData.status} onValueChange={(value) => setReviewData('status', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select decision" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="approved">Approve</SelectItem>
                                                    <SelectItem value="rejected">Reject</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="notes">Notes (Optional)</Label>
                                            <textarea
                                                id="notes"
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Add any notes about this decision..."
                                                value={reviewData.notes}
                                                onChange={(e) => setReviewData('notes', e.target.value)}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setReviewDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={!reviewData.status || reviewProcessing}>
                                                {reviewProcessing ? 'Submitting...' : 'Submit Review'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </div>

                {/* Batch Information */}
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Batch Information</CardTitle>
                                <CardDescription>Details about this product batch</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {batchData.description && (
                                    <div className="space-y-2">
                                        <span className="font-medium">Description:</span>
                                        <p className="text-sm text-muted-foreground">{batchData.description}</p>
                                    </div>
                                )}

                                <Separator />

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Total Products:</span>
                                        </div>
                                        <p className="text-2xl font-bold">{batchData?.total_products || 0}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span className="font-medium">Verified Products:</span>
                                        </div>
                                        <p className="text-2xl font-bold">{batchData?.verified_products || 0}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Created:</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{formatDate(batchData.created_at)}</p>
                                </div>

                                {batchData.sent_for_review_at && (
                                    <>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Send className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">Sent for Review:</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{formatDate(batchData.sent_for_review_at)}</p>
                                        </div>
                                    </>
                                )}

                                {batchData.reviewed_at && batchData.reviewer && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">Reviewed by:</span>
                                            </div>
                                            <p className="text-sm">{batchData.reviewer.name}</p>
                                            <p className="text-sm text-muted-foreground">on {formatDate(batchData.reviewed_at)}</p>
                                        </div>
                                    </>
                                )}

                                {batchData.notes && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <span className="font-medium">Review Notes:</span>
                                            <p className="text-sm text-muted-foreground">{batchData.notes}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Vendor Information</CardTitle>
                                <CardDescription>Details about the submitting vendor</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {batchData.vendor && (
                                    <>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">Vendor:</span>
                                            </div>
                                            <p className="text-sm">{batchData.vendor.name}</p>
                                            <p className="text-sm text-muted-foreground">{batchData.vendor.email}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Products in Batch */}
                <Card>
                    <CardHeader>
                        <CardTitle>Products in Batch ({products.total})</CardTitle>
                        <CardDescription>All products included in this batch for verification</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Search and Filters */}
                        <div className="mb-6 space-y-4">
                            <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                                <div className="min-w-0 flex-1">
                                    <Input
                                        placeholder="Search products by title, SKU, ASIN, or brand..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-full sm:w-40">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in_batch">In Batch</SelectItem>
                                            <SelectItem value="sent_for_review">Sent for Review</SelectItem>
                                            <SelectItem value="verified">Verified</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={qualityFilter} onValueChange={setQualityFilter}>
                                        <SelectTrigger className="w-full sm:w-32">
                                            <SelectValue placeholder="Quality" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Grades</SelectItem>
                                            <SelectItem value="A">Grade A</SelectItem>
                                            <SelectItem value="B">Grade B</SelectItem>
                                            <SelectItem value="C">Grade C</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={conditionFilter} onValueChange={setConditionFilter}>
                                        <SelectTrigger className="w-full sm:w-36">
                                            <SelectValue placeholder="Condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Conditions</SelectItem>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="like_new">Like New</SelectItem>
                                            <SelectItem value="very_good">Very Good</SelectItem>
                                            <SelectItem value="good">Good</SelectItem>
                                            <SelectItem value="acceptable">Acceptable</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="flex space-x-2">
                                        <Button onClick={handleSearch} className="flex-1 sm:flex-none">
                                            <Search className="mr-2 h-4 w-4" />
                                            Search
                                        </Button>
                                        <Button variant="outline" onClick={handleReset} className="flex-1 sm:flex-none">
                                            <Filter className="mr-2 h-4 w-4" />
                                            Reset
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Table */}
                        {batchProducts.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Brand</TableHead>
                                        <TableHead>Condition</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Quality</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {batchProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <div className="max-w-48">
                                                    <div className="truncate font-medium">{product.title || 'Untitled Product'}</div>
                                                    <div className="text-sm text-muted-foreground">SKU: {product.sku || 'N/A'}</div>
                                                    {product.asin && <div className="text-sm text-muted-foreground">ASIN: {product.asin}</div>}
                                                </div>
                                            </TableCell>
                                            <TableCell>{product.brand || 'Unknown'}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{product.condition || 'Unknown'}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{formatCurrency(product.listing_price || 0)}</div>
                                                    {product.original_price && product.original_price !== product.listing_price && (
                                                        <div className="text-sm text-muted-foreground line-through">
                                                            {formatCurrency(product.original_price)}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {product.quality_rating ? (
                                                    <Badge variant={getQualityBadgeVariant(product.quality_rating)}>
                                                        Grade {product.quality_rating}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">Not rated</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(product.status || 'pending')}>
                                                    {(product.status || 'pending').replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Link href={route('products.show', { product: product.id })}>
                                                        <Button variant="ghost" size="sm">
                                                            View
                                                        </Button>
                                                    </Link>
                                                    {(batchData.status === 'sent_for_review' || batchData.status === 'reviewed') && (
                                                        <Button variant="ghost" size="sm" onClick={() => handleProductReview(product)}>
                                                            Rate
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="py-8 text-center">
                                <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">No Products Found</h3>
                                <p className="text-muted-foreground">
                                    {Object.values(filters).some((f) => f && f !== '' && f !== 'all')
                                        ? 'No products match your current filters. Try adjusting your search criteria.'
                                        : 'This batch does not contain any products yet.'}
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {products.total > products.per_page && (
                            <div className="mt-6 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                                <div className="text-sm text-muted-foreground">
                                    Showing {products.from || 0} to {products.to || 0} of {products.total} products
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(products.current_page - 1)}
                                        disabled={products.current_page <= 1}
                                    >
                                        Previous
                                    </Button>

                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: Math.min(7, products.last_page) }, (_, i) => {
                                            const pageNum = i + 1;
                                            const isActive = pageNum === products.current_page;

                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={isActive ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}

                                        {products.last_page > 7 && (
                                            <>
                                                <span className="text-muted-foreground">...</span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePageChange(products.last_page)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {products.last_page}
                                                </Button>
                                            </>
                                        )}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(products.current_page + 1)}
                                        disabled={products.current_page >= products.last_page}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Product Review Dialog */}
                <Dialog open={productReviewDialogOpen} onOpenChange={setProductReviewDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Review Product</DialogTitle>
                            <DialogDescription>Set quality rating and add notes for: {selectedProduct?.title}</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleProductReviewSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="quality_rating">Quality Rating</Label>
                                <Select value={productData.quality_rating} onValueChange={(value) => setProductData('quality_rating', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select quality grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A">Grade A - Excellent</SelectItem>
                                        <SelectItem value="B">Grade B - Good</SelectItem>
                                        <SelectItem value="C">Grade C - Fair</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="product_notes">Notes (Optional)</Label>
                                <textarea
                                    id="product_notes"
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Add any notes about this product's quality..."
                                    value={productData.notes}
                                    onChange={(e) => setProductData('notes', e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setProductReviewDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={!productData.quality_rating || productProcessing}>
                                    {productProcessing ? 'Saving...' : 'Save Rating'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
