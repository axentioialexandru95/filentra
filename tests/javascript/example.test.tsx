import { router } from '@inertiajs/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import type { TestTenant, TestUser } from './types';

// Mock component for testing
const TestButton: React.FC<{ onClick?: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button onClick={onClick} data-testid="test-button">
        {children}
    </button>
);

const TestForm: React.FC = () => {
    const [value, setValue] = React.useState('');
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <form onSubmit={handleSubmit} data-testid="test-form">
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} data-testid="test-input" placeholder="Enter text" />
            <button type="submit" data-testid="submit-button">
                Submit
            </button>
            {submitted && <div data-testid="success-message">Form submitted!</div>}
        </form>
    );
};

describe('Frontend Testing Setup', () => {
    it('renders a button correctly', () => {
        render(<TestButton>Click me</TestButton>);

        expect(screen.getByTestId('test-button')).toBeInTheDocument();
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('handles button clicks', async () => {
        const user = userEvent.setup();
        const mockClick = jest.fn();

        render(<TestButton onClick={mockClick}>Click me</TestButton>);

        const button = screen.getByTestId('test-button');
        await user.click(button);

        expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('handles form submission', async () => {
        const user = userEvent.setup();

        render(<TestForm />);

        const input = screen.getByTestId('test-input');
        const submitButton = screen.getByTestId('submit-button');

        // Type in the input
        await user.type(input, 'test value');
        expect(input).toHaveValue('test value');

        // Submit the form
        await user.click(submitButton);

        // Check success message appears
        await waitFor(() => {
            expect(screen.getByTestId('success-message')).toBeInTheDocument();
        });
    });

    it('works with React 19 features', async () => {
        const user = userEvent.setup();

        // Test component that uses modern React patterns
        const ModernComponent: React.FC = () => {
            const [count, setCount] = React.useState(0);

            return (
                <div>
                    <p data-testid="count">Count: {count}</p>
                    <button onClick={() => setCount((c) => c + 1)} data-testid="increment">
                        Increment
                    </button>
                </div>
            );
        };

        render(<ModernComponent />);

        expect(screen.getByTestId('count')).toHaveTextContent('Count: 0');

        await user.click(screen.getByTestId('increment'));

        expect(screen.getByTestId('count')).toHaveTextContent('Count: 1');
    });

    it('mocks are working correctly', () => {
        // Test that our mocked InertiaJS is working
        router.visit('/test');
        expect(router.visit).toHaveBeenCalledWith('/test');
    });

    it('supports async operations', async () => {
        const AsyncComponent: React.FC = () => {
            const [data, setData] = React.useState<string | null>(null);
            const [loading, setLoading] = React.useState(false);

            const fetchData = async () => {
                setLoading(true);
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 100));
                setData('Fetched data');
                setLoading(false);
            };

            return (
                <div>
                    <button onClick={fetchData} data-testid="fetch-button">
                        Fetch Data
                    </button>
                    {loading && <div data-testid="loading">Loading...</div>}
                    {data && <div data-testid="data">{data}</div>}
                </div>
            );
        };

        const user = userEvent.setup();
        render(<AsyncComponent />);

        const fetchButton = screen.getByTestId('fetch-button');
        await user.click(fetchButton);

        // Should show loading first
        expect(screen.getByTestId('loading')).toBeInTheDocument();

        // Then show data after async operation
        await waitFor(() => {
            expect(screen.getByTestId('data')).toBeInTheDocument();
        });

        expect(screen.getByTestId('data')).toHaveTextContent('Fetched data');
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    it('handles TypeScript types correctly', () => {
        interface TestProps {
            title: string;
            count?: number;
        }

        const TypedComponent: React.FC<TestProps> = ({ title, count = 0 }) => (
            <div>
                <h1 data-testid="title">{title}</h1>
                <span data-testid="count">{count}</span>
            </div>
        );

        render(<TypedComponent title="Test Title" count={5} />);

        expect(screen.getByTestId('title')).toHaveTextContent('Test Title');
        expect(screen.getByTestId('count')).toHaveTextContent('5');
    });
});

describe('Testing Utilities', () => {
    it('has access to global test utilities', () => {
        expect((global as unknown as { testUser: TestUser }).testUser).toBeDefined();
        expect((global as unknown as { testUser: TestUser }).testUser.email).toBe('test@example.com');

        expect((global as unknown as { testTenant: TestTenant }).testTenant).toBeDefined();
        expect((global as unknown as { testTenant: TestTenant }).testTenant.name).toBe('Test Tenant');
    });

    it('can use mocked route helper', () => {
        // Just check if route function exists - the actual mocking will be tested in real components
        expect(typeof (global as unknown as { route: (name: string, params?: Record<string, string | number>) => string }).route).toBe('function');
    });

    it('localStorage mock is working', () => {
        localStorage.setItem('test', 'value');
        expect(localStorage.setItem).toHaveBeenCalledWith('test', 'value');
    });
});
