<?php

namespace App\Modules\Products\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Products\Models\Product;
use App\Modules\Products\Models\ProductBatch;
use App\Modules\Products\Requests\StoreBatchRequest;
use App\Modules\Products\Resources\BatchResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BatchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();

        $query = ProductBatch::with(['vendor', 'reviewer', 'products']);

        // Filter by vendor if not admin
        if (! $user->hasRole('admin') && ! $user->isSuperAdmin()) {
            $query->forVendor((int) $user->id);
        }

        // Apply filters
        $query->when($request->search, function ($q, $search) {
            $q->where('name', 'like', "%{$search}%");
        })
            ->when($request->status, fn ($q, $status) => $q->byStatus($status))
            ->when(
                $request->vendor_id && ($user->hasRole('admin') || $user->isSuperAdmin()),
                fn ($q) => $q->forVendor((int) $request->vendor_id)
            );

        $batches = $query->latest()->paginate(15);

        $stats = [
            'total' => $query->count(),
            'draft' => ProductBatch::byStatus('draft')->count(),
            'sent_for_review' => ProductBatch::byStatus('sent_for_review')->count(),
            'reviewed' => ProductBatch::byStatus('reviewed')->count(),
        ];

        return Inertia::render('modules/products/pages/batches/index', [
            'data' => $batches,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'vendor_id']),
            'can_create_batch' => $user->hasRole('vendor'),
            'can_review_batches' => $user->hasRole('admin') || $user->isSuperAdmin(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $user = Auth::user();

        if (! $user->hasRole('vendor')) {
            abort(403, 'Unauthorized');
        }

        // Get available products for this vendor
        $availableProducts = Product::forVendor($user->id)
            ->where('status', 'pending')
            ->whereNull('batch_id')
            ->get();

        return Inertia::render('modules/products/pages/batches/create', [
            'availableProducts' => $availableProducts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBatchRequest $request): RedirectResponse
    {
        $user = Auth::user();

        if (! $user->hasRole('vendor')) {
            abort(403, 'Unauthorized');
        }

        try {
            DB::transaction(function () use ($request, $user) {
                $validatedData = $request->validated();

                $batch = ProductBatch::create([
                    'vendor_id' => $user->id,
                    'name' => $validatedData['name'],
                    'description' => $validatedData['description'] ?? null,
                    'status' => 'draft',
                    'total_products' => count($validatedData['product_ids']),
                ]);

                // Update products to belong to this batch
                Product::whereIn('id', $validatedData['product_ids'])
                    ->where('vendor_id', $user->id)
                    ->where('status', 'pending')
                    ->whereNull('batch_id')
                    ->update([
                        'batch_id' => $batch->id,
                        'status' => 'in_batch',
                    ]);
            });

            return redirect()->route('batches.index')
                ->with('success', 'Batch created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error creating batch: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductBatch $batch): Response
    {
        $this->authorizeBatchAccess($batch);

        $batch->load(['vendor', 'reviewer', 'products.vendor']);

        return Inertia::render('modules/products/pages/batches/show', [
            'batch' => new BatchResource($batch),
        ]);
    }

    /**
     * Send batch for review
     */
    public function sendForReview(ProductBatch $batch): JsonResponse
    {
        $user = Auth::user();

        if (! $user->hasRole('vendor') || $batch->vendor_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        if ($batch->status !== 'draft') {
            return response()->json([
                'error' => 'Only draft batches can be sent for review',
            ], 422);
        }

        $batch->update([
            'status' => 'sent_for_review',
            'sent_for_review_at' => now(),
        ]);

        // Update all products in the batch
        $batch->products()->update(['status' => 'sent_for_review']);

        return response()->json([
            'message' => 'Batch sent for review successfully',
            'batch' => new BatchResource($batch->load(['vendor', 'products'])),
        ]);
    }

    /**
     * Review batch (admin only)
     */
    public function review(Request $request, ProductBatch $batch): JsonResponse
    {
        $user = Auth::user();

        if (! $user->hasRole('admin') && ! $user->isSuperAdmin()) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'status' => 'required|in:approved,rejected',
            'notes' => 'nullable|string|max:1000',
        ]);

        $batch->update([
            'status' => $request->status === 'approved' ? 'approved' : 'rejected',
            'reviewed_at' => now(),
            'reviewed_by' => $user->id,
            'notes' => $request->notes,
        ]);

        // Update products based on batch status
        $productStatus = $request->status === 'approved' ? 'verified' : 'rejected';
        $batch->products()->update(['status' => $productStatus]);

        return response()->json([
            'message' => 'Batch reviewed successfully',
            'batch' => new BatchResource($batch->load(['vendor', 'reviewer', 'products'])),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductBatch $batch): RedirectResponse
    {
        $this->authorizeBatchAccess($batch);

        if ($batch->status !== 'draft') {
            return redirect()->back()
                ->with('error', 'Only draft batches can be deleted.');
        }

        DB::transaction(function () use ($batch) {
            // Reset products status
            $batch->products()->update([
                'batch_id' => null,
                'status' => 'pending',
            ]);

            $batch->delete();
        });

        return redirect()->route('batches.index')
            ->with('success', 'Batch deleted successfully.');
    }

    /**
     * Authorize batch access based on user role
     */
    private function authorizeBatchAccess(ProductBatch $batch): void
    {
        $user = Auth::user();

        if ($user->hasRole('admin') || $user->isSuperAdmin()) {
            return;
        }

        if ($user->hasRole('vendor') && $batch->vendor_id === $user->id) {
            return;
        }

        abort(403, 'Unauthorized to access this batch.');
    }
}
