<?php

namespace App\Http\Middleware;

use App\Modules\Tenants\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenantMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = $this->resolveTenantFromUser($request);

        if ($tenant) {
            // Set tenant in application container
            app()->instance('current_tenant', $tenant);
            app()->instance('current_tenant_id', $tenant->id);

            // Set tenant context for the request
            $request->attributes->set('tenant', $tenant);

            // Check if tenant is active
            if (!$tenant->isActive()) {
                abort(403, 'Tenant is inactive.');
            }

            // Share tenant data with Inertia for frontend use
            if (class_exists(\Inertia\Inertia::class)) {
                \Inertia\Inertia::share('tenant', [
                    'id' => $tenant->id,
                    'name' => $tenant->name,
                    'subdomain' => $tenant->subdomain,
                ]);
            }
        } else {
            // No tenant context
            app()->instance('current_tenant', null);
            app()->instance('current_tenant_id', null);

            // Share empty tenant data with Inertia
            if (class_exists(\Inertia\Inertia::class)) {
                \Inertia\Inertia::share('tenant', null);
            }
        }

        return $next($request);
    }

    /**
     * Resolve tenant from the authenticated user.
     */
    protected function resolveTenantFromUser(Request $request): ?Tenant
    {
        // Only resolve tenant for authenticated users
        if (!$request->user()) {
            return null;
        }

        // Get tenant from user's tenant_id
        $tenantId = $request->user()->tenant_id;

        if (!$tenantId) {
            return null;
        }

        return Tenant::find($tenantId);
    }
}
