<?php

namespace App\Http\Controllers\Modules\Tenants\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Tenants\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantController extends Controller
{
    /**
     * Display a listing of the tenants.
     */
    public function index()
    {
        $tenants = Tenant::withCount('users')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('modules/tenants/pages/index', [
            'tenants' => $tenants,
            'stats' => [
                'total' => Tenant::count(),
                'active' => Tenant::where('status', 'active')->count(),
                'inactive' => Tenant::where('status', 'inactive')->count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new tenant.
     */
    public function create()
    {
        return Inertia::render('modules/tenants/pages/create');
    }

    /**
     * Store a newly created tenant in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subdomain' => 'required|string|max:63|unique:tenants,subdomain|regex:/^[a-z0-9-]+$/',
            'status' => 'in:active,inactive',
        ]);

        $tenant = Tenant::create([
            'name' => $request->name,
            'subdomain' => $request->subdomain,
            'status' => $request->status ?? 'active',
        ]);

        return redirect()->route('tenants.index')
            ->with('success', 'Tenant created successfully.');
    }

    /**
     * Display the specified tenant.
     */
    public function show(Tenant $tenant)
    {
        $tenant->load(['users' => function ($query) {
            $query->with('role')->latest();
        }]);

        return Inertia::render('modules/tenants/pages/show', [
            'tenant' => $tenant,
            'users' => $tenant->users,
            'stats' => [
                'total_users' => $tenant->users_count ?? $tenant->users()->count(),
                'verified_users' => $tenant->users()->whereNotNull('email_verified_at')->count(),
                'recent_users' => $tenant->users()->where('created_at', '>=', now()->subDays(7))->count(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified tenant.
     */
    public function edit(Tenant $tenant)
    {
        return Inertia::render('modules/tenants/pages/edit', [
            'tenant' => $tenant,
        ]);
    }

    /**
     * Update the specified tenant in storage.
     */
    public function update(Request $request, Tenant $tenant)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subdomain' => 'required|string|max:63|unique:tenants,subdomain,' . $tenant->id . '|regex:/^[a-z0-9-]+$/',
            'status' => 'in:active,inactive',
        ]);

        $tenant->update([
            'name' => $request->name,
            'subdomain' => $request->subdomain,
            'status' => $request->status ?? 'active',
        ]);

        return redirect()->route('tenants.index')
            ->with('success', 'Tenant updated successfully.');
    }

    /**
     * Remove the specified tenant from storage.
     */
    public function destroy(Tenant $tenant)
    {
        // Prevent deletion if tenant has users
        if ($tenant->users()->count() > 0) {
            return back()->with('error', 'Cannot delete tenant with existing users. Please reassign or delete users first.');
        }

        $tenant->delete();

        return redirect()->route('tenants.index')
            ->with('success', 'Tenant deleted successfully.');
    }

    /**
     * Toggle tenant active status
     */
    public function toggleStatus(Tenant $tenant)
    {
        $newStatus = $tenant->status === 'active' ? 'inactive' : 'active';
        $tenant->update(['status' => $newStatus]);

        $action = $newStatus === 'active' ? 'activated' : 'deactivated';

        return back()->with('success', "Tenant {$action} successfully.");
    }
}
