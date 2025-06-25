<?php

namespace App\Modules\Products\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BatchResource extends JsonResource
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
            'vendor_id' => $this->resource->vendor_id,
            'name' => $this->resource->name,
            'description' => $this->resource->description,
            'status' => $this->resource->status,
            'status_display' => $this->resource->status_display,
            'sent_for_review_at' => $this->resource->sent_for_review_at,
            'reviewed_at' => $this->resource->reviewed_at,
            'reviewed_by' => $this->resource->reviewed_by,
            'total_products' => $this->resource->total_products,
            'verified_products' => $this->resource->verified_products,
            'notes' => $this->resource->notes,
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,

            // Relationships
            'vendor' => $this->whenLoaded('vendor', function () {
                return [
                    'id' => $this->resource->vendor->id,
                    'name' => $this->resource->vendor->name,
                    'email' => $this->resource->vendor->email,
                ];
            }),

            'reviewer' => $this->whenLoaded('reviewer', function () {
                return [
                    'id' => $this->resource->reviewer->id,
                    'name' => $this->resource->reviewer->name,
                    'email' => $this->resource->reviewer->email,
                ];
            }),

            'products' => $this->whenLoaded('products', function () {
                return ProductResource::collection($this->resource->products);
            }),

            // Computed fields
            'is_sent_for_review' => $this->resource->isSentForReview(),
            'is_reviewed' => $this->resource->isReviewed(),
            'can_approve' => $this->resource->status === 'sent_for_review',
            'can_reject' => $this->resource->status === 'sent_for_review',
            'can_send_for_review' => $this->resource->status === 'draft',
        ];
    }
}
