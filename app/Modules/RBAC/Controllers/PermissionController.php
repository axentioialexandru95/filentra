<?php

namespace App\Modules\RBAC\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\RBAC\Requests\StorePermissionRequest;
use App\Modules\RBAC\Requests\UpdatePermissionRequest;
use App\Modules\RBAC\Resources\PermissionResource;
use App\Permission;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            'auth',
            new Middleware('permission:view_roles', only: ['index', 'show']),
            new Middleware('permission:manage_roles', only: ['create', 'store', 'edit', 'update', 'destroy']),
        ];
    }

    /**
     * Display a listing of permissions.
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Permission::with('roles');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $permissions = $query->orderBy('category')
            ->orderBy('name')
            ->paginate(15);

        $categories = Permission::distinct()->pluck('category')->filter()->sort()->values();

        return Inertia::render('modules/rbac/pages/permissions/index', [
            'permissions' => PermissionResource::collection($permissions),
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new permission.
     */
    public function create(): Response
    {
        $categories = Permission::distinct()->pluck('category')->filter()->sort()->values();

        return Inertia::render('modules/rbac/pages/permissions/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created permission.
     */
    public function store(StorePermissionRequest $request): RedirectResponse
    {
        Permission::create($request->validated());

        return redirect()
            ->route('rbac.permissions.index')
            ->with('success', 'Permission created successfully.');
    }

    /**
     * Display the specified permission.
     */
    public function show(Permission $permission): Response
    {
        $permission->load('roles');

        return Inertia::render('modules/rbac/pages/permissions/show', [
            'permission' => new PermissionResource($permission),
        ]);
    }

    /**
     * Show the form for editing the specified permission.
     */
    public function edit(Permission $permission): Response
    {
        $categories = Permission::distinct()->pluck('category')->filter()->sort()->values();

        return Inertia::render('modules/rbac/pages/permissions/edit', [
            'permission' => new PermissionResource($permission),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified permission.
     */
    public function update(UpdatePermissionRequest $request, Permission $permission): RedirectResponse
    {
        $permission->update($request->validated());

        return redirect()
            ->route('rbac.permissions.index')
            ->with('success', 'Permission updated successfully.');
    }

    /**
     * Remove the specified permission.
     */
    public function destroy(Permission $permission): RedirectResponse
    {
        // Check if permission is assigned to any role
        if ($permission->roles()->count() > 0) {
            return back()->withErrors(['error' => 'Cannot delete permission that is assigned to roles.']);
        }

        $permission->delete();

        return redirect()
            ->route('rbac.permissions.index')
            ->with('success', 'Permission deleted successfully.');
    }
}
