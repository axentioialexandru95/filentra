import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { Config } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
        setup: ({ App, props }) => {
            // Set up global route function for SSR
            (global as typeof global & { route: (name: string, params?: Record<string, string | number>, absolute?: boolean) => string }).route = (
                name: string,
                params?: Record<string, string | number>,
                absolute?: boolean,
            ) => {
                const ziggyConfig = page.props.ziggy as Config & { location: string };
                if (!ziggyConfig || !ziggyConfig.routes) {
                    console.warn(`Ziggy config not available, returning route name: ${name}`);
                    return name;
                }

                const routeData = ziggyConfig.routes[name];
                if (!routeData) {
                    console.warn(`Route "${name}" not found`);
                    return name;
                }

                let url = routeData.uri;
                if (params) {
                    Object.entries(params).forEach(([key, value]) => {
                        url = url.replace(`{${key}}`, String(value));
                        url = url.replace(`{${key}?}`, String(value));
                    });
                }

                // Remove any remaining optional parameters
                url = url.replace(/\{[^}]+\?\}/g, '');

                const baseUrl = absolute ? ziggyConfig.url : '';
                return (baseUrl + '/' + url).replace(/\/+/g, '/').replace(/\/$/, '') || '/';
            };

            return <App {...props} />;
        },
    }),
);
