import { Head } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/core/types';
import SettingsLayout from '@/modules/settings/layouts/layout';
import AppearanceTabs from '@/shared/components/appearance-tabs';
import HeadingSmall from '@/shared/components/heading-small';
import AppLayout from '@/shared/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
