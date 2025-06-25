// Base types for products and batches
export interface Product {
    id: number;
    vendor_id: number;
    batch_id: number | null;
    asin: string;
    sku: string;
    title: string;
    brand: string;
    category: string;
    condition: ProductCondition;
    original_price: number;
    listing_price: number;
    quantity: number;
    description: string | null;
    images: string[] | null;
    weight: number | null;
    dimensions: ProductDimensions | null;
    quality_rating: QualityRating | null;
    quality_display: string;
    status: ProductStatus;
    status_display: string;
    notes: string | null;
    csv_data: Record<string, string> | null;
    verified_at: string | null;
    verified_by: number | null;
    created_at: string;
    updated_at: string;
    vendor?: User;
    batch?: ProductBatch;
    verifier?: User;
    is_verified: boolean;
    formatted_price: string;
    formatted_original_price: string;
    price_difference: number;
    formatted_price_difference: string;
}

export interface ProductBatch {
    id: number;
    vendor_id: number;
    name: string;
    description: string | null;
    status: BatchStatus;
    status_display: string;
    sent_for_review_at: string | null;
    reviewed_at: string | null;
    reviewed_by: number | null;
    total_products: number;
    verified_products: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
    vendor?: User;
    reviewer?: User;
    products?: Product[];
    is_sent_for_review: boolean;
    is_reviewed: boolean;
    can_send_for_review: boolean;
    can_edit: boolean;
    can_delete: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface ProductDimensions {
    length: number;
    width: number;
    height: number;
}

// Enums
export type ProductCondition = 'new' | 'like_new' | 'very_good' | 'good' | 'acceptable';
export type ProductStatus = 'pending' | 'in_batch' | 'sent_for_review' | 'verified' | 'rejected';
export type BatchStatus = 'draft' | 'sent_for_review' | 'reviewed' | 'approved' | 'rejected';
export type QualityRating = 'A' | 'B' | 'C';

// API Response types
export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
}

export interface ProductStats {
    total: number;
    pending: number;
    verified: number;
    sent_for_review: number;
}

export interface BatchStats {
    total: number;
    draft: number;
    sent_for_review: number;
    reviewed: number;
}

// Filter types
export interface ProductFilters {
    search?: string;
    status?: ProductStatus | '';
    quality?: QualityRating | '';
    vendor_id?: string;
}

export interface BatchFilters {
    search?: string;
    status?: BatchStatus | '';
    vendor_id?: string;
}

// Page Props types
export interface ProductsIndexProps {
    data: PaginatedResponse<Product>;
    stats: ProductStats;
    filters: ProductFilters;
    can_upload_csv: boolean;
    can_manage_quality: boolean;
}

export interface BatchesIndexProps {
    data: PaginatedResponse<ProductBatch>;
    stats: BatchStats;
    filters: BatchFilters;
    can_create_batch: boolean;
    can_review_batches: boolean;
}

export interface ProductShowProps {
    product: Product;
    can_edit: boolean;
    can_delete: boolean;
    can_manage_quality: boolean;
}

export interface BatchShowProps {
    batch: ProductBatch;
    can_edit: boolean;
    can_delete: boolean;
    can_review: boolean;
}

// Form types
export interface ProductFormData {
    asin: string;
    sku: string;
    title: string;
    brand: string;
    category: string;
    condition: ProductCondition;
    original_price: number;
    listing_price: number;
    quantity: number;
    description?: string;
    weight?: number;
    dimensions?: ProductDimensions;
    images?: string[];
    notes?: string;
}

export interface BatchFormData {
    name: string;
    description?: string;
    product_ids: number[];
}

export interface QualityUpdateData {
    quality_rating: QualityRating;
    notes?: string;
}

export interface BatchReviewData {
    status: 'approved' | 'rejected';
    notes?: string;
}

// Badge variant type for UI components (matching actual Badge component)
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

// Utility types for status badges
export interface StatusBadgeConfig {
    variant: BadgeVariant;
    label: string;
}

// Route parameter types
export interface ProductRouteParams {
    productId: number;
}

export interface BatchRouteParams {
    batchId: number;
}

// Error handling types
export interface ValidationError {
    field: string;
    message: string;
}

export interface ApiError {
    message: string;
    errors?: ValidationError[];
}

// CSV upload types
export interface CsvUploadResponse {
    imported: number;
    skipped: number;
    errors: string[];
}
