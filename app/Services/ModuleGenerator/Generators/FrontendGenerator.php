<?php

namespace App\Services\ModuleGenerator\Generators;

use App\Services\ModuleGenerator\ModuleGenerationResult;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class FrontendGenerator
{
    public function generate(string $moduleNameLower, array $options, ModuleGenerationResult $result): void
    {
        $basePath = resource_path("js/modules/{$moduleNameLower}");
        $isCrud = $options['crud'] ?? false;

        // Create frontend directories
        $this->createDirectories($basePath, $result);

        // Create types file
        $this->createTypesFile($basePath, $moduleNameLower, $isCrud, $result);

        if ($isCrud) {
            // Create CRUD pages
            $this->createCrudPages($basePath, $moduleNameLower, $result);
            $this->createCrudComponents($basePath, $moduleNameLower, $result);
        } else {
            // Create sample page
            $this->createSamplePage($basePath, $moduleNameLower, $result);
        }
    }

    protected function createDirectories(string $basePath, ModuleGenerationResult $result): void
    {
        $directories = [
            "{$basePath}/components",
            "{$basePath}/pages",
            "{$basePath}/hooks",
            "{$basePath}/actions",
        ];

        foreach ($directories as $directory) {
            File::makeDirectory($directory, 0755, true);
            $result->addCreatedDirectory($directory);
        }
    }

    protected function createTypesFile(string $basePath, string $moduleNameLower, bool $isCrud, ModuleGenerationResult $result): void
    {
        $studlyName = $this->studlyCase($moduleNameLower);

        if ($isCrud) {
            $content = <<<TS
// Types for {$moduleNameLower} module

export interface {$studlyName}Data {
    id: number;
    name: string;
    description?: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface {$studlyName}FormData {
    name: string;
    description?: string;
    status: 'active' | 'inactive';
}

export interface {$studlyName}Stats {
    total: number;
    active: number;
    inactive: number;
    recent: number;
}

export interface {$studlyName}TableProps {
    data: {$studlyName}Data[];
    onEdit: (item: {$studlyName}Data) => void;
    onDelete: (item: {$studlyName}Data) => void;
    onView: (item: {$studlyName}Data) => void;
}

export interface {$studlyName}FormProps {
    item?: {$studlyName}Data;
    onSubmit: (data: {$studlyName}FormData) => void;
    isLoading?: boolean;
}

export interface {$studlyName}StatsWidgetProps {
    stats: {$studlyName}Stats;
    isLoading?: boolean;
}

// Pagination interface
export interface {$studlyName}PaginatedData {
    data: {$studlyName}Data[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

// API Response interfaces
export interface {$studlyName}IndexResponse {
    data: {$studlyName}PaginatedData;
    stats: {$studlyName}Stats;
}

export interface {$studlyName}ShowResponse {
    data: {$studlyName}Data;
}
TS;
        } else {
            $content = <<<TS
// Types for {$moduleNameLower} module

export interface {$studlyName}Data {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface {$studlyName}FormData {
    name: string;
}

// Add more types as needed
TS;
        }

        $filePath = "{$basePath}/types.ts";
        File::put($filePath, $content);
        $result->addCreatedFile($filePath, 'types');
    }

    protected function createSamplePage(string $basePath, string $moduleNameLower, ModuleGenerationResult $result): void
    {
        $titleCaseName = $this->titleCase($moduleNameLower);

        $content = <<<TSX
import { Head } from '@inertiajs/react';
import AppLayout from '@/shared/layouts/app-layout';
import { type BreadcrumbItem } from '@/core/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        label: 'Dashboard',
        href: route('dashboard'),
    },
    {
        label: '{$titleCaseName}',
        href: route('{$moduleNameLower}.index'),
    },
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="{$titleCaseName}" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {$titleCaseName}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Welcome to the {$moduleNameLower} module.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <p>This is the {$moduleNameLower} module index page.</p>
                        {/* Add your module content here */}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
TSX;

        $filePath = "{$basePath}/pages/index.tsx";
        File::put($filePath, $content);
        $result->addCreatedFile($filePath, 'page');
    }

    protected function createCrudPages(string $basePath, string $moduleNameLower, ModuleGenerationResult $result): void
    {
        $studlyName = $this->studlyCase($moduleNameLower);
        $titleCaseName = $this->titleCase($moduleNameLower);

        // Index Page
        $indexContent = <<<TSX
import { Head } from '@inertiajs/react';
import AppLayout from '@/shared/layouts/app-layout';
import { type BreadcrumbItem } from '@/core/types';
import { type {$studlyName}Data, type {$studlyName}Stats } from '../types';
import {$studlyName}Table from '../components/{$studlyName}Table';
import {$studlyName}StatsWidget from '../components/{$studlyName}StatsWidget';
import { Button } from '@/shared/components/ui/button';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        label: 'Dashboard',
        href: route('dashboard'),
    },
    {
        label: '{$titleCaseName}',
        href: route('{$moduleNameLower}.index'),
    },
];

interface Props {
    data: {
        data: {$studlyName}Data[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: {$studlyName}Stats;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ data, stats, filters }: Props) {
    const handleEdit = (item: {$studlyName}Data) => {
        window.location.href = route('{$moduleNameLower}.edit', item.id);
    };

    const handleDelete = (item: {$studlyName}Data) => {
        if (confirm('Are you sure you want to delete this item?')) {
            // Handle delete
        }
    };

    const handleView = (item: {$studlyName}Data) => {
        window.location.href = route('{$moduleNameLower}.show', item.id);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="{$titleCaseName}" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {$titleCaseName}
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Manage your {$moduleNameLower} items
                        </p>
                    </div>
                    <Link href={route('{$moduleNameLower}.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add New
                        </Button>
                    </Link>
                </div>

                <{$studlyName}StatsWidget stats={stats} />

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <{$studlyName}Table
                        data={data.data}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
TSX;

        // Create Page
        $createContent = <<<TSX
import { Head } from '@inertiajs/react';
import AppLayout from '@/shared/layouts/app-layout';
import { type BreadcrumbItem } from '@/core/types';
import { type {$studlyName}FormData } from '../types';
import {$studlyName}Form from '../components/{$studlyName}Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        label: 'Dashboard',
        href: route('dashboard'),
    },
    {
        label: '{$titleCaseName}',
        href: route('{$moduleNameLower}.index'),
    },
    {
        label: 'Create',
        href: route('{$moduleNameLower}.create'),
    },
];

export default function Create() {
    const handleSubmit = (data: {$studlyName}FormData) => {
        // Handle form submission
        console.log('Submitting:', data);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create {$titleCaseName}" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Create {$titleCaseName}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Add a new {$moduleNameLower} item
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <{$studlyName}Form onSubmit={handleSubmit} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
TSX;

        $indexFilePath = "{$basePath}/pages/index.tsx";
        $createFilePath = "{$basePath}/pages/create.tsx";

        File::put($indexFilePath, $indexContent);
        File::put($createFilePath, $createContent);

        $result->addCreatedFile($indexFilePath, 'crud_page');
        $result->addCreatedFile($createFilePath, 'crud_page');
    }

    protected function createCrudComponents(string $basePath, string $moduleNameLower, ModuleGenerationResult $result): void
    {
        $studlyName = $this->studlyCase($moduleNameLower);

        // Create components directory
        File::makeDirectory("{$basePath}/components", 0755, true);

        // Stats Widget Component
        $statsWidgetContent = <<<TSX
import { type {$studlyName}Stats } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Activity, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Props {
    stats: {$studlyName}Stats;
    isLoading?: boolean;
}

export default function {$studlyName}StatsWidget({ stats, isLoading = false }: Props) {
    const statItems = [
        {
            title: 'Total Items',
            value: stats.total,
            icon: Activity,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Active',
            value: stats.active,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Inactive',
            value: stats.inactive,
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
        },
        {
            title: 'Recent',
            value: stats.recent,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
        },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statItems.map((item, index) => {
                const Icon = item.icon;
                return (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className={\`rounded-full p-2 \${item.bgColor}\`}>
                                    <Icon className={\`h-6 w-6 \${item.color}\`} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {item.title}
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
TSX;

        // Table Component
        $tableContent = <<<TSX
import { type {$studlyName}Data } from '../types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface Props {
    data: {$studlyName}Data[];
    onEdit: (item: {$studlyName}Data) => void;
    onDelete: (item: {$studlyName}Data) => void;
    onView: (item: {$studlyName}Data) => void;
}

export default function {$studlyName}Table({ data, onEdit, onDelete, onView }: Props) {
    return (
        <div className="p-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                                {item.description ? (
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {item.description.length > 50
                                            ? \`\${item.description.substring(0, 50)}...\`
                                            : item.description}
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-400">No description</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={item.status === 'active' ? 'default' : 'secondary'}
                                    className={
                                        item.status === 'active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                    }
                                >
                                    {item.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {new Date(item.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onView(item)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(item)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(item)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {data.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No items found.</p>
                </div>
            )}
        </div>
    );
}
TSX;

        // Form Component
        $formContent = <<<TSX
import { useState } from 'react';
import { type {$studlyName}Data, type {$studlyName}FormData } from '../types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';

interface Props {
    item?: {$studlyName}Data;
    onSubmit: (data: {$studlyName}FormData) => void;
    isLoading?: boolean;
}

export default function {$studlyName}Form({ item, onSubmit, isLoading = false }: Props) {
    const [formData, setFormData] = useState<{$studlyName}FormData>({
        name: item?.name || '',
        description: item?.description || '',
        status: item?.status || 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter name"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter description (optional)"
                    rows={3}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'inactive') =>
                        setFormData({ ...formData, status: value })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline">
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : (item ? 'Update' : 'Create')}
                </Button>
            </div>
        </form>
    );
}
TSX;

        $statsWidgetPath = "{$basePath}/components/{$studlyName}StatsWidget.tsx";
        $tablePath = "{$basePath}/components/{$studlyName}Table.tsx";
        $formPath = "{$basePath}/components/{$studlyName}Form.tsx";

        File::put($statsWidgetPath, $statsWidgetContent);
        File::put($tablePath, $tableContent);
        File::put($formPath, $formContent);

        $result->addCreatedFile($statsWidgetPath, 'component');
        $result->addCreatedFile($tablePath, 'component');
        $result->addCreatedFile($formPath, 'component');
    }

    protected function studlyCase(string $value): string
    {
        return Str::studly($value);
    }

    protected function titleCase(string $value): string
    {
        return Str::title(str_replace('-', ' ', $value));
    }
}
