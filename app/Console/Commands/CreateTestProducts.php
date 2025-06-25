<?php

namespace App\Console\Commands;

use App\Modules\Products\Models\Product;
use App\Modules\Products\Models\ProductBatch;
use Illuminate\Console\Command;

class CreateTestProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:create-products {count=200}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create test products for pagination testing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = (int) $this->argument('count');
        
        // Find the Electronics Batch #001
        $batch = ProductBatch::where('name', 'Electronics Batch #001')->first();

        if (!$batch) {
            $this->error('Electronics Batch #001 not found!');
            return 1;
        }

        $this->info("Found batch: {$batch->name} (ID: {$batch->id})");
        $this->info("Current products: " . $batch->products()->count());

        // Create test products
        $brands = ['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Microsoft', 'LG', 'Asus', 'Lenovo', 'Canon'];
        $categories = ['Electronics', 'Computers', 'Audio', 'Tablets', 'Phones', 'Cameras', 'Gaming'];
        $conditions = ['new', 'like_new', 'very_good', 'good', 'acceptable'];
        $statuses = ['in_batch', 'sent_for_review', 'verified'];
        $qualities = ['A', 'B', 'C'];

        $this->info("Creating {$count} test products...");
        $this->withProgressBar(range(1, $count), function ($i) use ($batch, $brands, $categories, $conditions, $statuses, $qualities) {
            Product::create([
                'vendor_id' => $batch->vendor_id,
                'batch_id' => $batch->id,
                'asin' => 'TEST-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'sku' => 'SKU-TEST-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'title' => "Test Electronics Product #{$i} - " . $brands[array_rand($brands)] . " Device",
                'brand' => $brands[array_rand($brands)],
                'category' => $categories[array_rand($categories)],
                'condition' => $conditions[array_rand($conditions)],
                'original_price' => rand(100, 3000),
                'listing_price' => rand(80, 2500),
                'quantity' => rand(1, 10),
                'description' => "Test product #{$i} for pagination testing. Customer return item.",
                'weight' => rand(200, 8000) / 1000,
                'dimensions' => json_encode(['length' => rand(5, 60), 'width' => rand(5, 45), 'height' => rand(1, 20)]),
                'status' => $statuses[array_rand($statuses)],
                'quality_rating' => rand(1, 10) > 3 ? $qualities[array_rand($qualities)] : null,
                'notes' => "Test product #{$i} - Automated test data",
                'verified_at' => rand(1, 10) > 4 ? now() : null,
            ]);
        });

        $this->newLine();

        // Update batch totals
        $batch->update([
            'total_products' => $batch->products()->count(),
            'verified_products' => $batch->products()->whereNotNull('verified_at')->count(),
        ]);

        $this->info("Test data creation completed!");
        $this->info("Final count: " . $batch->products()->count() . " products");
        $this->info("Verified: " . $batch->products()->whereNotNull('verified_at')->count() . " products");
        $this->info("Batch URL: /batches/{$batch->id}");

        return 0;
    }
}
