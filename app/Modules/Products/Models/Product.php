<?php

namespace App\Modules\Products\Models;

use App\Modules\Users\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $vendor_id
 * @property int|null $batch_id
 * @property string $asin
 * @property string $sku
 * @property string $title
 * @property string $brand
 * @property string $category
 * @property string $condition
 * @property float $original_price
 * @property float $listing_price
 * @property int $quantity
 * @property string|null $description
 * @property array<string> $images
 * @property float|null $weight
 * @property array<string, mixed> $dimensions
 * @property string|null $quality_rating
 * @property string $status
 * @property string|null $notes
 * @property array<string, mixed> $csv_data
 * @property \Illuminate\Support\Carbon|null $verified_at
 * @property int|null $verified_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Product extends Model
{
    use HasFactory; // @phpstan-ignore-line
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'vendor_id',
        'batch_id',
        'asin',
        'sku',
        'title',
        'brand',
        'category',
        'condition',
        'original_price',
        'listing_price',
        'quantity',
        'description',
        'images',
        'weight',
        'dimensions',
        'quality_rating',
        'status',
        'notes',
        'csv_data',
        'verified_at',
        'verified_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'original_price' => 'decimal:2',
            'listing_price' => 'decimal:2',
            'weight' => 'decimal:2',
            'quantity' => 'integer',
            'images' => 'array',
            'dimensions' => 'array',
            'csv_data' => 'array',
            'verified_at' => 'datetime',
        ];
    }

    /**
     * Get the vendor that owns the product
     *
     * @return BelongsTo<User, $this>
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    /**
     * Get the user who verified the product
     *
     * @return BelongsTo<User, $this>
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Get the batch this product belongs to
     *
     * @return BelongsTo<ProductBatch, $this>
     */
    public function batch(): BelongsTo
    {
        return $this->belongsTo(ProductBatch::class, 'batch_id');
    }

    /**
     * Scope to filter by vendor
     *
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    public function scopeForVendor(Builder $query, int $vendorId): Builder
    {
        return $query->where('vendor_id', $vendorId);
    }

    /**
     * Scope to filter by status
     *
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter by quality rating
     *
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    public function scopeByQuality(Builder $query, string $quality): Builder
    {
        return $query->where('quality_rating', $quality);
    }

    /**
     * Check if product is verified
     */
    public function isVerified(): bool
    {
        return ! is_null($this->verified_at);
    }

    /**
     * Get quality rating display
     */
    public function getQualityDisplayAttribute(): string
    {
        return match ($this->quality_rating) {
            'A' => 'Grade A - Excellent',
            'B' => 'Grade B - Good',
            'C' => 'Grade C - Fair',
            default => 'Not Rated'
        };
    }

    /**
     * Get status display
     */
    public function getStatusDisplayAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'Pending Review',
            'verified' => 'Verified',
            'rejected' => 'Rejected',
            'in_batch' => 'In Batch',
            'sent_for_review' => 'Sent for Review',
            default => 'Unknown'
        };
    }
}
