<?php

namespace App\Modules\Products\Services;

use App\Modules\Products\Models\Product;
use Illuminate\Support\Facades\Validator;

class CsvImportService
{
    /**
     * Import products from CSV file
     *
     * @return array{imported: int, skipped: int, errors: array<string>}
     */
    public function import(string $csvContent, int $vendorId): array
    {
        $results = [
            'imported' => 0,
            'skipped' => 0,
            'errors' => [],
        ];

        $rows = str_getcsv($csvContent, "\n");

        // @phpstan-ignore-next-line
        if (empty($rows)) {
            throw new \Exception('CSV file is empty');
        }

        $headers = str_getcsv(array_shift($rows));
        $this->validateHeaders($headers);

        foreach ($rows as $i => $row) {
            $rowNumber = $i + 2; // +2 because array is 0-indexed and we removed headers

            if (empty(trim($row))) {
                continue;
            }

            try {
                $data = array_combine($headers, str_getcsv($row));
                // @phpstan-ignore-next-line
                if (! $data) {
                    throw new \Exception('Failed to parse CSV row');
                }

                $this->importProduct($data, $vendorId);
                $results['imported']++;
            } catch (\Exception $e) {
                $results['errors'][] = "Row {$rowNumber}: ".$e->getMessage();
                $results['skipped']++;
            }
        }

        return $results;
    }

    /**
     * Validate CSV headers
     *
     * @param  array<string>  $headers
     */
    private function validateHeaders(array $headers): void
    {
        $requiredHeaders = [
            'asin',
            'sku',
            'title',
            'brand',
            'category',
            'condition',
            'original_price',
            'listing_price',
            'quantity',
        ];

        $missingHeaders = array_diff($requiredHeaders, $headers);

        if (! empty($missingHeaders)) {
            throw new \Exception('Missing required CSV headers: '.implode(', ', $missingHeaders));
        }
    }

    /**
     * Import a single product
     *
     * @param  array<string, string>  $data
     */
    private function importProduct(array $data, int $vendorId): void
    {
        // Check if product already exists
        if (Product::where('asin', $data['asin'])->where('vendor_id', $vendorId)->exists()) {
            throw new \Exception("Product with ASIN {$data['asin']} already exists");
        }

        // Validate the data
        $validator = Validator::make($data, [
            'asin' => 'required|string|max:20',
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
        ]);

        if ($validator->fails()) {
            throw new \Exception('Validation failed: '.$validator->errors()->first());
        }

        // Prepare product data
        $productData = [
            'vendor_id' => $vendorId,
            'asin' => $data['asin'],
            'sku' => $data['sku'],
            'title' => $data['title'],
            'brand' => $data['brand'],
            'category' => $data['category'],
            'condition' => $data['condition'],
            'original_price' => (float) $data['original_price'],
            'listing_price' => (float) $data['listing_price'],
            'quantity' => (int) $data['quantity'],
            'description' => $data['description'] ?? null,
            'weight' => isset($data['weight']) ? (float) $data['weight'] : null,
            'status' => 'pending',
            'csv_data' => $data, // Store original CSV data
        ];

        // Handle optional fields
        if (isset($data['images'])) {
            $images = array_filter(explode('|', $data['images']));
            $productData['images'] = $images;
        }

        if (isset($data['dimensions_length'], $data['dimensions_width'], $data['dimensions_height'])) {
            $productData['dimensions'] = [
                'length' => (float) $data['dimensions_length'],
                'width' => (float) $data['dimensions_width'],
                'height' => (float) $data['dimensions_height'],
            ];
        }

        Product::create($productData);
    }

    /**
     * Get CSV template headers
     *
     * @return array<string>
     */
    public function getTemplateHeaders(): array
    {
        return [
            'asin',
            'sku',
            'title',
            'brand',
            'category',
            'condition',
            'original_price',
            'listing_price',
            'quantity',
            'description',
            'weight',
            'images',
            'dimensions_length',
            'dimensions_width',
            'dimensions_height',
        ];
    }

    /**
     * Generate CSV template
     */
    public function generateTemplate(): string
    {
        $headers = $this->getTemplateHeaders();
        $sampleData = [
            'B08N5WRWNW',
            'SAMPLE-SKU-001',
            'Amazon Echo Dot (4th Gen) - Smart speaker with Alexa',
            'Amazon',
            'Electronics',
            'like_new',
            '49.99',
            '39.99',
            '5',
            'Compact smart speaker with improved sound quality',
            '0.34',
            'https://example.com/image1.jpg|https://example.com/image2.jpg',
            '3.9',
            '3.9',
            '3.5',
        ];

        $csv = implode(',', $headers)."\n";
        $csv .= implode(',', array_map(function ($value) {
            return '"'.str_replace('"', '""', $value).'"';
        }, $sampleData))."\n";

        return $csv;
    }
}
