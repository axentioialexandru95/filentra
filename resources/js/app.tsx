import '../css/app.css';

import { initializeTheme } from '@/core/hooks/use-appearance';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./${name}.tsx`, import.meta.glob('./modules/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    registerSW({
        onNeedRefresh() {
            console.log('New content available, please refresh.');
            // You could show a toast notification here
        },
        onOfflineReady() {
            console.log('App ready to work offline.');
            // You could show a toast notification here
        },
        onRegistered(registration) {
            console.log('SW Registered: ', registration);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
        immediate: true
    });
}
