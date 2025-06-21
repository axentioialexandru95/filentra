// Type definitions for Ziggy route helper
import { Config } from 'ziggy-js';

declare global {
    const route: (name: string, params?: Record<string, string | number>, absolute?: boolean) => string;

    interface Window {
        Ziggy?: Config;
        route: (name: string, params?: Record<string, string | number>, absolute?: boolean) => string;
    }
}

// Extend the Ziggy Config type to match what Laravel actually provides
declare module 'ziggy-js' {
    interface Config {
        url: string;
        port: number | null;
        defaults: Record<string, unknown>;
        routes: Record<
            string,
            {
                uri: string;
                methods: string[];
                parameters?: string[];
                wheres?: Record<string, unknown>;
            }
        >;
        location?: string;
    }
}

export {};
