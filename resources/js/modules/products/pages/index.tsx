import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import AppLayout from '@/shared/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Upload } from 'lucide-react';
import { useState } from 'react';
import type { BadgeVariant, ProductsIndexProps, ProductStatus, QualityRating } from '../types';

export default function ProductsIndex({ data, stats, filters, can_upload_csv, can_manage_quality }: ProductsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState<ProductStatus | '' | 'all'>(filters.status || '');
    const [quality, setQuality] = useState<QualityRating | '' | 'all'>(filters.quality || '');
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleSearch = () => {
        router.get(
            route('products.index'),
            {
                search: search || undefined,
                status: status === 'all' ? undefined : status || undefined,
                quality: quality === 'all' ? undefined : quality || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleCsvUpload = async () => {
        if (!csvFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('csv_file', csvFile);

        try {
            await router.post(route('products.upload-csv'), formData, {
                forceFormData: true,
                onSuccess: () => {
                    setCsvFile(null);
                },
                onFinish: () => {
                    setUploading(false);
                },
            });
        } catch (e) {
            console.error(e);
            setUploading(false);
        }
    };

    const updateQuality = (productId: number, qualityRating: QualityRating, notes?: string) => {
        router.patch(
            route('products.update-quality', { product: productId }),
            {
                quality_rating: qualityRating,
                notes,
            },
            {
                preserveState: true,
            },
        );
    };

    const getStatusBadgeVariant = (status: ProductStatus): BadgeVariant => {
        switch (status) {
            case 'verified':
                return 'default'; // Using 'default' instead of 'success' since it's not in the type
            case 'rejected':
                return 'destructive';
            case 'sent_for_review':
                return 'secondary';
            case 'in_batch':
                return 'default';
            default:
                return 'outline';
        }
    };

    const getQualityBadgeVariant = (quality: QualityRating): BadgeVariant => {
        switch (quality) {
            case 'A':
                return 'default'; // Using 'default' instead of 'success'
            case 'B':
                return 'secondary';
            case 'C':
                return 'outline';
            default:
                return 'outline';
        }
    };

    return (
        <AppLayout>
            <Head title="Products" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                        <p className="text-muted-foreground">Manage your product inventory and quality control</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {can_upload_csv && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload CSV
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Upload Products CSV</DialogTitle>
                                        <DialogDescription>
                                            Upload a CSV file containing product data. Make sure it includes all required fields.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="csv-file">CSV File</Label>
                                            <Input
                                                id="csv-file"
                                                type="file"
                                                accept=".csv,.txt"
                                                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                                            />
                                        </div>
                                        <Button onClick={handleCsvUpload} disabled={!csvFile || uploading} className="w-full">
                                            {uploading ? 'Uploading...' : 'Upload CSV'}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                        <Link href={route('products.create')}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Verified</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.verified}</div>
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
                                    placeholder="Search by title, SKU, ASIN, or brand..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Select value={status} onValueChange={(value: ProductStatus | '' | 'all') => setStatus(value)}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filter by status" />
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
                            <Select value={quality} onValueChange={(value: QualityRating | '' | 'all') => setQuality(value)}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filter by quality" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Qualities</SelectItem>
                                    <SelectItem value="A">Grade A</SelectItem>
                                    <SelectItem value="B">Grade B</SelectItem>
                                    <SelectItem value="C">Grade C</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleSearch}>
                                <Search className="mr-2 h-4 w-4" />
                                Search
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Products ({data.total})</CardTitle>
                        <CardDescription>A list of all products in your inventory</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>ASIN/SKU</TableHead>
                                    <TableHead>Condition</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Quality</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.data.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{product.title.substring(0, 50)}...</div>
                                                <div className="text-sm text-muted-foreground">{product.brand}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="text-sm">ASIN: {product.asin}</div>
                                                <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{product.condition.replace('_', ' ')}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{product.formatted_price}</div>
                                                <div className="text-sm text-muted-foreground line-through">{product.formatted_original_price}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(product.status)}>{product.status_display}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {product.quality_rating ? (
                                                <Badge variant={getQualityBadgeVariant(product.quality_rating)}>{product.quality_display}</Badge>
                                            ) : (
                                                <span className="text-muted-foreground">Not Rated</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Link href={route('products.show', { product: product.id })}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={route('products.edit', { product: product.id })}>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {can_manage_quality && product.status === 'sent_for_review' && (
                                                    <div className="flex space-x-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => updateQuality(product.id, 'A')}
                                                            className="text-green-600"
                                                        >
                                                            A
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => updateQuality(product.id, 'B')}
                                                            className="text-yellow-600"
                                                        >
                                                            B
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => updateQuality(product.id, 'C')}
                                                            className="text-red-600"
                                                        >
                                                            C
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
