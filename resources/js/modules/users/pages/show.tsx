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
    item: User;
}

export default function ShowUser({ item: user }: UserShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: '/users',
        },
        {
            title: user.name,
            href: `/users/${user.id}`,
        },
    ];

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User - ${user.name}`} />

            <div className="mx-auto max-w-4xl space-y-6">
                {/* User Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                                    <CardDescription className="text-base">{user.email}</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" asChild>
                                    <Link href={`/users/${user.id}/edit`}>Edit User</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/users">Back to Users</Link>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* User Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                        <CardDescription>Detailed information about this user</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                <p className="text-base">{user.name}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                <p className="text-base">{user.email}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Email Status</label>
                                <Badge variant={user.email_verified_at ? 'default' : 'secondary'}>
                                    {user.email_verified_at ? 'Verified' : 'Unverified'}
                                </Badge>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                                <p className="font-mono text-base">#{user.id}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                                <p className="text-base">{formatDate(user.created_at)}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                                <p className="text-base">{formatDate(user.updated_at)}</p>
                            </div>
                            {user.email_verified_at && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Email Verified</label>
                                    <p className="text-base">{formatDate(user.email_verified_at)}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>Available actions for this user</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <Button variant="outline" asChild>
                                <Link href={`/users/${user.id}/edit`}>Edit Profile</Link>
                            </Button>
                            {!user.email_verified_at && <Button variant="outline">Resend Verification Email</Button>}
                            <Button variant="outline">Reset Password</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
