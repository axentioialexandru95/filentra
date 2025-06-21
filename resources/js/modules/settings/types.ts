// Types for settings module

export interface ProfileFormData {
    name: string;
    email: string;
}

export interface PasswordFormData {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export interface ProfileUpdateResponse {
    message?: string;
    status?: string;
}

export interface PasswordUpdateResponse {
    message?: string;
    status?: string;
}

// Settings page props interfaces
export interface ProfilePageProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export interface PasswordPageProps {
    // Add any props needed for password page
}

export interface AppearancePageProps {
    // Add any props needed for appearance page
}

// User profile data
export interface UserProfile {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    avatar?: string;
}

// Settings preferences
export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    notifications: {
        email: boolean;
        push: boolean;
        marketing: boolean;
    };
}

// Account deletion data
export interface DeleteAccountFormData {
    password: string;
}

export interface DeleteAccountResponse {
    message?: string;
}

// Settings navigation item
export interface SettingsNavItem {
    name: string;
    href: string;
    icon?: React.ComponentType<any>;
    current?: boolean;
}
