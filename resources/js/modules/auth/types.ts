// Types for auth module

export interface LoginFormData {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ForgotPasswordFormData {
    email: string;
}

export interface ResetPasswordFormData {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ConfirmPasswordFormData {
    password: string;
}

export interface AuthStatus {
    status?: string;
    message?: string;
}

export interface EmailVerificationData {
    status?: string;
}

// Auth related props interfaces
export interface LoginPageProps {
    canResetPassword: boolean;
    status?: string;
}

export type RegisterPageProps = Record<string, never>;

export interface ForgotPasswordPageProps {
    status?: string;
}

export interface ResetPasswordPageProps {
    token: string;
    email: string;
}

export interface VerifyEmailPageProps {
    status?: string;
}

export type ConfirmPasswordPageProps = Record<string, never>;

// Auth user interface (extends the core User type)
export interface AuthUser {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    avatar?: string;
}

// Auth responses
export interface AuthResponse {
    user: AuthUser;
    message?: string;
}

export interface LogoutResponse {
    message?: string;
}
