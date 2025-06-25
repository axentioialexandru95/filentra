<?php

namespace App\Modules\Products\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Products\Models\Product;
use App\Modules\Products\Requests\StoreProductRequest;
use App\Modules\Products\Requests\UpdateProductRequest;
use App\Modules\Products\Requests\UploadCsvRequest;
use App\Modules\Products\Resources\ProductResource;
use App\Modules\Products\Services\CsvImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();

        $query = Product::with(['vendor', 'batch', 'verifier']);

        // Filter by vendor if not admin
        if (! $user->hasRole('admin') && ! $user->isSuperAdmin()) {
            $query->forVendor($user->id);
        }

        // Apply filters
        $query->when($request->search, function ($q, $search) {
            $q->where(function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('asin', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%");
            });
        })
            ->when($request->status, fn ($q, $status) => $q->byStatus($status))
            ->when($request->quality, fn ($q, $quality) => $q->byQuality($quality))
            ->when($request->vendor_id && ($user->hasRole('admin') || $user->isSuperAdmin()), fn ($q, $vendorId) => $q->forVendor((int) $vendorId));

        $products = $query->latest()->paginate(15);

        $stats = [
            'total' => $query->count(),
            'pending' => Product::byStatus('pending')->count(),
            'verified' => Product::byStatus('verified')->count(),
            'sent_for_review' => Product::byStatus('sent_for_review')->count(),
        ];

        return Inertia::render('modules/products/pages/index', [
            'data' => $products,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'quality', 'vendor_id']),
            'can_upload_csv' => $user->hasRole('vendor'),
            'can_manage_quality' => $user->hasRole('admin') || $user->isSuperAdmin(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('modules/products/pages/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['vendor_id'] = Auth::id();
        $data['status'] = 'pending';

        $product = Product::create($data);

        return redirect()->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): Response
    {
        $this->authorizeProductAccess($product);

        return Inertia::render('modules/products/pages/show', [
            'product' => new ProductResource($product->load(['vendor', 'batch', 'verifier'])),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product): Response
    {
        $this->authorizeProductAccess($product);

        return Inertia::render('modules/products/pages/edit', [
            'product' => new ProductResource($product->load(['vendor', 'batch', 'verifier'])),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $this->authorizeProductAccess($product);

        $product->update($request->validated());

        return redirect()->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $this->authorizeProductAccess($product);

        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }

    /**
     * Upload CSV file with products
     */
    public function uploadCsv(UploadCsvRequest $request, CsvImportService $csvImportService): RedirectResponse
    {
        try {
            $result = $csvImportService->import($request->file('csv_file'), Auth::id());

            return redirect()->route('products.index')
                ->with('success', "CSV imported successfully. {$result['imported']} products imported, {$result['skipped']} skipped.");
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error importing CSV: ' . $e->getMessage());
        }
    }

    /**
     * Update product quality rating (admin only)
     */
    public function updateQuality(Request $request, Product $product): JsonResponse
    {
        $user = Auth::user();

        if (! $user->hasRole('admin') && ! $user->isSuperAdmin()) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'quality_rating' => 'required|in:A,B,C',
            'notes' => 'nullable|string|max:1000',
        ]);

        $product->update([
            'quality_rating' => $request->quality_rating,
            'notes' => $request->notes,
            'verified_at' => now(),
            'verified_by' => $user->id,
            'status' => 'verified',
        ]);

        return response()->json([
            'message' => 'Product quality updated successfully',
            'product' => new ProductResource($product->load(['vendor', 'batch', 'verifier'])),
        ]);
    }

    /**
     * Get products for batch creation
     */
    public function forBatch(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (! $user->hasRole('vendor')) {
            abort(403, 'Unauthorized');
        }

        $products = Product::forVendor($user->id)
            ->where('status', 'pending')
            ->whereNull('batch_id')
            ->when($request->search, function ($q, $search) {
                $q->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('asin', 'like', "%{$search}%");
                });
            })
            ->paginate(10);

        return response()->json($products);
    }

    /**
     * Authorize product access based on user role
     */
    private function authorizeProductAccess(Product $product): void
    {
        $user = Auth::user();

        if ($user->hasRole('admin') || $user->isSuperAdmin()) {
            return;
        }

        if ($user->hasRole('vendor') && $product->vendor_id === $user->id) {
            return;
        }

        abort(403, 'Unauthorized to access this product.');
    }
}
