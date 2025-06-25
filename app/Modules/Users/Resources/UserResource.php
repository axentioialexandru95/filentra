<?php

namespace App\Modules\Users\Resources;

use App\Modules\Users\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property User $resource
 */
class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'email' => $this->resource->email,
            'email_verified_at' => $this->formatDate($this->resource->email_verified_at),

            'role_id' => $this->resource->role_id,
            'role' => $this->whenLoaded('role', function () {
                return [
                    'id' => $this->resource->role->id,
                    'name' => $this->resource->role->name,
                    'slug' => $this->resource->role->slug,
                    'level' => $this->resource->role->level,
                ];
            }),

            'role_name' => $this->resource->getRoleName(),
            'is_superadmin' => $this->resource->isSuperAdmin(),
            'created_at' => $this->formatDate($this->resource->created_at),
            'updated_at' => $this->formatDate($this->resource->updated_at),
        ];
    }

    /**
     * Format a date attribute
     */
    private function formatDate(mixed $date): string|null
    {
        if ($date instanceof Carbon) {
            return $date->format('Y-m-d H:i:s');
        }

        if (is_string($date)) {
            return $date;
        }

        return null;
    }
}
