<?php

namespace App\Core\Traits;

use App\Modules\Tenants\Models\Tenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasTenantScope
{
    /**
     * Boot the HasTenantScope trait for a model.
     */
    protected static function bootHasTenantScope(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder): void {
            $tenantId = static::getCurrentTenantId();
            if ($tenantId) {
                $builder->where('tenant_id', $tenantId);
            }
        });

        static::creating(function (Model $model): void {
            $tenantId = static::getCurrentTenantId();
            if ($tenantId && !$model->tenant_id) {
                $model->tenant_id = $tenantId;
            }
        });
    }

    /**
     * Get the current tenant ID from the application context.
     */
    protected static function getCurrentTenantId(): ?int
    {
        try {
            return app('current_tenant_id');
        } catch (\Illuminate\Contracts\Container\BindingResolutionException $e) {
            // No tenant context available (e.g., during seeding, testing, etc.)
            return null;
        }
    }

    /**
     * Get the tenant that owns the model.
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Scope a query to only include models for a specific tenant.
     */
    public function scopeForTenant(Builder $query, int $tenantId): Builder
    {
        return $query->where('tenant_id', $tenantId);
    }

    /**
     * Scope a query to exclude tenant filtering.
     */
    public function scopeWithoutTenantScope(Builder $query): Builder
    {
        return $query->withoutGlobalScope('tenant');
    }

    /**
     * Check if the model belongs to a specific tenant.
     */
    public function belongsToTenant(int $tenantId): bool
    {
        return $this->tenant_id === $tenantId;
    }
}
