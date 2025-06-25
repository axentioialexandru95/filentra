// Types for vendors module

export interface Vendor {
    id: number;
    name: string;
    company_email: string;
    phone?: string;
    address?: string;
    contact_person?: string;
    registration_number?: string;
    status: 'active' | 'inactive' | 'pending';
    description?: string;
    created_at: string;
    updated_at: string;
    users?: VendorUser[];
    stats?: VendorStats;
}

export interface VendorUser {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    role?: {
        id: number;
        name: string;
        slug: string;
    };
}

export interface VendorStats {
    total_users: number;
    total_products: number;
    total_batches: number;
    pending_batches: number;
    reviewed_batches: number;
}

export interface VendorBatch {
    id: number;
    name: string;
    description?: string;
    status: 'draft' | 'sent_for_review' | 'reviewed' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    products_count: number;
    user: VendorUser;
}

export interface VendorFormData {
    name: string;
    company_email: string;
    phone?: string;
    address?: string;
    contact_person?: string;
    registration_number?: string;
    status: 'active' | 'inactive' | 'pending';
    description?: string;
}

// Page props interfaces
export interface VendorsIndexProps {
    vendors: {
        data: Vendor[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url?: string;
            label: string;
            active: boolean;
        }>;
    };
    stats: {
        total: number;
        active: number;
        inactive: number;
        pending: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export interface VendorShowProps {
    vendor: Vendor;
    recentBatches: VendorBatch[];
    stats: {
        users: number;
        products: number;
        batches: {
            total: number;
            draft: number;
            sent_for_review: number;
            reviewed: number;
            approved: number;
            rejected: number;
        };
    };
}

export interface VendorCreateProps {
    // This interface represents props for the vendor creation page
    // Currently no specific props are needed, but this maintains type safety
    [key: string]: never;
}

export interface VendorEditProps {
    vendor: Vendor;
}
