<?php

namespace App\Modules\Waitlist\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Waitlist extends Model
{
    /** @use HasFactory<\Database\Factories\WaitlistFactory> */
    use HasFactory;

    protected $table = 'waitlist';

    protected $fillable = [
        'email',
        'interests',
        'joined_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
    ];

    /**
     * Get all waitlist entries ordered by join date
     */
    public static function getAll(): Collection
    {
        return self::orderBy('joined_at', 'desc')->get();
    }

    /**
     * Check if email already exists
     */
    public static function emailExists(string $email): bool
    {
        return self::where('email', $email)->exists();
    }

    /**
     * Get count of waitlist entries
     */
    public static function getCount(): int
    {
        return self::count();
    }
}
