import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import AppLayout from '@/shared/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, Edit, Globe, User, Users, XCircle } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    role?: {
        name: string;
        slug: string;
    };
}

interface Tenant {
    id: number;
    name: string;
    subdomain: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

interface Stats {
    total_users: number;
    verified_users: number;
    recent_users: number;
}

interface Props {
    tenant: Tenant;
    users: User[];
    stats: Stats;
}

export default function TenantsShow({ tenant, users, stats }: Props) {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
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
            <Head title={`${tenant.name} - Tenant Details`} />

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
                            <h1 className="text-3xl font-bold tracking-tight">{tenant.name}</h1>
                            <p className="text-muted-foreground">Tenant details and user management</p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/tenants/${tenant.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Tenant
                        </Link>
                    </Button>
                </div>

                {/* Tenant Info */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Globe className="mr-2 h-5 w-5" />
                                Tenant Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Name:</span>
                                <span className="text-sm text-muted-foreground">{tenant.name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Subdomain:</span>
                                <code className="rounded bg-muted px-2 py-1 text-sm">{tenant.subdomain}.test</code>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Status:</span>
                                <Badge
                                    variant={tenant.status === 'active' ? 'default' : 'secondary'}
                                    className={`flex items-center ${tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                >
                                    {tenant.status === 'active' ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                                    {tenant.status}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Created:</span>
                                <span className="text-sm text-muted-foreground">{formatDate(tenant.created_at)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Last Updated:</span>
                                <span className="text-sm text-muted-foreground">{formatDate(tenant.updated_at)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="mr-2 h-5 w-5" />
                                User Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Total Users:</span>
                                <span className="text-2xl font-bold">{stats.total_users}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Verified Users:</span>
                                <span className="text-lg font-semibold text-green-600">{stats.verified_users}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Unverified Users:</span>
                                <span className="text-lg font-semibold text-red-600">{stats.total_users - stats.verified_users}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Recent Users:</span>
                                <span className="text-sm text-muted-foreground">{stats.recent_users} (last 7 days)</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Users List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <User className="mr-2 h-5 w-5" />
                            Users in this Tenant
                        </CardTitle>
                        <CardDescription>All users that belong to {tenant.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {users.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mt-2 text-sm font-semibold">No users yet</h3>
                                <p className="mt-1 text-sm">This tenant doesn't have any users assigned.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {users.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="text-sm">{getInitials(user.name)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-medium">{user.name}</h4>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                                {user.role && (
                                                    <Badge variant="outline" className="mt-1">
                                                        {user.role.name}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <Badge variant={user.email_verified_at ? 'default' : 'secondary'}>
                                                    {user.email_verified_at ? 'Verified' : 'Unverified'}
                                                </Badge>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    <Calendar className="mr-1 inline h-3 w-3" />
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/users/${user.id}`}>View</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
