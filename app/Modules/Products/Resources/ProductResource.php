<?php

namespace App\Modules\Products\Resources;

use App\Modules\Users\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'batch_id' => $this->resource->batch_id,
            'asin' => $this->resource->asin,
            'sku' => $this->resource->sku,
            'title' => $this->resource->title,
            'brand' => $this->resource->brand,
            'category' => $this->resource->category,
            'condition' => $this->resource->condition,
            'original_price' => $this->resource->original_price,
            'listing_price' => $this->resource->listing_price,
            'quantity' => $this->resource->quantity,
            'description' => $this->resource->description,
            'images' => $this->resource->images,
            'weight' => $this->resource->weight,
            'dimensions' => $this->resource->dimensions,
            'quality_rating' => $this->resource->quality_rating,
            'quality_display' => $this->resource->quality_display,
            'status' => $this->resource->status,
            'status_display' => $this->resource->status_display,
            'notes' => $this->resource->notes,
            'csv_data' => $this->resource->csv_data,
            'verified_at' => $this->resource->verified_at,
            'verified_by' => $this->resource->verified_by,
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,

            // Relationships
            'vendor' => $this->whenLoaded('vendor', function () {
                return new UserResource($this->resource->vendor);
            }),

            'batch' => $this->whenLoaded('batch', function () {
                return [
                    'id' => $this->resource->batch->id,
                    'name' => $this->resource->batch->name,
                    'status' => $this->resource->batch->status,
                ];
            }),

            'verifier' => $this->whenLoaded('verifier', function () {
                return new UserResource($this->resource->verifier);
            }),

            // Computed fields
            'is_verified' => $this->resource->isVerified(),
            'formatted_price' => '$'.number_format($this->resource->listing_price, 2),
            'formatted_original_price' => '$'.number_format($this->resource->original_price, 2),
            'price_difference' => $this->resource->original_price - $this->resource->listing_price,
            'formatted_price_difference' => '$'.number_format($this->resource->original_price - $this->resource->listing_price, 2),
        ];
    }
}
