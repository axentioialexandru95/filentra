<?php

namespace Database\Seeders;

use App\Modules\Products\Models\Product;
use App\Modules\Products\Models\ProductBatch;
use App\Modules\Users\Models\User;
use App\Role;
use App\Vendor;
use Illuminate\Database\Seeder;

class VendorProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the vendor role
        $vendorRole = Role::where('slug', 'vendor')->first();
        
        if (!$vendorRole) {
            $this->command->error('Vendor role not found. Please run RolePermissionSeeder first.');
            return;
        }

        // Create example vendors
        $vendors = [
            [
                'name' => 'Amazon Refurb Center',
                'company_email' => 'operations@amazonrefurb.com',
                'phone' => '+1-555-0123',
                'address' => '1234 Warehouse Drive, Seattle, WA 98101',
                'contact_person' => 'Sarah Johnson',
                'registration_number' => 'AMZ-REF-2024-001',
                'status' => 'active',
                'description' => 'Specialized in refurbishing Amazon returned electronics and consumer goods.',
            ],
            [
                'name' => 'Best Buy Returns LLC',
                'company_email' => 'returns@bestbuyreturns.com',
                'phone' => '+1-555-0456',
                'address' => '5678 Industrial Blvd, Minneapolis, MN 55402',
                'contact_person' => 'Michael Chen',
                'registration_number' => 'BBR-LLC-2024-002',
                'status' => 'active',
                'description' => 'Processing and refurbishing Best Buy customer returns and open-box items.',
            ],
            [
                'name' => 'Tech Revival Co',
                'company_email' => 'hello@techrevival.co',
                'phone' => '+1-555-0789',
                'address' => '9012 Innovation Park, Austin, TX 78701',
                'contact_person' => 'Emily Rodriguez',
                'registration_number' => 'TRC-2024-003',
                'status' => 'active',
                'description' => 'Eco-friendly electronics refurbishment and resale company.',
            ],
            [
                'name' => 'Certified Returns Hub',
                'company_email' => 'ops@certifiedhub.com',
                'phone' => '+1-555-0321',
                'address' => '3456 Logistics Center, Phoenix, AZ 85001',
                'contact_person' => 'David Kim',
                'registration_number' => 'CRH-2024-004',
                'status' => 'pending',
                'description' => 'New vendor specializing in certified pre-owned electronics.',
            ],
        ];

        $createdVendors = [];
        foreach ($vendors as $vendorData) {
            $vendor = Vendor::create($vendorData);
            $createdVendors[] = $vendor;
            $this->command->info("Created vendor: {$vendor->name}");
        }

        // Create vendor users
        $vendorUsers = [
            // Amazon Refurb Center users
            [
                'vendor_id' => $createdVendors[0]->id,
                'name' => 'John Smith',
                'email' => 'john.smith@amazonrefurb.com',
                'password' => bcrypt('password'),
                'role_id' => $vendorRole->id,
                'email_verified_at' => now(),
            ],
            [
                'vendor_id' => $createdVendors[0]->id,
                'name' => 'Lisa Wang',
                'email' => 'lisa.wang@amazonrefurb.com',
                'password' => bcrypt('password'),
                'role_id' => $vendorRole->id,
                'email_verified_at' => now(),
            ],
            // Best Buy Returns LLC users
            [
                'vendor_id' => $createdVendors[1]->id,
                'name' => 'Robert Taylor',
                'email' => 'robert.taylor@bestbuyreturns.com',
                'password' => bcrypt('password'),
                'role_id' => $vendorRole->id,
                'email_verified_at' => now(),
            ],
            [
                'vendor_id' => $createdVendors[1]->id,
                'name' => 'Amanda Foster',
                'email' => 'amanda.foster@bestbuyreturns.com',
                'password' => bcrypt('password'),
                'role_id' => $vendorRole->id,
                'email_verified_at' => now(),
            ],
            // Tech Revival Co users
            [
                'vendor_id' => $createdVendors[2]->id,
                'name' => 'Carlos Martinez',
                'email' => 'carlos@techrevival.co',
                'password' => bcrypt('password'),
                'role_id' => $vendorRole->id,
                'email_verified_at' => now(),
            ],
            // Certified Returns Hub user
            [
                'vendor_id' => $createdVendors[3]->id,
                'name' => 'Jennifer Lee',
                'email' => 'jennifer@certifiedhub.com',
                'password' => bcrypt('password'),
                'role_id' => $vendorRole->id,
                'email_verified_at' => now(),
            ],
        ];

        $createdUsers = [];
        foreach ($vendorUsers as $userData) {
            $user = User::create($userData);
            $createdUsers[] = $user;
            $this->command->info("Created user: {$user->name} for vendor: {$user->vendor->name}");
        }

        // Create example products
        $products = [
            // Amazon Refurb Center products
            [
                'vendor_id' => $createdUsers[0]->id,
                'asin' => 'B09G998XXX',
                'sku' => 'AMZREF-IPH13P-SG-001',
                'title' => 'iPhone 13 Pro - Space Gray',
                'brand' => 'Apple',
                'category' => 'Electronics',
                'condition' => 'good',
                'original_price' => 999.00,
                'listing_price' => 750.00,
                'quantity' => 1,
                'description' => 'Customer return - minor cosmetic scratches on back, fully functional',
                'weight' => 0.204,
                'dimensions' => json_encode(['length' => 146.7, 'width' => 71.5, 'height' => 7.65]),
                'status' => 'pending',
                'notes' => 'Return reason: customer_changed_mind',
            ],
            [
                'vendor_id' => $createdUsers[0]->id,
                'asin' => 'B0B3C2K8XX',
                'sku' => 'AMZREF-MBA-M2-SLV-002',
                'title' => 'MacBook Air M2 - Silver',
                'brand' => 'Apple',
                'category' => 'Computers',
                'condition' => 'like_new',
                'original_price' => 1199.00,
                'listing_price' => 1050.00,
                'quantity' => 1,
                'description' => 'Open box return - pristine condition with all accessories',
                'weight' => 1.24,
                'dimensions' => json_encode(['length' => 304.1, 'width' => 215.0, 'height' => 11.3]),
                'status' => 'in_batch',
                'notes' => 'Return reason: wrong_item_ordered',
            ],
            [
                'vendor_id' => $createdUsers[1]->id,
                'asin' => 'B0BDHB9XXX',
                'sku' => 'AMZREF-AWS8-BLK-003',
                'title' => 'Apple Watch Series 8 - Black',
                'brand' => 'Apple',
                'category' => 'Wearables',
                'condition' => 'like_new',
                'original_price' => 399.00,
                'listing_price' => 340.00,
                'quantity' => 1,
                'description' => 'Return due to sizing issue - excellent condition',
                'weight' => 0.038,
                'dimensions' => json_encode(['length' => 45.0, 'width' => 38.0, 'height' => 10.7]),
                'status' => 'verified',
                'quality_rating' => 'A',
                'notes' => 'Return reason: size_fit_issue',
                'verified_at' => now(),
            ],
            // Best Buy Returns products
            [
                'vendor_id' => $createdUsers[2]->id,
                'asin' => 'B0BKYRQ7XX',
                'sku' => 'BBR-SGS23U-BLK-004',
                'title' => 'Samsung Galaxy S23 Ultra',
                'brand' => 'Samsung',
                'category' => 'Electronics',
                'condition' => 'good',
                'original_price' => 1199.00,
                'listing_price' => 900.00,
                'quantity' => 1,
                'description' => 'Customer return - screen protector applied, minor wear',
                'weight' => 0.234,
                'dimensions' => json_encode(['length' => 163.4, 'width' => 78.1, 'height' => 8.9]),
                'status' => 'sent_for_review',
                'notes' => 'Return reason: defective_item',
            ],
            [
                'vendor_id' => $createdUsers[2]->id,
                'asin' => 'B09HKY7XXX',
                'sku' => 'BBR-XPS13-SLV-005',
                'title' => 'Dell XPS 13 Laptop',
                'brand' => 'Dell',
                'category' => 'Computers',
                'condition' => 'like_new',
                'original_price' => 1299.00,
                'listing_price' => 1150.00,
                'quantity' => 1,
                'description' => 'Open box - missing original packaging, item pristine',
                'weight' => 1.27,
                'dimensions' => json_encode(['length' => 295.7, 'width' => 199.04, 'height' => 14.8]),
                'status' => 'verified',
                'quality_rating' => 'A',
                'notes' => 'Return reason: wrong_item_ordered',
                'verified_at' => now(),
            ],
            [
                'vendor_id' => $createdUsers[3]->id,
                'asin' => 'B0863TXGM3',
                'sku' => 'BBR-SONY-WH1000-006',
                'title' => 'Sony WH-1000XM4 Headphones',
                'brand' => 'Sony',
                'category' => 'Audio',
                'condition' => 'good',
                'original_price' => 349.00,
                'listing_price' => 280.00,
                'quantity' => 1,
                'description' => 'Return - slight wear on ear pads, excellent audio quality',
                'weight' => 0.254,
                'dimensions' => json_encode(['length' => 254.0, 'width' => 203.0, 'height' => 76.0]),
                'status' => 'rejected',
                'quality_rating' => 'C',
                'notes' => 'Return reason: customer_changed_mind. Rejection: Wear exceeds acceptable limits for resale',
            ],
            // Tech Revival Co products
            [
                'vendor_id' => $createdUsers[4]->id,
                'asin' => 'B0BBQJJWXX',
                'sku' => 'TRC-IPADPRO11-WF-007',
                'title' => 'iPad Pro 11" - Wi-Fi',
                'brand' => 'Apple',
                'category' => 'Tablets',
                'condition' => 'very_good',
                'original_price' => 799.00,
                'listing_price' => 650.00,
                'quantity' => 1,
                'description' => 'Refurbished - new screen, battery replaced',
                'weight' => 0.466,
                'dimensions' => json_encode(['length' => 247.6, 'width' => 178.5, 'height' => 5.9]),
                'status' => 'verified',
                'quality_rating' => 'B',
                'notes' => 'Return reason: defective_item. Professionally refurbished',
                'verified_at' => now(),
            ],
            [
                'vendor_id' => $createdUsers[4]->id,
                'asin' => 'B0B4ZJH3XX',
                'sku' => 'TRC-MSP9-BLK-008',
                'title' => 'Microsoft Surface Pro 9',
                'brand' => 'Microsoft',
                'category' => 'Tablets',
                'condition' => 'good',
                'original_price' => 999.00,
                'listing_price' => 800.00,
                'quantity' => 1,
                'description' => 'Customer return - minor keyboard wear, screen perfect',
                'weight' => 0.879,
                'dimensions' => json_encode(['length' => 287.0, 'width' => 208.0, 'height' => 9.3]),
                'status' => 'pending',
                'notes' => 'Return reason: customer_changed_mind',
            ],
        ];

        $createdProducts = [];
        foreach ($products as $productData) {
            $product = Product::create($productData);
            $createdProducts[] = $product;
            $this->command->info("Created product: {$product->name}");
        }

        // Create example batches
        $batches = [
            [
                'vendor_id' => $createdUsers[0]->id,
                'name' => 'Apple Products - January 2025',
                'description' => 'Monthly batch of Apple returns and refurbs',
                'status' => 'sent_for_review',
            ],
            [
                'vendor_id' => $createdUsers[2]->id,
                'name' => 'Electronics Batch #001',
                'description' => 'Mixed electronics returns from Q4 2024',
                'status' => 'reviewed',
            ],
            [
                'vendor_id' => $createdUsers[4]->id,
                'name' => 'Refurbished Items - Week 1',
                'description' => 'Weekly refurbished items ready for quality check',
                'status' => 'approved',
            ],
            [
                'vendor_id' => $createdUsers[1]->id,
                'name' => 'Draft Batch - Testing',
                'description' => 'Draft batch for testing purposes',
                'status' => 'draft',
            ],
        ];

        foreach ($batches as $batchData) {
            $batch = ProductBatch::create($batchData);

            // Assign some products to batches
            $batchUser = User::find($batch->vendor_id);
            $vendorProducts = collect($createdProducts)->filter(function ($product) use ($batchUser) {
                return $product->vendor_id === $batchUser->id && $product->status !== 'in_batch';
            });

            $batchProducts = $vendorProducts->take(rand(2, 3));

            foreach ($batchProducts as $product) {
                $product->update([
                    'batch_id' => $batch->id,
                    'status' => 'in_batch'
                ]);
            }

            $this->command->info("Created batch: {$batch->name} with " . $batchProducts->count() . " products");
        }

        $this->command->info('Vendor and product seeding completed successfully!');
        $this->command->line('');
        $this->command->line('Example vendor login credentials:');
        $this->command->line('Email: john.smith@amazonrefurb.com | Password: password');
        $this->command->line('Email: robert.taylor@bestbuyreturns.com | Password: password');
        $this->command->line('Email: carlos@techrevival.co | Password: password');
    }
}
