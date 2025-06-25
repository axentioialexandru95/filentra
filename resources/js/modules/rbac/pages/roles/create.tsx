import Heading from '@/shared/components/heading';
import InputError from '@/shared/components/input-error';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import AppLayout from '@/shared/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import React from 'react';

interface Permission {
    id: number;
    name: string;
    slug: string;
    description: string;
    category: string;
}

interface CreateRoleProps {
    permissions: Record<string, Permission[]>;
}

export default function CreateRole({ permissions }: CreateRoleProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        level: 10,
        is_active: true as boolean,
        permissions: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('rbac.roles.store'));
    };

    const handleNameChange = (name: string) => {
        setData('name', name);
        // Auto-generate slug from name
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/(^_|_$)/g, '');
        setData('slug', slug);
    };

    const handlePermissionToggle = (permissionId: number) => {
        const currentPermissions = [...data.permissions];
        const index = currentPermissions.indexOf(permissionId);

        if (index > -1) {
            currentPermissions.splice(index, 1);
        } else {
            currentPermissions.push(permissionId);
        }

        setData('permissions', currentPermissions);
    };

    const handleCategoryToggle = (categoryPermissions: Permission[]) => {
        const categoryIds = categoryPermissions.map((p) => p.id);
        const currentPermissions = [...data.permissions];
        const allSelected = categoryIds.every((id) => currentPermissions.includes(id));

        if (allSelected) {
            // Remove all category permissions
            setData(
                'permissions',
                currentPermissions.filter((id) => !categoryIds.includes(id)),
            );
        } else {
            // Add all category permissions
            const newPermissions = [...new Set([...currentPermissions, ...categoryIds])];
            setData('permissions', newPermissions);
        }
    };

    return (
        <AppLayout>
            <Head title="Create Role" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('rbac.roles.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Roles
                        </Button>
                    </Link>
                    <Heading title="Create New Role" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Role Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="Enter role name"
                                        className="mt-1"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div>
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="role_slug"
                                        className="mt-1"
                                    />
                                    <InputError message={errors.slug} />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter role description"
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="level">Level (1-99)</Label>
                                    <Input
                                        id="level"
                                        type="number"
                                        min="1"
                                        max="99"
                                        value={data.level}
                                        onChange={(e) => setData('level', parseInt(e.target.value))}
                                        className="mt-1"
                                    />
                                    <InputError message={errors.level} />
                                </div>

                                <div className="mt-6 flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', Boolean(checked))}
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Permissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {Object.entries(permissions).map(([category, categoryPermissions]) => {
                                    const categoryIds = categoryPermissions.map((p) => p.id);
                                    const allSelected = categoryIds.every((id) => data.permissions.includes(id));

                                    return (
                                        <div key={category} className="space-y-3">
                                            <div className="flex items-center space-x-2 border-b pb-2">
                                                <Checkbox checked={allSelected} onCheckedChange={() => handleCategoryToggle(categoryPermissions)} />
                                                <Label className="text-sm font-medium capitalize">{category.replace(/_/g, ' ')}</Label>
                                            </div>

                                            <div className="ml-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                                {categoryPermissions.map((permission) => (
                                                    <div key={permission.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`permission-${permission.id}`}
                                                            checked={data.permissions.includes(permission.id)}
                                                            onCheckedChange={() => handlePermissionToggle(permission.id)}
                                                        />
                                                        <Label htmlFor={`permission-${permission.id}`} className="cursor-pointer text-sm">
                                                            {permission.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end space-x-4">
                        <Link href={route('rbac.roles.index')}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Creating...' : 'Create Role'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
