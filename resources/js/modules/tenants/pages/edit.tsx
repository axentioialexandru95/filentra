import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import AppLayout from '@/shared/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

interface Tenant {
    id: number;
    name: string;
    subdomain: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

interface Props {
    tenant: Tenant;
}

export default function TenantsEdit({ tenant }: Props) {
    const { data, setData, patch, processing, errors, isDirty } = useForm({
        name: tenant.name,
        subdomain: tenant.subdomain,
        status: tenant.status as 'active' | 'inactive',
    });

    const { delete: destroy, processing: deleting } = useForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/tenants/${tenant.id}`, {
            onSuccess: () => {
                // Will redirect back to tenant details or list
            },
        });
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${tenant.name}"? This action cannot be undone and will affect all users in this tenant.`)) {
            destroy(`/tenants/${tenant.id}`, {
                onSuccess: () => {
                    // Will redirect back to tenants list
                },
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout>
            <Head title={`Edit ${tenant.name}`} />

            <div className="space-y-6 px-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" asChild>
                            <Link href={`/tenants/${tenant.id}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Tenant
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Edit {tenant.name}</h1>
                            <p className="text-muted-foreground">Update tenant information and settings</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Edit Form */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tenant Information</CardTitle>
                                <CardDescription>Update the tenant details. Changes will affect the tenant's access and branding.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Tenant Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g., Acme Corporation"
                                            required
                                        />
                                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subdomain">Subdomain</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="subdomain"
                                                type="text"
                                                value={data.subdomain}
                                                onChange={(e) => setData('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                                placeholder="e.g., acme"
                                                pattern="^[a-z0-9-]+$"
                                                required
                                                className="flex-1"
                                            />
                                            <span className="text-sm text-muted-foreground">.test</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Only lowercase letters, numbers, and hyphens allowed.</p>
                                        {errors.subdomain && <p className="text-sm text-red-600">{errors.subdomain}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={data.status} onValueChange={(value) => setData('status', value as 'active' | 'inactive')}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            {deleting ? 'Deleting...' : 'Delete Tenant'}
                                        </Button>

                                        <div className="flex items-center space-x-4">
                                            <Button type="button" variant="outline" asChild>
                                                <Link href={`/tenants/${tenant.id}`}>Cancel</Link>
                                            </Button>
                                            <Button type="submit" disabled={processing || !isDirty}>
                                                {processing ? (
                                                    <>Saving...</>
                                                ) : (
                                                    <>
                                                        <Save className="mr-2 h-4 w-4" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Info Sidebar */}
                    <div className="space-y-6">
                        {/* Current Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Current Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Name</p>
                                    <p className="text-sm">{tenant.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Subdomain</p>
                                    <code className="rounded bg-muted px-2 py-1 text-xs">{tenant.subdomain}.test</code>
                                </div>
                                <div>
                                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Status</p>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                            tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {tenant.status}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timestamps */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Timeline</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Created</p>
                                    <p className="text-sm">{formatDate(tenant.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Last Updated</p>
                                    <p className="text-sm">{formatDate(tenant.updated_at)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preview */}
                        {isDirty && (
                            <Card className="border-blue-200 bg-blue-50">
                                <CardHeader>
                                    <CardTitle className="text-base text-blue-900">Preview Changes</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-xs font-medium tracking-wide text-blue-700 uppercase">New Name</p>
                                        <p className="text-sm text-blue-900">{data.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium tracking-wide text-blue-700 uppercase">New URL</p>
                                        <code className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-900">{data.subdomain}.test</code>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium tracking-wide text-blue-700 uppercase">New Status</p>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                data.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {data.status}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
