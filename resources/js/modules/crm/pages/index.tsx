import { type BreadcrumbItem } from '@/core/types';
import AppLayout from '@/shared/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Crm',
        href: route('crm.index'),
    },
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crm" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Crm</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Welcome to the crm module.</p>
                </div>

                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <p>This is the crm module index page.</p>
                        {/* Add your module content here */}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
