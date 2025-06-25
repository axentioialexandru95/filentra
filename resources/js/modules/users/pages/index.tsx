import { type BreadcrumbItem } from '@/core/types';
import { Head, usePage } from '@inertiajs/react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import AppLayout from '@/shared/layouts/app-layout';

import { type User } from '@/core/types';
import { CreateUserDialog, UserFilters, UserPagination, UserStatsCards, UserTable } from '../components';

interface Role {
    id: number;
    name: string;
    slug: string;
    description: string;
}

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
    roles: Role[];
}

export default function UsersIndex({ data: users, stats, filters, roles }: UsersIndexProps) {
    const { auth } = usePage<{ auth?: { user?: User } }>().props;
    const currentUser = auth?.user;
    const usersIndexRoute = route('users.index');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: usersIndexRoute,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="space-y-6 p-6">
                {/* Stats Cards */}
                <UserStatsCards stats={stats} />

                {/* Filters and Actions */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Users</CardTitle>
                                <CardDescription>Manage user accounts and permissions</CardDescription>
                            </div>
                            <CreateUserDialog roles={roles} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <UserFilters initialSearch={filters.search} initialStatus={filters.status} usersIndexRoute={usersIndexRoute} />

                        {/* Users Table */}
                        <UserTable users={users.data} currentUser={currentUser} />

                        {/* Pagination */}
                        <UserPagination
                            paginationData={users}
                            usersIndexRoute={usersIndexRoute}
                            search={filters.search || ''}
                            status={filters.status || 'all'}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
