<?php

namespace App\Modules\RBAC\Resources;

use App\Role;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Role $resource
 */
class RoleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'level' => $this->level,
            'is_active' => $this->is_active,
            'users_count' => $this->when($this->relationLoaded('users'), fn () => $this->users->count()),
            'permissions_count' => $this->when($this->relationLoaded('permissions'), fn () => $this->permissions->count()),
            'permissions' => PermissionResource::collection($this->whenLoaded('permissions')),
            'users' => $this->whenLoaded('users', function () {
                return $this->users->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ];
                });
            }),
            'is_superadmin' => $this->isSuperAdmin(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
