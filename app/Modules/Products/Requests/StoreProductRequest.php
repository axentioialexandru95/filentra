<?php

namespace App\Modules\Products\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->hasRole('vendor');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'asin' => 'required|string|max:20|unique:products,asin',
            'sku' => 'required|string|max:50',
            'title' => 'required|string|max:255',
            'brand' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'condition' => 'required|string|in:new,like_new,very_good,good,acceptable',
            'original_price' => 'required|numeric|min:0',
            'listing_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'description' => 'nullable|string|max:2000',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|array',
            'dimensions.length' => 'nullable|numeric|min:0',
            'dimensions.width' => 'nullable|numeric|min:0',
            'dimensions.height' => 'nullable|numeric|min:0',
            'images' => 'nullable|array|max:5',
            'images.*' => 'string|url',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'asin' => 'ASIN',
            'sku' => 'SKU',
            'original_price' => 'original price',
            'listing_price' => 'listing price',
            'dimensions.length' => 'length',
            'dimensions.width' => 'width',
            'dimensions.height' => 'height',
        ];
    }
}
