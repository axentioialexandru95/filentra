import { tenantRoute } from '@/core/lib/tenant-utils';
import { getInitials } from '@/core/lib/utils';
import { type BreadcrumbItem } from '@/core/types';
import { Head, Link } from '@inertiajs/react';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import AppLayout from '@/shared/layouts/app-layout';

import { type User } from '../types';

interface UserShowProps {
    user: User;
}

export default function ShowUser({ user }: UserShowProps) {
    const usersIndexRoute = tenantRoute('users.index');
    const userEditRoute = tenantRoute('users.edit', { user: user.id });

    if (!user) {
        return (
            <AppLayout
                breadcrumbs={[
                    { title: 'Users', href: usersIndexRoute },
                    { title: 'User Not Found', href: '#' },
                ]}
            >
                <Head title="User Not Found" />
                <div className="py-12 text-center">
                    <h2 className="text-2xl font-semibold">User not found</h2>
                    <p className="mt-2 text-muted-foreground">The user you're looking for doesn't exist.</p>
                    <Button asChild className="mt-4">
                        <Link href={usersIndexRoute}>Back to Users</Link>
                    </Button>
                </div>
            </AppLayout>
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: usersIndexRoute,
        },
        {
            title: user.name || 'Unknown User',
            href: tenantRoute('users.show', { user: user.id }),
        },
    ];

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'Not available';

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${user.name} - Users`} />

            <div className="space-y-6">
                {/* User Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-2xl">{user.name || 'Unknown User'}</CardTitle>
                                    <CardDescription>{user.email || 'No email provided'}</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" asChild>
                                    <Link href={userEditRoute}>Edit User</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={usersIndexRoute}>Back to Users</Link>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* User Details */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
                                <dd className="text-sm">{user.name || 'Not provided'}</dd>
                            </div>
                            <Separator />
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Email Address</dt>
                                <dd className="text-sm">{user.email || 'Not provided'}</dd>
                            </div>
                            <Separator />
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                                <dd className="text-sm">
                                    <Badge variant={user.email_verified_at ? 'default' : 'secondary'}>
                                        {user.email_verified_at ? 'Verified' : 'Unverified'}
                                    </Badge>
                                </dd>
                            </div>
                            <Separator />
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">User ID</dt>
                                <dd className="font-mono text-sm">{user.id || 'Unknown'}</dd>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Joined</dt>
                                <dd className="text-sm">{formatDate(user.created_at)}</dd>
                            </div>
                            <Separator />
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                                <dd className="text-sm">{formatDate(user.updated_at)}</dd>
                            </div>
                            {user.email_verified_at && (
                                <>
                                    <Separator />
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Email Verified</dt>
                                        <dd className="text-sm">{formatDate(user.email_verified_at)}</dd>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
