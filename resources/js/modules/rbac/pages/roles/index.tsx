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

interface Role {
    id: number;
    name: string;
    slug: string;
    description: string;
    level: number;
    is_active: boolean;
    users_count: number;
    permissions_count: number;
    is_superadmin: boolean;
}

interface RolesIndexProps {
    roles: {
        data: Role[];
        links: unknown[];
        meta: {
            total: number;
        };
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function RolesIndex({ roles, filters }: RolesIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('rbac.roles.index'),
            {
                search: searchTerm,
                status: statusFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (role: Role) => {
        if (role.is_superadmin) {
            alert('Cannot delete superadmin role');
            return;
        }

        if (role.users_count > 0) {
            alert('Cannot delete role that has assigned users');
            return;
        }

        if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            router.delete(route('rbac.roles.destroy', { id: role.id }));
        }
    };

    const getLevelBadgeColor = (level: number) => {
        if (level >= 90) return 'bg-red-100 text-red-800';
        if (level >= 50) return 'bg-orange-100 text-orange-800';
        if (level >= 20) return 'bg-blue-100 text-blue-800';
        return 'bg-green-100 text-green-800';
    };

    return (
        <AppLayout>
            <Head title="Roles Management" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading title="Roles Management" />
                    <Link href={route('rbac.roles.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Role
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Search roles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
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
                        <CardTitle>Roles ({roles.meta?.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 text-left">Name</th>
                                        <th className="py-2 text-left">Description</th>
                                        <th className="py-2 text-left">Level</th>
                                        <th className="py-2 text-left">Status</th>
                                        <th className="py-2 text-left">Users</th>
                                        <th className="py-2 text-left">Permissions</th>
                                        <th className="py-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.data.map((role) => (
                                        <tr key={role.id} className="border-b">
                                            <td className="py-3">
                                                <div>
                                                    <div className="font-medium">{role.name}</div>
                                                    <div className="text-sm text-gray-500">{role.slug}</div>
                                                </div>
                                            </td>
                                            <td className="py-3 text-sm text-gray-600">{role.description || 'No description'}</td>
                                            <td className="py-3">
                                                <Badge className={getLevelBadgeColor(role.level)}>Level {role.level}</Badge>
                                            </td>
                                            <td className="py-3">
                                                <Badge variant={role.is_active ? 'default' : 'secondary'}>
                                                    {role.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                <Badge variant="outline">{role.users_count}</Badge>
                                            </td>
                                            <td className="py-3">
                                                <Badge variant="outline">{role.permissions_count}</Badge>
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
                                                            <Link href={route('rbac.roles.show', { id: role.id })}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('rbac.roles.edit', { id: role.id })}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {!role.is_superadmin && (
                                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(role)}>
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {roles.data.length === 0 && <div className="py-8 text-center text-gray-500">No roles found.</div>}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
