<?php

namespace App\Modules\Products\Models;

use App\Modules\Users\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $vendor_id
 * @property string $name
 * @property string|null $description
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $sent_for_review_at
 * @property \Illuminate\Support\Carbon|null $reviewed_at
 * @property int|null $reviewed_by
 * @property int $total_products
 * @property int $verified_products
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class ProductBatch extends Model
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
        'name',
        'description',
        'status',
        'sent_for_review_at',
        'reviewed_at',
        'reviewed_by',
        'total_products',
        'verified_products',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sent_for_review_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'total_products' => 'integer',
            'verified_products' => 'integer',
        ];
    }

    /**
     * Get the vendor that owns the batch
     *
     * @return BelongsTo<User, $this>
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    /**
     * Get the user who created the batch (alias for vendor)
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    /**
     * Get the user who reviewed the batch
     *
     * @return BelongsTo<User, $this>
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Get the products in this batch
     *
     * @return HasMany<Product, $this>
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'batch_id');
    }

    /**
     * Scope to filter by vendor
     *
     * @param  Builder<ProductBatch>  $query
     * @return Builder<ProductBatch>
     */
    public function scopeForVendor(Builder $query, int $vendorId): Builder
    {
        return $query->where('vendor_id', $vendorId);
    }

    /**
     * Scope to filter by status
     *
     * @param  Builder<ProductBatch>  $query
     * @return Builder<ProductBatch>
     */
    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Check if batch is sent for review
     */
    public function isSentForReview(): bool
    {
        return ! is_null($this->sent_for_review_at);
    }

    /**
     * Check if batch is reviewed
     */
    public function isReviewed(): bool
    {
        return ! is_null($this->reviewed_at);
    }

    /**
     * Get status display
     */
    public function getStatusDisplayAttribute(): string
    {
        return match ($this->status) {
            'draft' => 'Draft',
            'sent_for_review' => 'Sent for Review',
            'reviewed' => 'Reviewed',
            'approved' => 'Approved',
            'rejected' => 'Rejected',
            default => 'Unknown'
        };
    }
}
