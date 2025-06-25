import { type BreadcrumbItem } from '@/core/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/shared/components/input-error';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import AppLayout from '@/shared/layouts/app-layout';

import { type User } from '../types';

interface EditUserProps {
    user: User;
}

export default function EditUser({ user }: EditUserProps) {
    const usersIndexRoute = route('users.index');
    const usersShowRoute = route('users.show', { user: user.id });
    const usersUpdateRoute = route('users.update', { user: user.id });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: usersIndexRoute,
        },
        {
            title: user.name,
            href: usersShowRoute,
        },
        {
            title: 'Edit',
            href: route('users.edit', { user: user.id }),
        },
    ];

    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(usersUpdateRoute);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${user.name} - Users`} />

            <div className="mx-auto max-w-2xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit User</CardTitle>
                        <CardDescription>Update the user's information below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-4">
                                <Button variant="outline" asChild>
                                    <Link href={usersShowRoute}>Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update User'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
