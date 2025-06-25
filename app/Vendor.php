<?php

namespace App;

use App\Modules\Products\Models\Product;
use App\Modules\Products\Models\ProductBatch;
use App\Modules\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Vendor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'company_email',
        'phone',
        'address',
        'contact_person',
        'registration_number',
        'status',
        'description',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Get the users for the vendor.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the products for the vendor through users.
     */
    public function products(): HasManyThrough
    {
        return $this->hasManyThrough(
            Product::class,
            User::class,
            'vendor_id', // Foreign key on users table
            'vendor_id', // Foreign key on products table
            'id', // Local key on vendors table
            'id' // Local key on users table
        );
    }

    /**
     * Get the batches for the vendor through users.
     */
    public function batches(): HasManyThrough
    {
        return $this->hasManyThrough(
            ProductBatch::class,
            User::class,
            'vendor_id', // Foreign key on users table
            'vendor_id', // Foreign key on product_batches table
            'id', // Local key on vendors table
            'id' // Local key on users table
        );
    }

    /**
     * Scope a query to only include active vendors.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Get vendor stats
     */
    public function getStatsAttribute(): array
    {
        return [
            'total_users' => $this->users()->count(),
            'total_products' => $this->products()->count(),
            'total_batches' => $this->batches()->count(),
            'pending_batches' => $this->batches()->where('status', 'draft')->count(),
            'reviewed_batches' => $this->batches()->where('status', 'reviewed')->count(),
        ];
    }
}
