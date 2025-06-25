<?php

namespace App\Http\Controllers;

use App\Vendor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Vendor::query()->with(['users']);

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('company_email', 'like', "%{$search}%")
                  ->orWhere('contact_person', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $vendors = $query->paginate(15)->withQueryString();

        // Add stats to each vendor
        $vendors->getCollection()->transform(function ($vendor) {
            $vendor->stats = $vendor->stats;
            return $vendor;
        });

        // Overall stats
        $stats = [
            'total' => Vendor::count(),
            'active' => Vendor::where('status', 'active')->count(),
            'inactive' => Vendor::where('status', 'inactive')->count(),
            'pending' => Vendor::where('status', 'pending')->count(),
        ];

        return Inertia::render('modules/vendors/pages/index', [
            'vendors' => $vendors,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('modules/vendors/pages/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_email' => 'required|email|unique:vendors,company_email',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'registration_number' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive,pending',
            'description' => 'nullable|string',
        ]);

        $vendor = Vendor::create($validated);

        return redirect()->route('vendors.show', $vendor)
            ->with('success', 'Vendor created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Vendor $vendor)
    {
        $vendor->load(['users.role', 'batches.products']);

        // Get recent batches with products count
        $recentBatches = $vendor->batches()
            ->with(['user', 'products'])
            ->withCount('products')
            ->latest()
            ->limit(10)
            ->get();

        // Get vendor statistics
        $stats = [
            'users' => $vendor->users()->count(),
            'products' => $vendor->products()->count(),
            'batches' => [
                'total' => $vendor->batches()->count(),
                'draft' => $vendor->batches()->where('status', 'draft')->count(),
                'sent_for_review' => $vendor->batches()->where('status', 'sent_for_review')->count(),
                'reviewed' => $vendor->batches()->where('status', 'reviewed')->count(),
                'approved' => $vendor->batches()->where('status', 'approved')->count(),
                'rejected' => $vendor->batches()->where('status', 'rejected')->count(),
            ],
        ];

        return Inertia::render('modules/vendors/pages/show', [
            'vendor' => $vendor,
            'recentBatches' => $recentBatches,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vendor $vendor)
    {
        return Inertia::render('modules/vendors/pages/edit', [
            'vendor' => $vendor,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vendor $vendor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_email' => 'required|email|unique:vendors,company_email,' . $vendor->id,
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'registration_number' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive,pending',
            'description' => 'nullable|string',
        ]);

        $vendor->update($validated);

        return redirect()->route('vendors.show', $vendor)
            ->with('success', 'Vendor updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vendor $vendor)
    {
        // Check if vendor has users
        if ($vendor->users()->exists()) {
            return back()->withErrors(['vendor' => 'Cannot delete vendor with assigned users.']);
        }

        $vendor->delete();

        return redirect()->route('vendors.index')
            ->with('success', 'Vendor deleted successfully.');
    }
}
