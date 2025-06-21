import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import type { ConsoleErrorArgs, InertiaLinkProps, MockEcho, RouteFunction, TestTenant, TestUser } from './types';

// Configure React Testing Library
configure({
    testIdAttribute: 'data-testid',
});

// Mock InertiaJS
const mockInertia = {
    visit: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    remember: jest.fn(),
    restore: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
};

const mockRouter = {
    visit: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    remember: jest.fn(),
    restore: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
};

jest.mock('@inertiajs/react', () => ({
    ...jest.requireActual('@inertiajs/react'),
    Inertia: mockInertia,
    router: mockRouter,
    usePage: jest.fn(() => ({
        props: {
            auth: {
                user: null,
            },
            flash: {},
            errors: {},
        },
        url: '/',
        component: 'Test',
        version: '1',
    })),
    useForm: jest.fn(() => ({
        data: {},
        setData: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
        reset: jest.fn(),
        clearErrors: jest.fn(),
        setError: jest.fn(),
        processing: false,
        errors: {},
        hasErrors: false,
        progress: null,
        wasSuccessful: false,
        recentlySuccessful: false,
        isDirty: false,
        submit: jest.fn(),
        cancel: jest.fn(),
        transform: jest.fn(),
    })),
    Head: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
    Link: ({ children, href, className, style }: InertiaLinkProps) => (
        <a href={href} className={className} style={style}>
            {children}
        </a>
    ),
}));

// Mock Laravel Precognition
jest.mock('laravel-precognition-react-inertia', () => ({
    useForm: jest.fn(() => ({
        processing: false,
        submit: jest.fn(),
        data: {},
        setData: jest.fn(),
        errors: {},
        clearErrors: jest.fn(),
        reset: jest.fn(),
        validate: jest.fn(),
        validateFiles: jest.fn(),
        setValidationTimeout: jest.fn(),
        valid: jest.fn(),
        invalid: jest.fn(),
        touched: jest.fn(),
        hasErrors: false,
        validating: false,
    })),
}));

// Mock window.route (Ziggy)
(global as unknown as { route: RouteFunction }).route = jest.fn((name: string, params?: Record<string, string | number>) => {
    if (params) {
        return `/mocked-route/${name}/${Object.values(params).join('/')}`;
    }
    return `/mocked-route/${name}`;
}) as RouteFunction;

// Mock window.Echo (Laravel Echo)
(global as unknown as { Echo: MockEcho }).Echo = {
    channel: jest.fn(() => ({
        listen: jest.fn(),
        stopListening: jest.fn(),
    })),
    private: jest.fn(() => ({
        listen: jest.fn(),
        stopListening: jest.fn(),
    })),
    join: jest.fn(() => ({
        listen: jest.fn(),
        stopListening: jest.fn(),
        here: jest.fn(),
        joining: jest.fn(),
        leaving: jest.fn(),
    })),
    leave: jest.fn(),
    disconnect: jest.fn(),
};

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    sessionStorageMock.getItem.mockClear();
    sessionStorageMock.setItem.mockClear();
    sessionStorageMock.removeItem.mockClear();
    sessionStorageMock.clear.mockClear();
});

// Suppress console warnings in tests unless explicitly testing them
const originalError = console.error;
beforeAll(() => {
    console.error = (...args: ConsoleErrorArgs) => {
        if (typeof args[0] === 'string' && args[0].includes('Warning: ReactDOM.render is deprecated')) {
            return;
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});

// Global test utilities
(global as unknown as { testUser: TestUser }).testUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    email_verified_at: '2024-01-01T00:00:00.000000Z',
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z',
};

(global as unknown as { testTenant: TestTenant }).testTenant = {
    id: 1,
    name: 'Test Tenant',
    slug: 'test-tenant',
    subdomain: 'test',
    status: 'active',
    plan: 'basic',
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z',
};
