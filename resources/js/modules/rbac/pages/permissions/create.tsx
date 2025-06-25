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

interface CreatePermissionProps {
    categories: string[];
}

export default function CreatePermission({ categories }: CreatePermissionProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        category: '',
        is_active: true as boolean,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('rbac.permissions.store'));
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

    return (
        <AppLayout>
            <Head title="Create Permission" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('rbac.permissions.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Permissions
                        </Button>
                    </Link>
                    <Heading title="Create New Permission" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Permission Information</CardTitle>
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
                                        placeholder="Enter permission name"
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
                                        placeholder="permission_slug"
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
                                    placeholder="Enter permission description"
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category.replace(/_/g, ' ').toUpperCase()}
                                            </option>
                                        ))}
                                        <option value="custom">Create New Category</option>
                                    </select>
                                    <InputError message={errors.category} />
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

                            {data.category === 'custom' && (
                                <div>
                                    <Label htmlFor="custom_category">Custom Category</Label>
                                    <Input
                                        id="custom_category"
                                        type="text"
                                        placeholder="Enter new category name"
                                        onChange={(e) => setData('category', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '_'))}
                                        className="mt-1"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end space-x-4">
                        <Link href={route('rbac.permissions.index')}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Creating...' : 'Create Permission'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
