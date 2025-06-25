<?php

namespace App\Modules\RBAC\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\RBAC\Requests\StoreRoleRequest;
use App\Modules\RBAC\Requests\UpdateRoleRequest;
use App\Modules\RBAC\Resources\RoleResource;
use App\Permission;
use App\Role;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class RoleController extends Controller implements HasMiddleware
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
     * Display a listing of roles.
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Role::with('permissions');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $roles = $query->orderBy('level', 'desc')
            ->paginate(15);

        return Inertia::render('modules/rbac/pages/roles/index', [
            'roles' => RoleResource::collection($roles),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new role.
     * @return \Inertia\Response
     */
    public function create()
    {
        $permissions = Permission::active()
            ->orderBy('category')
            ->orderBy('name')
            ->get()
            ->groupBy('category');

        return Inertia::render('modules/rbac/pages/roles/create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created role.
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreRoleRequest $request)
    {
        $role = Role::create($request->validated());

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return redirect()
            ->route('rbac.roles.index')
            ->with('success', 'Role created successfully.');
    }

    /**
     * Display the specified role.
     * @return \Inertia\Response
     */
    public function show(Role $role)
    {
        $role->load('permissions', 'users');

        return Inertia::render('modules/rbac/pages/roles/show', [
            'role' => new RoleResource($role),
        ]);
    }

    /**
     * Show the form for editing the specified role.
     * @return \Inertia\Response
     */
    public function edit(Role $role)
    {
        $role->load('permissions');

        $permissions = Permission::active()
            ->orderBy('category')
            ->orderBy('name')
            ->get()
            ->groupBy('category');

        return Inertia::render('modules/rbac/pages/roles/edit', [
            'role' => new RoleResource($role),
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified role.
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        $role->update($request->validated());

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return redirect()
            ->route('rbac.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified role.
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Role $role)
    {
        // Prevent deletion of superadmin role
        if ($role->isSuperAdmin()) {
            return back()->withErrors(['error' => 'Cannot delete the superadmin role.']);
        }

        // Check if role has users
        if ($role->users()->count() > 0) {
            return back()->withErrors(['error' => 'Cannot delete role that has assigned users.']);
        }

        $role->delete();

        return redirect()
            ->route('rbac.roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}
