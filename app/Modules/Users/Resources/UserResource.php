<?php

namespace App\Modules\Users\Resources;

use App\Modules\Users\Models\User;
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
            'email_verified_at' => $this->whenNotNull($this->resource->email_verified_at, fn($date) => $date->format('Y-m-d H:i:s')),
            'created_at' => $this->resource->created_at->format('Y-m-d H:i:S'),
            'updated_at' => $this->resource->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
