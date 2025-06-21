export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/javascript/setup.tsx'],
    testMatch: [
        '<rootDir>/tests/javascript/**/*.test.{js,jsx,ts,tsx}',
        '<rootDir>/resources/js/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/resources/js/**/*.{test,spec}.{js,jsx,ts,tsx}',
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/resources/js/$1',
        '^@/components/(.*)$': '<rootDir>/resources/js/components/$1',
        '^@/shared/(.*)$': '<rootDir>/resources/js/shared/$1',
        '^@/modules/(.*)$': '<rootDir>/resources/js/modules/$1',
        '^@/hooks/(.*)$': '<rootDir>/resources/js/hooks/$1',
        '^@/types/(.*)$': '<rootDir>/resources/js/types/$1',
        '^@/services/(.*)$': '<rootDir>/resources/js/services/$1',
        '^@/utils/(.*)$': '<rootDir>/resources/js/utils/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                tsconfig: {
                    jsx: 'react-jsx',
                },
            },
        ],
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    collectCoverageFrom: [
        'resources/js/**/*.{ts,tsx,js,jsx}',
        '!resources/js/**/*.d.ts',
        '!resources/js/**/*.stories.{ts,tsx,js,jsx}',
        '!resources/js/types/**/*',
        '!**/node_modules/**',
    ],
    coverageDirectory: 'coverage/frontend',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 60,
            lines: 60,
            statements: 60,
        },
    },
    testTimeout: 10000,
    maxWorkers: '50%',
    verbose: true,
    clearMocks: true,
    restoreMocks: true,
    resetMocks: true,
};
