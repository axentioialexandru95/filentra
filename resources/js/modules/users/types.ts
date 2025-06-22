// Types for users module

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    avatar?: string;
}

export interface UserFormData {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
}

export interface UserCreateFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface UserUpdateFormData {
    name: string;
    email: string;
}

// User responses
export interface UserResponse {
    user: User;
    message?: string;
}

export interface UsersIndexResponse {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

// User page props interfaces
export interface UsersIndexPageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface UserShowPageProps {
    user: User;
}

export type UserCreatePageProps = Record<string, never>;

export interface UserEditPageProps {
    user: User;
}

// User deletion data
export interface DeleteUserFormData {
    password: string;
}

export interface DeleteUserResponse {
    message?: string;
}

// User filters and search
export interface UserFilters {
    search?: string;
    status?: 'active' | 'inactive' | 'pending';
    role?: string;
    sort?: 'name' | 'email' | 'created_at';
    direction?: 'asc' | 'desc';
}

// User table columns
export interface UserTableColumn {
    key: keyof User | 'actions';
    label: string;
    sortable?: boolean;
    className?: string;
}

// User actions
export interface UserAction {
    type: 'edit' | 'delete' | 'view';
    label: string;
    icon?: React.ElementType;
    href?: string;
    onClick?: (user: User) => void;
}

// User menu content props
export interface UserMenuContentProps {
    user: User;
}

// User info component props
export interface UserInfoProps {
    user: User;
    showEmail?: boolean;
}

// User avatar props
export interface UserAvatarProps {
    user: User;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}
