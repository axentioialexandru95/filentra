<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RBACAccessMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        $accessConfig = config('rbac.access');

        // Check if user is super admin
        $isSuperAdmin = $user->role?->slug === $accessConfig['super_admin_role'];

        // Check if user has any required permission
        $hasRequiredPermission = false;
        foreach ($accessConfig['required_permissions'] as $permission) {
            if ($user->hasPermission($permission)) {
                $hasRequiredPermission = true;
                break;
            }
        }

        if (!$isSuperAdmin && !$hasRequiredPermission) {
            abort(403, 'Insufficient permissions to access RBAC management.');
        }

        return $next($request);
    }
} 
