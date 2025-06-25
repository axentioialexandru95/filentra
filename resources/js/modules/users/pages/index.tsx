import { getInitials } from '@/core/lib/utils';
import { type BreadcrumbItem } from '@/core/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import AppLayout from '@/shared/layouts/app-layout';
import { UserCheck } from 'lucide-react';

import { type User } from '@/core/types';

interface UsersIndexProps {
    data: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    stats: {
        total: number;
        verified: number;
        unverified: number;
        recent: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function UsersIndex({ data: users, stats, filters }: UsersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const { auth } = usePage<{ auth?: { user?: User } }>().props;
    const currentUser = auth?.user;

    const usersIndexRoute = route('users.index');
    const usersCreateRoute = route('users.create');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: usersIndexRoute,
        },
    ];

    const handleSearch = () => {
        const searchParams: { search?: string; status?: string } = {};
        if (search) searchParams.search = search;
        if (status && status !== 'all') searchParams.status = status;
        router.get(usersIndexRoute, searchParams, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        router.get(usersIndexRoute, {}, { preserveState: true, replace: true });
    };

    const getUserShowRoute = (userId: number) => {
        return route('users.show', { user: userId });
    };

    const getUserEditRoute = (userId: number) => {
        return route('users.edit', { user: userId });
    };

    const handleImpersonate = (userId: number) => {
        router.post(
            `/impersonate/${userId}`,
            {},
            {
                onSuccess: () => {
                    // Page will redirect on success
                },
                onError: (errors) => {
                    console.error('Impersonation failed:', errors);
                },
            },
        );
    };

    const canImpersonateUser = (user: User) => {
        // Check if current user is superadmin
        if (!currentUser?.is_superadmin) {
            return false;
        }

        // Cannot impersonate yourself
        if (user.id === currentUser.id) {
            return false;
        }

        // Cannot impersonate other superadmins
        if (user.role?.slug === 'superadmin') {
            return false;
        }

        return true;
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="space-y-6 p-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
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
                            <CardTitle className="text-sm font-medium">Unverified</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.unverified}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recent</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.recent}</div>
                            <p className="text-xs text-muted-foreground">Last 7 days</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Actions */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Users</CardTitle>
                                <CardDescription>Manage user accounts and permissions</CardDescription>
                            </div>
                            <Button asChild>
                                <Link href={usersCreateRoute}>Add User</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 flex items-center gap-4">
                            <Input
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="max-w-sm"
                            />
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="verified">Verified</SelectItem>
                                    <SelectItem value="unverified">Unverified</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleSearch}>Search</Button>
                            <Button variant="outline" onClick={handleReset}>
                                Reset
                            </Button>
                        </div>

                        {/* Users Table */}
                        <div className="rounded-md border">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                    No users found
                                                </td>
                                            </tr>
                                        ) : (
                                            users.data.map((user) => (
                                                <tr key={user.id} className="border-b hover:bg-muted/50">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-medium">{user.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant={user.email_verified_at ? 'default' : 'secondary'}>
                                                            {user.email_verified_at ? 'Verified' : 'Unverified'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(user.created_at)}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={getUserShowRoute(user.id)}>View</Link>
                                                            </Button>
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={getUserEditRoute(user.id)}>Edit</Link>
                                                            </Button>
                                                            {canImpersonateUser(user) && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleImpersonate(user.id)}
                                                                    title={`Impersonate ${user.name}`}
                                                                >
                                                                    <UserCheck className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {users.from} to {users.to} of {users.total} results
                                </div>
                                <div className="flex items-center gap-2">
                                    {users.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(`${usersIndexRoute}?page=${users.current_page - 1}`, { search, status })}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    <span className="text-sm">
                                        Page {users.current_page} of {users.last_page}
                                    </span>
                                    {users.current_page < users.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(`${usersIndexRoute}?page=${users.current_page + 1}`, { search, status })}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
