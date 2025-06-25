<?php

namespace Database\Seeders;

use App\Modules\Products\Models\Product;
use App\Modules\Products\Models\ProductBatch;
use App\Modules\Users\Models\User;
use App\Role;
use App\Vendor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class VendorProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Starting vendor and product seeding...');

        // Get the vendor role
        $vendorRole = Role::where('slug', 'vendor')->first();

        if (!$vendorRole) {
            $this->command->error('Vendor role not found. Please run RolePermissionSeeder first.');
            return;
        }

        // Create vendor businesses with varied creation dates
        $vendors = [
            [
                'name' => 'Amazon Refurb Center',
                'company_email' => 'contact@amazonrefurb.com',
                'phone' => '+1-555-0101',
                'address' => '123 Fulfillment Way, Seattle, WA 98109',
                'contact_person' => 'Sarah Johnson',
                'registration_number' => 'AMZ-REF-2024-001',
                'status' => 'active',
                'description' => 'Authorized Amazon refurbishment center specializing in electronics returns',
                'created_at' => now()->subDays(28),
                'updated_at' => now()->subDays(28),
            ],
            [
                'name' => 'Best Buy Returns LLC',
                'company_email' => 'vendors@bestbuyreturns.com',
                'phone' => '+1-555-0202',
                'address' => '456 Commerce Drive, Minneapolis, MN 55402',
                'contact_person' => 'Michael Chen',
                'registration_number' => 'BBR-LLC-2024-002',
                'status' => 'active',
                'description' => 'Best Buy authorized returns processing and liquidation',
                'created_at' => now()->subDays(22),
                'updated_at' => now()->subDays(22),
            ],
            [
                'name' => 'Tech Revival Co',
                'company_email' => 'info@techrevival.com',
                'phone' => '+1-555-0303',
                'address' => '789 Innovation Blvd, Austin, TX 78701',
                'contact_person' => 'Emily Rodriguez',
                'registration_number' => 'TRC-2024-003',
                'status' => 'active',
                'description' => 'Sustainable tech refurbishment and resale specialists',
                'created_at' => now()->subDays(15),
                'updated_at' => now()->subDays(15),
            ],
            [
                'name' => 'Certified Returns Hub',
                'company_email' => 'team@certifiedreturns.com',
                'phone' => '+1-555-0404',
                'address' => '321 Logistics Lane, Phoenix, AZ 85001',
                'contact_person' => 'David Kim',
                'registration_number' => 'CRH-2024-004',
                'status' => 'pending',
                'description' => 'Certified electronics returns and liquidation services',
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(8),
            ],
        ];

        $createdVendors = [];
        foreach ($vendors as $vendorData) {
            $vendor = Vendor::create($vendorData);
            $createdVendors[] = $vendor;
            $this->command->info("Created vendor: {$vendor->name}");
        }

        // Create vendor users with varied creation dates
        $vendorUsers = [
            [
                'name' => 'John Smith',
                'email' => 'john@amazonrefurb.com',
                'password' => Hash::make('password123'),
                'role_id' => $vendorRole->id,
                'vendor_id' => $createdVendors[0]->id,
                'created_at' => now()->subDays(27),
                'updated_at' => now()->subDays(27),
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah@amazonrefurb.com',
                'password' => Hash::make('password123'),
                'role_id' => $vendorRole->id,
                'vendor_id' => $createdVendors[0]->id,
                'created_at' => now()->subDays(25),
                'updated_at' => now()->subDays(25),
            ],
            [
                'name' => 'Mike Wilson',
                'email' => 'mike@bestbuyreturns.com',
                'password' => Hash::make('password123'),
                'role_id' => $vendorRole->id,
                'vendor_id' => $createdVendors[1]->id,
                'created_at' => now()->subDays(21),
                'updated_at' => now()->subDays(21),
            ],
            [
                'name' => 'Emily Davis',
                'email' => 'emily@bestbuyreturns.com',
                'password' => Hash::make('password123'),
                'role_id' => $vendorRole->id,
                'vendor_id' => $createdVendors[1]->id,
                'created_at' => now()->subDays(20),
                'updated_at' => now()->subDays(20),
            ],
            [
                'name' => 'Alex Thompson',
                'email' => 'alex@techrevival.com',
                'password' => Hash::make('password123'),
                'role_id' => $vendorRole->id,
                'vendor_id' => $createdVendors[2]->id,
                'created_at' => now()->subDays(14),
                'updated_at' => now()->subDays(14),
            ],
            [
                'name' => 'Lisa Chen',
                'email' => 'lisa@certifiedreturns.com',
                'password' => Hash::make('password123'),
                'role_id' => $vendorRole->id,
                'vendor_id' => $createdVendors[3]->id,
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ],
        ];

        $createdUsers = [];
        foreach ($vendorUsers as $userData) {
            $user = User::create($userData);
            $createdUsers[] = $user;
            $this->command->info("Created vendor user: {$user->name} ({$user->email})");
        }

        // Create example products with varied creation dates across last 30 days
        $baseProducts = [
            [
                'vendor_id' => $createdUsers[0]->id,
                'asin' => 'B08N5WRWNW',
                'sku' => 'APPLE-IPH13-128-BLU',
                'title' => 'Apple iPhone 13 128GB Blue (Unlocked)',
                'brand' => 'Apple',
                'category' => 'Electronics',
                'condition' => 'like_new',
                'original_price' => 799.00,
                'listing_price' => 699.00,
                'quantity' => 1,
                'description' => 'Excellent condition iPhone 13 with minimal wear. Includes original box and accessories.',
                'weight' => 0.164,
                'dimensions' => json_encode(['length' => 14.67, 'width' => 7.15, 'height' => 0.76]),
                'status' => 'verified',
                'quality_rating' => 'A',
                'notes' => 'Customer return - changed mind after purchase',
                'verified_at' => now()->subDays(20),
                'created_at' => now()->subDays(25),
                'updated_at' => now()->subDays(20),
            ],
            [
                'vendor_id' => $createdUsers[0]->id,
                'asin' => 'B0BZBKT3XX',
                'sku' => 'AMZREF-MBPRO14-SLV-002',
                'title' => 'MacBook Pro 14" M2 - Silver',
                'brand' => 'Apple',
                'category' => 'Computers',
                'condition' => 'very_good',
                'original_price' => 1999.00,
                'listing_price' => 1699.00,
                'quantity' => 1,
                'description' => 'Return due to customer preference change - excellent working condition',
                'weight' => 1.6,
                'dimensions' => json_encode(['length' => 31.26, 'width' => 22.12, 'height' => 1.55]),
                'status' => 'sent_for_review',
                'notes' => 'Return reason: customer_changed_mind',
                'created_at' => now()->subDays(23),
                'updated_at' => now()->subDays(23),
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
                'verified_at' => now()->subDays(18),
                'created_at' => now()->subDays(22),
                'updated_at' => now()->subDays(18),
            ],
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
                'created_at' => now()->subDays(19),
                'updated_at' => now()->subDays(19),
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
                'verified_at' => now()->subDays(15),
                'created_at' => now()->subDays(17),
                'updated_at' => now()->subDays(15),
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
                'created_at' => now()->subDays(14),
                'updated_at' => now()->subDays(14),
            ],
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
                'verified_at' => now()->subDays(10),
                'created_at' => now()->subDays(12),
                'updated_at' => now()->subDays(10),
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
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(8),
            ],
        ];

        $createdProducts = [];
        foreach ($baseProducts as $productData) {
            $product = Product::create($productData);
            $createdProducts[] = $product;
            $this->command->info("Created product: {$product->title}");
        }

        // Create example batches with varied creation dates
        $batches = [
            [
                'vendor_id' => $createdUsers[0]->id,
                'name' => 'Apple Products - January 2025',
                'description' => 'Monthly batch of Apple returns and refurbs',
                'status' => 'sent_for_review',
                'created_at' => now()->subDays(24),
                'updated_at' => now()->subDays(20),
            ],
            [
                'vendor_id' => $createdUsers[2]->id,
                'name' => 'Electronics Batch #001',
                'description' => 'Mixed electronics returns from Q4 2024',
                'status' => 'reviewed',
                'created_at' => now()->subDays(18),
                'updated_at' => now()->subDays(15),
            ],
            [
                'vendor_id' => $createdUsers[4]->id,
                'name' => 'Refurbished Items - Week 1',
                'description' => 'Weekly refurbished items ready for quality check',
                'status' => 'approved',
                'created_at' => now()->subDays(11),
                'updated_at' => now()->subDays(9),
            ],
            [
                'vendor_id' => $createdUsers[1]->id,
                'name' => 'Draft Batch - Testing',
                'description' => 'Draft batch for testing purposes',
                'status' => 'draft',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
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

            // Add hundreds of additional test products for pagination testing
            if ($batch->name === 'Electronics Batch #001') {
                $this->command->info("Creating hundreds of test products for batch: {$batch->name}");

                // Create products spread across different days over the last 18 days
                for ($i = 1; $i <= 150; $i++) {
                    $daysAgo = 18 - (($i - 1) % 18); // Spread products across 18 days
                    $createdAt = now()->subDays($daysAgo);
                    $product = Product::create([
                        'vendor_id' => $batchUser->id,
                        'batch_id' => $batch->id,
                        'asin' => 'TEST-ASIN-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                        'sku' => 'TEST-SKU-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                        'title' => "Test Product #{$i} - Electronics Item",
                        'brand' => ['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Microsoft'][array_rand(['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Microsoft'])],
                        'category' => ['Electronics', 'Computers', 'Audio', 'Tablets'][array_rand(['Electronics', 'Computers', 'Audio', 'Tablets'])],
                        'condition' => ['new', 'like_new', 'very_good', 'good'][array_rand(['new', 'like_new', 'very_good', 'good'])],
                        'original_price' => rand(50, 2000),
                        'listing_price' => rand(40, 1800),
                        'quantity' => rand(1, 5),
                        'description' => "Test product #{$i} for pagination testing - " . ['Customer return', 'Open box', 'Refurbished', 'Like new'][array_rand(['Customer return', 'Open box', 'Refurbished', 'Like new'])],
                        'weight' => rand(100, 5000) / 1000, // Weight in kg
                        'dimensions' => json_encode(['length' => rand(10, 50), 'width' => rand(10, 40), 'height' => rand(2, 15)]),
                        'status' => ['in_batch', 'sent_for_review', 'verified'][array_rand(['in_batch', 'sent_for_review', 'verified'])],
                        'quality_rating' => rand(1, 10) > 7 ? ['A', 'B', 'C'][array_rand(['A', 'B', 'C'])] : null,
                        'notes' => "Test product #{$i} - Return reason: " . ['customer_changed_mind', 'defective_item', 'wrong_item_ordered', 'size_fit_issue'][array_rand(['customer_changed_mind', 'defective_item', 'wrong_item_ordered', 'size_fit_issue'])],
                        'verified_at' => rand(1, 10) > 6 ? $createdAt->copy()->addDays(rand(1, 3)) : null,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);

                    if ($i % 50 === 0) {
                        $this->command->info("Created {$i} test products...");
                    }
                }

                // Update batch total_products count
                $batch->update([
                    'total_products' => $batch->products()->count(),
                    'verified_products' => $batch->products()->whereNotNull('verified_at')->count(),
                ]);

                $this->command->info("Updated batch: {$batch->name} with {$batch->total_products} products");
            }

            $this->command->info("Created batch: {$batch->name}");
        }

        // Now, let's create additional products spread throughout the last 30 days to populate the charts
        $this->command->info("Creating additional products for chart data...");

        $chartProducts = [];
        for ($day = 29; $day >= 0; $day--) {
            $productsPerDay = rand(3, 12); // Random number of products per day

            for ($p = 1; $p <= $productsPerDay; $p++) {
                $vendor = $createdUsers[array_rand($createdUsers)];
                $createdAt = now()->subDays($day)->addHours(rand(8, 18))->addMinutes(rand(0, 59));
                $chartProducts[] = [
                    'vendor_id' => $vendor->id,
                    'asin' => 'CHART-' . $day . '-' . str_pad($p, 2, '0', STR_PAD_LEFT),
                    'sku' => 'CHART-SKU-' . $day . '-' . str_pad($p, 2, '0', STR_PAD_LEFT),
                    'title' => "Chart Product Day {$day} #{$p}",
                    'brand' => ['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Microsoft', 'Canon', 'Nintendo'][array_rand(['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Microsoft', 'Canon', 'Nintendo'])],
                    'category' => ['Electronics', 'Computers', 'Audio', 'Tablets', 'Gaming', 'Photography'][array_rand(['Electronics', 'Computers', 'Audio', 'Tablets', 'Gaming', 'Photography'])],
                    'condition' => ['new', 'like_new', 'very_good', 'good', 'acceptable'][array_rand(['new', 'like_new', 'very_good', 'good', 'acceptable'])],
                    'original_price' => rand(80, 2500),
                    'listing_price' => rand(70, 2200),
                    'quantity' => rand(1, 3),
                    'description' => "Product for chart data generation - Day {$day}",
                    'weight' => rand(50, 3000) / 1000,
                    'dimensions' => json_encode(['length' => rand(5, 60), 'width' => rand(5, 50), 'height' => rand(1, 20)]),
                    'status' => ['pending', 'in_batch', 'sent_for_review', 'verified', 'rejected'][array_rand(['pending', 'in_batch', 'sent_for_review', 'verified', 'rejected'])],
                    'quality_rating' => rand(1, 10) > 6 ? ['A', 'B', 'C'][array_rand(['A', 'B', 'C'])] : null,
                    'notes' => "Chart product for day {$day}",
                    'verified_at' => rand(1, 10) > 5 ? $createdAt->copy()->addDays(rand(1, 5)) : null,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ];
            }
        }

        // Batch insert chart products for performance
        foreach (array_chunk($chartProducts, 50) as $chunk) {
            Product::insert($chunk);
        }

        $this->command->info("Created " . count($chartProducts) . " additional products for chart data");

        $this->command->info('Vendor and product seeding completed successfully!');
        $this->command->info('');
        $this->command->info('Created vendor login credentials:');
        $this->command->info('john@amazonrefurb.com / password123');
        $this->command->info('sarah@amazonrefurb.com / password123');
        $this->command->info('mike@bestbuyreturns.com / password123');
        $this->command->info('emily@bestbuyreturns.com / password123');
        $this->command->info('alex@techrevival.com / password123');
        $this->command->info('lisa@certifiedreturns.com / password123');
    }
}
