<?php

namespace App\Modules\Users\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Role;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory;
    use Notifiable;

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory(): \Database\Factories\UserFactory
    {
        return \Database\Factories\UserFactory::new();
    }

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
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }



    /**
     * Check if user has a specific role
     */
    public function hasRole(string $role): bool
    {
        return $this->role?->slug === $role;
    }

    /**
     * Check if user has a specific permission
     */
    public function hasPermission(string $permission): bool
    {
        return $this->role?->hasPermission($permission) ?? false;
    }

    /**
     * Check if user is a superadmin
     */
    public function isSuperAdmin(): bool
    {
        return $this->role?->isSuperAdmin() ?? false;
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
        if (!$impersonator->isSuperAdmin()) {
            return false;
        }

        // Cannot impersonate yourself
        return $this->id !== $impersonator->id;
    }

    /**
     * Get user's role name for display
     */
    public function getRoleName(): string
    {
        return $this->role?->name ?? 'No Role';
    }
}
