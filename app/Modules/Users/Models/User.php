<?php

namespace App\Modules\Users\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Role;
use App\Vendor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;

    use Notifiable;

    /**
     * The model's factory class.
     */
    protected static string $factory = \Database\Factories\UserFactory::class;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'vendor_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's role
     *
     * @return BelongsTo<Role, User>
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the user's vendor
     *
     * @return BelongsTo<Vendor, User>
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole(string $role): ?bool
    {
        return $this->role?->slug === $role;
    }

    /**
     * Check if user has a specific permission
     */
    public function hasPermission(string $permission): bool
    {
        if (! $this->role) {
            return false;
        }

        return $this->role->hasPermission($permission);
    }

    /**
     * Check if user has any of the given permissions
     *
     * @param  array<string>  $permissions
     */
    public function hasAnyPermission(array $permissions): ?bool
    {
        foreach ($permissions as $permission) {
            if ($this->hasPermission($permission)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if user has all of the given permissions
     *
     * @param  array<string>  $permissions
     */
    public function hasAllPermissions(array $permissions): ?bool
    {
        foreach ($permissions as $permission) {
            if (! $this->hasPermission($permission)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if user is a superadmin
     */
    public function isSuperAdmin(): bool
    {
        return $this->role && $this->role->isSuperAdmin();
    }

    /**
     * Check if user can impersonate other users
     */
    public function canImpersonate(): bool
    {
        return $this->hasPermission('impersonate_users');
    }

    /**
     * Check if this user can be impersonated by another user
     */
    public function canBeImpersonated(User $impersonator): bool
    {
        // Superadmins cannot be impersonated
        if ($this->isSuperAdmin()) {
            return false;
        }

        // Only superadmins can impersonate
        if (! $impersonator->isSuperAdmin()) {
            return false;
        }

        // Cannot impersonate yourself
        return $this->id !== $impersonator->id;
    }

    /**
     * Get user's role name for display
     */
    public function getRoleName(): ?string
    {
        return $this->role->name ?? 'No Role';
    }

    /**
     * Get all permissions for this user through their role
     *
     * @return \Illuminate\Support\Collection<int, \App\Permission>
     */
    public function getPermissions()
    {
        return $this->role ? $this->role->permissions : collect();
    }
}
