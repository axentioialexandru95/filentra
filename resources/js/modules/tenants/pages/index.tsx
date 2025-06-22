import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import AppLayout from '@/shared/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Building, Eye, Plus, Settings, Users } from 'lucide-react';

interface Tenant {
    id: number;
    name: string;
    subdomain: string;
    status: 'active' | 'inactive';
    users_count: number;
    created_at: string;
}

interface Stats {
    total: number;
    active: number;
    inactive: number;
}

interface Props {
    tenants: {
        data: Tenant[];
    };
    stats: Stats;
}

export default function TenantsIndex({ tenants, stats }: Props) {
    return (
        <AppLayout>
            <Head title="Tenant Management" />

            <div className="space-y-6 px-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
                        <p className="text-muted-foreground">Manage all tenants in the system. Only superadmins can access this section.</p>
                    </div>
                    <Button asChild>
                        <Link href="/tenants/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Tenant
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active</CardTitle>
                            <Building className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                            <Building className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.inactive}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tenants List */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Tenants</CardTitle>
                        <CardDescription>A list of all tenants in the system with their current status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {tenants.data.map((tenant) => (
                                <div key={tenant.id} className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <h3 className="font-medium">{tenant.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    <code>{tenant.subdomain}.test</code>
                                                </p>
                                            </div>
                                            <Badge
                                                variant={tenant.status === 'active' ? 'default' : 'secondary'}
                                                className={tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                            >
                                                {tenant.status}
                                            </Badge>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Users className="mr-1 h-4 w-4" />
                                                {tenant.users_count} users
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Created: {new Date(tenant.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/tenants/${tenant.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/tenants/${tenant.id}/edit`}>
                                                <Settings className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {tenants.data.length === 0 && (
                            <div className="py-8 text-center text-muted-foreground">No tenants found. Create your first tenant to get started.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
