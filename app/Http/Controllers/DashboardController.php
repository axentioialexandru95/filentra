<?php

namespace App\Http\Controllers;

use App\Modules\Users\Models\User;
use App\Role;
use App\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the dashboard for superadmins with comprehensive analytics and user management
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // If not superadmin, show simple dashboard
        if (!$user->isSuperAdmin()) {
            return Inertia::render('modules/dashboard/pages/dashboard');
        }

        // Get comprehensive dashboard data for superadmins
        $analytics = $this->getAnalytics();
        $recentUsers = $this->getRecentUsers();
        $usersByRole = $this->getUsersByRole();
        $systemHealth = $this->getSystemHealth();

        return Inertia::render('modules/dashboard/pages/superadmin-dashboard', [
            'analytics' => $analytics,
            'recentUsers' => $recentUsers,
            'usersByRole' => $usersByRole,
            'systemHealth' => $systemHealth,
        ]);
    }

    private function getAnalytics(): array
    {
        $totalUsers = User::count();
        $verifiedUsers = User::whereNotNull('email_verified_at')->count();
        $recentUsers = User::where('created_at', '>=', now()->subDays(7))->count();
        $activeToday = User::where('updated_at', '>=', now()->subDay())->count();

        return [
            'users' => [
                'total' => $totalUsers,
                'verified' => $verifiedUsers,
                'unverified' => $totalUsers - $verifiedUsers,
                'recent' => $recentUsers,
                'active_today' => $activeToday,
                'verification_rate' => $totalUsers > 0 ? round(($verifiedUsers / $totalUsers) * 100, 1) : 0,
            ],
            'roles' => [
                'total' => Role::count(),
                'with_users' => Role::has('users')->count(),
                'without_users' => Role::doesntHave('users')->count(),
            ],
            'permissions' => [
                'total' => Permission::count(),
                'assigned' => Permission::has('roles')->count(),
                'categories' => Permission::distinct('category')->count('category'),
            ],
        ];
    }

    private function getRecentUsers(): array
    {
        return User::with('role')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role?->name ?? 'No Role',
                    'role_slug' => $user->role?->slug ?? null,
                    'verified' => $user->email_verified_at ? true : false,
                    'created_at' => $user->created_at->format('M j, Y'),
                    'created_at_human' => $user->created_at->diffForHumans(),
                ];
            })
            ->toArray();
    }

    private function getUsersByRole(): array
    {
        return Role::withCount('users')
            ->orderBy('users_count', 'desc')
            ->get()
            ->map(function ($role) {
                return [
                    'role' => $role->name,
                    'slug' => $role->slug,
                    'users' => $role->users_count,
                    'level' => $role->level,
                    'percentage' => User::count() > 0 ? round(($role->users_count / User::count()) * 100, 1) : 0,
                ];
            })
            ->toArray();
    }

    private function getSystemHealth(): array
    {
        $usersGrowth = User::select(
            DB::raw('TO_CHAR(created_at, \'YYYY-MM-DD\') as date'),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'count' => $item->count,
                ];
            });

        return [
            'users_growth' => $usersGrowth,
            'database_status' => 'healthy',
            'last_updated' => now()->format('M j, Y g:i A'),
        ];
    }
}
