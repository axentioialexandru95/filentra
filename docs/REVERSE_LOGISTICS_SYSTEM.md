# Reverse Logistics System

This document outlines the implementation of the reverse logistics system for managing refurbished products from Amazon CSV data.

## Overview

The reverse logistics system allows vendors to upload CSV files containing product data, create batches for verification, and enables administrators to manage quality control with A, B, C ratings.

## System Architecture

### Roles and Permissions

The system has been streamlined to use only the following roles:

- **Super Administrator**: Complete system access
- **Administrator**: Manages vendors, reviews batches, assigns quality ratings
- **Vendor**: Uploads CSV files, manages products, creates batches
- **Warehouse Manager**: Views warehouse operations and inventory (future implementation)

### Core Modules

#### Products Module (`app/Modules/Products/`)

**Models:**
- `Product`: Represents individual refurbished products with all Amazon-specific attributes
- `ProductBatch`: Groups products for batch processing and verification

**Controllers:**
- `ProductController`: CRUD operations, CSV upload, quality rating management
- `BatchController`: Batch creation, review workflow, approval/rejection

**Key Features:**
- CSV import functionality for Amazon refurbished product data
- Quality rating system (A, B, C grades)
- Status tracking (pending, in_batch, sent_for_review, verified, rejected)
- Role-based access control for different user types

## Database Schema

### Products Table
```sql
- id (primary key)
- vendor_id (foreign key to users)
- batch_id (foreign key to product_batches, nullable)
- asin (Amazon Standard Identification Number)
- sku (Stock Keeping Unit)
- title, brand, category
- condition (new, like_new, very_good, good, acceptable)
- original_price, listing_price
- quantity
- description, images (JSON), weight, dimensions (JSON)
- quality_rating (A, B, C, nullable)
- status (enum: pending, in_batch, sent_for_review, verified, rejected)
- notes, csv_data (JSON)
- verified_at, verified_by
- timestamps
```

### Product Batches Table
```sql
- id (primary key)
- vendor_id (foreign key to users)
- name, description
- status (enum: draft, sent_for_review, reviewed, approved, rejected)
- sent_for_review_at, reviewed_at
- reviewed_by (foreign key to users, nullable)
- total_products, verified_products
- notes
- timestamps
```

## Workflow

### Vendor Workflow
1. **Upload CSV**: Vendors upload CSV files containing product data
2. **Product Management**: Review and edit individual products
3. **Batch Creation**: Group products into batches for verification
4. **Submit for Review**: Send batches to administrators for quality control

### Administrator Workflow
1. **Review Batches**: View batches submitted by vendors
2. **Quality Control**: Assign quality ratings (A, B, C) to individual products
3. **Batch Approval**: Approve or reject entire batches
4. **Vendor Management**: Monitor vendor submissions and performance

## CSV Import Format

The system expects CSV files with the following required headers:
- `asin` (required)
- `sku` (required)
- `title` (required)
- `brand` (required)
- `category` (required)
- `condition` (required: new, like_new, very_good, good, acceptable)
- `original_price` (required)
- `listing_price` (required)
- `quantity` (required)

Optional fields:
- `description`
- `weight`
- `images` (pipe-separated URLs)
- `dimensions_length`, `dimensions_width`, `dimensions_height`

## API Endpoints

### Products
- `GET /products` - List products (filtered by role)
- `POST /products` - Create new product
- `GET /products/{id}` - View product details
- `PATCH /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product
- `POST /products/upload-csv` - Upload CSV file
- `PATCH /products/{id}/quality` - Update quality rating (admin only)

### Batches
- `GET /batches` - List batches (filtered by role)
- `POST /batches` - Create new batch
- `GET /batches/{id}` - View batch details
- `DELETE /batches/{id}` - Delete batch (draft only)
- `PATCH /batches/{id}/send-for-review` - Submit batch for review
- `PATCH /batches/{id}/review` - Approve/reject batch (admin only)

## Frontend Components

### Products Pages
- **Products Index**: Table view with filters, search, CSV upload
- **Product Details**: Individual product information and quality rating
- **Product Create/Edit**: Forms for manual product entry

### Batches Pages
- **Batches Index**: List of all batches with status indicators
- **Batch Create**: Select products and create batch
- **Batch Details**: View batch contents and manage review process

## Security & Permissions

- **Role-based access control** ensures vendors only see their own products
- **Permission system** controls feature access (CSV upload, quality management, etc.)
- **Data validation** on all inputs including CSV uploads
- **Authorization checks** on all sensitive operations

## Quality Control Features

### Quality Ratings
- **Grade A**: Excellent condition
- **Grade B**: Good condition  
- **Grade C**: Fair condition

### Status Tracking
- **Pending**: Newly imported/created products
- **In Batch**: Products grouped for review
- **Sent for Review**: Submitted to administrators
- **Verified**: Approved with quality rating
- **Rejected**: Failed quality control

## Future Enhancements

### Warehouse Manager Features
- Inventory tracking and management
- Product location and movement
- Quality control workflows
- Shipping and logistics integration

### Reporting & Analytics
- Vendor performance metrics
- Product quality trends
- Batch processing efficiency
- Revenue and pricing analysis

### Advanced Features
- Automated quality assessment using AI/ML
- Barcode scanning integration
- Real-time inventory updates
- Integration with Amazon APIs

## Technical Implementation Notes

### Modular Architecture
- Follows the existing project's modular structure
- Clean separation of concerns
- Reusable components and services

### Error Handling
- Comprehensive validation on CSV imports
- Graceful error handling with user feedback
- Transaction safety for batch operations

### Performance Considerations
- Database indexing on key fields
- Pagination for large datasets
- Efficient filtering and search queries

### Code Quality
- PSR-12 coding standards
- PHPStan static analysis
- Comprehensive test coverage (planned)
- TypeScript for frontend type safety

## Installation & Setup

1. Run migrations: `php artisan migrate`
2. Seed roles and permissions: `php artisan db:seed --class=RolePermissionSeeder`
3. Configure navigation in frontend
4. Set up user accounts with appropriate roles

## Usage Examples

### CSV Upload Example
```csv
asin,sku,title,brand,category,condition,original_price,listing_price,quantity,description
B08N5WRWNW,ECHO-DOT-4-001,Amazon Echo Dot (4th Gen),Amazon,Electronics,like_new,49.99,39.99,5,Smart speaker with Alexa
```

### API Usage Example
```javascript
// Upload CSV
const formData = new FormData();
formData.append('csv_file', file);
await fetch('/products/upload-csv', {
    method: 'POST',
    body: formData
});

// Update quality rating
await fetch(`/products/${productId}/quality`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        quality_rating: 'A',
        notes: 'Excellent condition, minor packaging wear'
    })
});
```

This reverse logistics system provides a comprehensive solution for managing refurbished product inventory with proper quality control, role-based access, and efficient batch processing workflows. 