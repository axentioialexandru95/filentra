<?php

namespace App\Http\Controllers;

use App\Modules\Users\Models\User;
use App\Role;
use App\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    /**
     * Show analytics dashboard
     */
    public function dashboard(): Response
    {
        $analytics = [
            'users' => $this->getUserAnalytics(),
            'roles' => $this->getRoleAnalytics(),
            'permissions' => $this->getPermissionAnalytics(),
            'distribution' => $this->getDistributionAnalytics(),
            'growth' => $this->getGrowthAnalytics(),
        ];

        return Inertia::render('modules/dashboard/pages/analytics', [
            'analytics' => $analytics,
        ]);
    }

    private function getUserAnalytics(): array
    {
        return [
            'total' => User::count(),
            'verified' => User::whereNotNull('email_verified_at')->count(),
            'unverified' => User::whereNull('email_verified_at')->count(),
            'recent' => User::where('created_at', '>=', now()->subDays(7))->count(),
            'active_today' => User::where('updated_at', '>=', now()->subDay())->count(),
        ];
    }

    private function getRoleAnalytics(): array
    {
        return [
            'total' => Role::count(),
            'with_users' => Role::has('users')->count(),
            'without_users' => Role::doesntHave('users')->count(),
            'most_assigned' => Role::withCount('users')
                ->orderBy('users_count', 'desc')
                ->first()?->name ?? 'None',
        ];
    }

    private function getPermissionAnalytics(): array
    {
        return [
            'total' => Permission::count(),
            'assigned' => Permission::has('roles')->count(),
            'unassigned' => Permission::doesntHave('roles')->count(),
            'categories' => Permission::distinct('category')->count('category'),
        ];
    }

    private function getDistributionAnalytics(): array
    {
        $roleDistribution = Role::withCount('users')
            ->orderBy('users_count', 'desc')
            ->get()
            ->map(function ($role) {
                return [
                    'role' => $role->name,
                    'users' => $role->users_count,
                    'percentage' => User::count() > 0 ? round(($role->users_count / User::count()) * 100, 1) : 0,
                ];
            });

        $permissionsByCategory = Permission::select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category,
                    'permissions' => $item->count,
                ];
            });

        return [
            'roles' => $roleDistribution,
            'permissions_by_category' => $permissionsByCategory,
        ];
    }

    private function getGrowthAnalytics(): array
    {
        $userGrowth = User::select(
            DB::raw('TO_CHAR(created_at, \'YYYY-MM\') as month'),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'count' => $item->count,
                ];
            });

        $roleAssignments = DB::table('users')
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->select(
                DB::raw('TO_CHAR(users.created_at, \'YYYY-MM\') as month'),
                'roles.name as role',
                DB::raw('COUNT(*) as count')
            )
            ->where('users.created_at', '>=', now()->subMonths(6))
            ->groupBy('month', 'roles.name')
            ->orderBy('month')
            ->get()
            ->groupBy('month')
            ->map(function ($monthData, $month) {
                return [
                    'month' => $month,
                    'roles' => $monthData->map(function ($item) {
                        return [
                            'role' => $item->role,
                            'count' => $item->count,
                        ];
                    })->toArray(),
                ];
            })
            ->values();

        return [
            'users_by_month' => $userGrowth,
            'role_assignments_by_month' => $roleAssignments,
        ];
    }
}
