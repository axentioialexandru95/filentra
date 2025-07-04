import { type BreadcrumbItem } from '@/core/types';
import { AppContent } from '@/shared/components/app-content';
import { AppHeader } from '@/shared/components/app-header';
import { AppShell } from '@/shared/components/app-shell';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}
