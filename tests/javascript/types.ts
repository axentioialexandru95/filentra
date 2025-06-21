// Type definitions for test setup and mocking

export interface TestUser {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
}

export interface TestTenant {
    id: number;
    name: string;
    slug: string;
    subdomain: string;
    status: string;
    plan: string;
    created_at: string;
    updated_at: string;
}

export interface RouteFunction {
    (name: string, params?: Record<string, string | number>): string;
}

export interface EchoChannel {
    listen: jest.MockedFunction<(event: string, callback: (data: unknown) => void) => void>;
    stopListening: jest.MockedFunction<(event: string) => void>;
}

export interface MockEcho {
    channel: jest.MockedFunction<(channel: string) => EchoChannel>;
    private: jest.MockedFunction<(channel: string) => EchoChannel>;
    join: jest.MockedFunction<(channel: string) => EchoChannel>;
}

export interface InertiaLinkProps {
    children?: React.ReactNode;
    href: string;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: unknown;
}

// Global augmentation for test globals
declare global {
    const testUser: TestUser;
    const testTenant: TestTenant;
    const route: RouteFunction;
    const Echo: MockEcho;
}

// Console error args type
export type ConsoleErrorArgs = [message?: unknown, ...optionalParams: unknown[]];
