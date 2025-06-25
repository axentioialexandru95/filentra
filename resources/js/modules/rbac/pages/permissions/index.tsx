import Heading from '@/shared/components/heading';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { Input } from '@/shared/components/ui/input';
import AppLayout from '@/shared/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface Permission {
    id: number;
    name: string;
    slug: string;
    description: string;
    category: string;
    is_active: boolean;
    roles_count: number;
}

interface PermissionsIndexProps {
    permissions: {
        data: Permission[];
        links: Array<Record<string, unknown>>;
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            per_page: number;
            to: number;
            total: number;
        };
    };
    categories: string[];
    filters: {
        search?: string;
        category?: string;
        status?: string;
    };
}

export default function PermissionsIndex({ permissions, categories, filters }: PermissionsIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('rbac.permissions.index'),
            {
                search: searchTerm,
                category: categoryFilter,
                status: statusFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (permission: Permission) => {
        if (permission.roles_count > 0) {
            alert('Cannot delete permission that is assigned to roles');
            return;
        }

        if (confirm(`Are you sure you want to delete the permission "${permission.name}"?`)) {
            router.delete(route('rbac.permissions.destroy', { permission: permission.id }));
        }
    };

    return (
        <AppLayout>
            <Head title="Permissions Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="Permissions Management" />
                    <Link href={route('rbac.permissions.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Permission
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Search permissions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category.replace(/_/g, ' ').toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <Button type="submit">
                                <Search className="mr-2 h-4 w-4" />
                                Search
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Permissions ({permissions.meta.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 text-left">Name</th>
                                        <th className="py-2 text-left">Category</th>
                                        <th className="py-2 text-left">Description</th>
                                        <th className="py-2 text-left">Status</th>
                                        <th className="py-2 text-left">Roles</th>
                                        <th className="py-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissions.data.map((permission) => (
                                        <tr key={permission.id} className="border-b">
                                            <td className="py-3">
                                                <div>
                                                    <div className="font-medium">{permission.name}</div>
                                                    <div className="text-sm text-gray-500">{permission.slug}</div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <Badge variant="outline">{permission.category.replace(/_/g, ' ').toUpperCase()}</Badge>
                                            </td>
                                            <td className="py-3 text-sm text-gray-600">{permission.description || 'No description'}</td>
                                            <td className="py-3">
                                                <Badge variant={permission.is_active ? 'default' : 'secondary'}>
                                                    {permission.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                <Badge variant="outline">{permission.roles_count}</Badge>
                                            </td>
                                            <td className="py-3">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            Actions
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('rbac.permissions.show', { permission: permission.id })}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('rbac.permissions.edit', { permission: permission.id })}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(permission)}>
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {permissions.data.length === 0 && <div className="py-8 text-center text-gray-500">No permissions found.</div>}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
