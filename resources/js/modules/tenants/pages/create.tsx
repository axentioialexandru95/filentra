import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import AppLayout from '@/shared/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';

export default function TenantsCreate() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        subdomain: '',
        status: 'active' as 'active' | 'inactive',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tenants', {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleSubdomainChange = (value: string) => {
        // Auto-generate subdomain from name if subdomain is empty
        if (!data.subdomain && value) {
            const subdomain = value
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            setData({ ...data, name: value, subdomain });
        } else {
            setData('name', value);
        }
    };

    return (
        <AppLayout>
            <Head title="Create Tenant" />

            <div className="space-y-6 px-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" asChild>
                            <Link href="/tenants">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Tenants
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Create New Tenant</h1>
                            <p className="text-muted-foreground">Add a new tenant to the system with a unique subdomain.</p>
                        </div>
                    </div>
                </div>

                {/* Create Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Tenant Information</CardTitle>
                        <CardDescription>Fill in the details for the new tenant. The subdomain will be used for access.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Tenant Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => handleSubdomainChange(e.target.value)}
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

                            <div className="flex items-center justify-end space-x-4 pt-4">
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/tenants">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <>Creating...</>
                                    ) : (
                                        <>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Tenant
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Preview */}
                {data.subdomain && (
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <CardDescription>This is how the tenant will appear in the system.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Tenant Name:</span>
                                    <span className="text-sm text-muted-foreground">{data.name || 'Not specified'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Access URL:</span>
                                    <code className="rounded bg-muted px-2 py-1 text-sm">{data.subdomain}.test</code>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Status:</span>
                                    <span
                                        className={`rounded-full px-2 py-1 text-sm ${data.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                    >
                                        {data.status}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
