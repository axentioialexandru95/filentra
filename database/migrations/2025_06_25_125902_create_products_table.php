<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('batch_id')->nullable()->constrained('product_batches')->onDelete('set null');
            $table->string('asin', 20)->index();
            $table->string('sku', 50)->index();
            $table->string('title');
            $table->string('brand', 100)->index();
            $table->string('category', 100)->index();
            $table->enum('condition', ['new', 'like_new', 'very_good', 'good', 'acceptable']);
            $table->decimal('original_price', 10, 2);
            $table->decimal('listing_price', 10, 2);
            $table->integer('quantity')->default(1);
            $table->text('description')->nullable();
            $table->json('images')->nullable();
            $table->decimal('weight', 8, 2)->nullable();
            $table->json('dimensions')->nullable();
            $table->enum('quality_rating', ['A', 'B', 'C'])->nullable()->index();
            $table->enum('status', ['pending', 'in_batch', 'sent_for_review', 'verified', 'rejected'])->default('pending')->index();
            $table->text('notes')->nullable();
            $table->json('csv_data')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            // Indexes for better performance
            $table->index(['vendor_id', 'status']);
            $table->index(['asin', 'vendor_id']);
            $table->index(['status', 'quality_rating']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
