<?php

namespace App\Http\Controllers;

use App\Modules\Products\Models\Product;
use App\Modules\Products\Models\ProductBatch;
use App\Modules\Users\Models\User;
use App\Permission;
use App\Role;
use App\Vendor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the dashboard for superadmins with comprehensive platform analytics
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Show vendor dashboard for vendors
        if ($user->hasRole('vendor')) {
            $vendorAnalytics = $this->getVendorDashboardAnalytics($user);
            return Inertia::render('modules/dashboard/pages/dashboard', $vendorAnalytics);
        }

        // If not superadmin, show simple dashboard
        if (! $user->isSuperAdmin()) {
            return Inertia::render('modules/dashboard/pages/dashboard');
        }

        // Get comprehensive platform analytics for superadmins
        $platformAnalytics = $this->getPlatformAnalytics();
        $vendorAnalytics = $this->getVendorAnalytics();
        $productAnalytics = $this->getProductAnalytics();
        $rbacAnalytics = $this->getRBACAnalytics();
        $recentActivity = $this->getRecentActivity();
        $chartData = $this->getChartData();

        return Inertia::render('modules/dashboard/pages/superadmin-dashboard', [
            'platformAnalytics' => $platformAnalytics,
            'vendorAnalytics' => $vendorAnalytics,
            'productAnalytics' => $productAnalytics,
            'rbacAnalytics' => $rbacAnalytics,
            'recentActivity' => $recentActivity,
            'chartData' => $chartData,
        ]);
    }

    /**
     * Get high-level platform analytics
     */
    private function getPlatformAnalytics(): array
    {
        $totalUsers = User::count();
        $totalVendors = Vendor::count();
        $activeVendors = Vendor::where('status', 'active')->count();
        $totalProducts = Product::count();
        $uniqueProducts = Product::select(DB::raw('COUNT(DISTINCT CONCAT(asin, \'-\', sku)) as unique_count'))
            ->value('unique_count') ?? 0;
        $totalBatches = ProductBatch::count();
        $activeBatches = ProductBatch::whereIn('status', ['draft', 'sent_for_review'])->count();

        return [
            'total_users' => $totalUsers,
            'total_vendors' => $totalVendors,
            'active_vendors' => $activeVendors,
            'total_products' => $totalProducts,
            'unique_products' => $uniqueProducts,
            'total_batches' => $totalBatches,
            'active_batches' => $activeBatches,
            'platform_value' => Product::sum('listing_price') ?? 0,
        ];
    }

    /**
     * Get vendor-specific analytics
     */
    private function getVendorAnalytics(): array
    {
        $topVendors = Vendor::select('vendors.*')
            ->withCount('products')
            ->orderBy('products_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($vendor) {
                return [
                    'id' => $vendor->id,
                    'name' => $vendor->name,
                    'email' => $vendor->company_email,
                    'products_count' => $vendor->products_count,
                    'status' => $vendor->status,
                    'created_at' => $vendor->created_at->format('M j, Y'),
                ];
            });

        $vendorsByStatus = Vendor::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        return [
            'top_vendors' => $topVendors,
            'by_status' => $vendorsByStatus,
            'new_this_month' => Vendor::where('created_at', '>=', now()->startOfMonth())->count(),
            'total_revenue_processed' => (float) (Product::whereHas('vendor')->sum('listing_price') ?? 0),
        ];
    }

    /**
     * Get product and batch analytics
     */
    private function getProductAnalytics(): array
    {
        $productsByStatus = Product::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        $productsByQuality = Product::select('quality_rating', DB::raw('count(*) as count'))
            ->whereNotNull('quality_rating')
            ->groupBy('quality_rating')
            ->get()
            ->pluck('count', 'quality_rating');

        $batchesByStatus = ProductBatch::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        $topCategories = Product::select('category', DB::raw('count(*) as count'))
            ->whereNotNull('category')
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get()
            ->pluck('count', 'category');

        $topBrands = Product::select('brand', DB::raw('count(*) as count'))
            ->whereNotNull('brand')
            ->groupBy('brand')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get()
            ->pluck('count', 'brand');

        return [
            'by_status' => $productsByStatus,
            'by_quality' => $productsByQuality,
            'batches_by_status' => $batchesByStatus,
            'top_categories' => $topCategories,
            'top_brands' => $topBrands,
            'verified_products' => Product::whereNotNull('verified_at')->count(),
            'pending_review' => ProductBatch::where('status', 'sent_for_review')->count(),
            'avg_batch_size' => round(ProductBatch::withCount('products')->get()->avg('products_count') ?? 0, 1),
        ];
    }

    /**
     * Get RBAC analytics
     */
    private function getRBACAnalytics(): array
    {
        $usersByRole = Role::withCount('users')
            ->orderBy('level', 'desc')
            ->get()
            ->map(function ($role) {
                return [
                    'role' => $role->name,
                    'slug' => $role->slug,
                    'users' => $role->users_count,
                    'level' => $role->level,
                    'percentage' => User::count() > 0 ? round(($role->users_count / User::count()) * 100, 1) : 0,
                ];
            });

        return [
            'total_roles' => Role::count(),
            'total_permissions' => Permission::count(),
            'users_by_role' => $usersByRole,
            'roles_with_users' => Role::has('users')->count(),
            'permissions_categories' => Permission::distinct('category')->count('category'),
        ];
    }

    /**
     * Get recent activity data
     */
    private function getRecentActivity(): array
    {
        $recentBatches = ProductBatch::with(['vendor'])
            ->latest()
            ->limit(8)
            ->get()
            ->map(function ($batch) {
                return [
                    'id' => $batch->id,
                    'name' => $batch->name,
                    'vendor_name' => $batch->vendor->name ?? 'Unknown',
                    'status' => $batch->status,
                    'products_count' => $batch->total_products ?? 0,
                    'created_at' => $batch->created_at->format('M j, Y'),
                    'created_at_human' => $batch->created_at->diffForHumans(),
                ];
            });

        $recentVendors = Vendor::latest()
            ->limit(5)
            ->get()
            ->map(function ($vendor) {
                return [
                    'id' => $vendor->id,
                    'name' => $vendor->name,
                    'email' => $vendor->company_email,
                    'status' => $vendor->status,
                    'products_count' => $vendor->products()->count(),
                    'created_at' => $vendor->created_at->format('M j, Y'),
                    'created_at_human' => $vendor->created_at->diffForHumans(),
                ];
            });

        return [
            'recent_batches' => $recentBatches,
            'recent_vendors' => $recentVendors,
        ];
    }

    /**
     * Get chart data for analytics
     */
    private function getChartData(): array
    {
        // Generate all dates for the last 30 days
        $dateRange = collect();
        for ($i = 29; $i >= 0; $i--) {
            $dateRange->push(Carbon::now()->subDays($i)->format('Y-m-d'));
        }

        // Product growth over last 30 days
        $productGrowthData = Product::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $productGrowth = $dateRange->map(function ($date) use ($productGrowthData) {
            return [
                'date' => $date,
                'count' => $productGrowthData->has($date) ? (int) $productGrowthData->get($date)->count : 0,
            ];
        });

        // Batch completion rates over last 30 days
        $batchProgressData = ProductBatch::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as total'),
            DB::raw('COUNT(CASE WHEN status IN (\'approved\', \'reviewed\') THEN 1 END) as completed')
        )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $batchProgress = $dateRange->map(function ($date) use ($batchProgressData) {
            $data = $batchProgressData->get($date);
            $total = $data ? (int) $data->total : 0;
            $completed = $data ? (int) $data->completed : 0;

            return [
                'date' => $date,
                'total' => $total,
                'completed' => $completed,
                'completion_rate' => $total > 0 ? round(($completed / $total) * 100, 1) : 0,
            ];
        });

        // Revenue trends
        $revenueTrendsData = Product::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(listing_price) as revenue'),
            DB::raw('COUNT(*) as products')
        )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $revenueTrends = $dateRange->map(function ($date) use ($revenueTrendsData) {
            $data = $revenueTrendsData->get($date);

            return [
                'date' => $date,
                'revenue' => $data ? (float) ($data->revenue ?? 0) : 0,
                'products' => $data ? (int) $data->products : 0,
            ];
        });

        return [
            'product_growth' => $productGrowth->values()->toArray(),
            'batch_progress' => $batchProgress->values()->toArray(),
            'revenue_trends' => $revenueTrends->values()->toArray(),
        ];
    }

    /**
     * Get vendor-specific analytics for their dashboard
     */
    private function getVendorDashboardAnalytics(User $user): array
    {
        $vendor = $user->vendor;

        if (!$vendor) {
            return $this->getEmptyVendorAnalytics();
        }

        // Basic stats
        $totalProducts = Product::where('vendor_id', $user->id)->count();
        $totalBatches = ProductBatch::where('vendor_id', $user->id)->count();
        $activeBatches = ProductBatch::where('vendor_id', $user->id)->whereIn('status', ['draft', 'sent_for_review'])->count();
        $completedBatches = ProductBatch::where('vendor_id', $user->id)->where('status', 'approved')->count();
        $rejectedBatches = ProductBatch::where('vendor_id', $user->id)->where('status', 'rejected')->count();
        $totalValue = (float) (Product::where('vendor_id', $user->id)->sum('listing_price') ?? 0);
        $averagePrice = $totalProducts > 0 ? (float) (Product::where('vendor_id', $user->id)->avg('listing_price') ?? 0) : 0;

        // Product status breakdown
        $productsByStatus = Product::where('vendor_id', $user->id)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        // Recent products
        $recentProducts = Product::where('vendor_id', $user->id)
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'sku' => $product->sku,
                    'status' => $product->status,
                    'listing_price' => (float) ($product->listing_price ?? 0),
                    'created_at' => $product->created_at->format('M j, Y'),
                    'created_at_human' => $product->created_at->diffForHumans(),
                ];
            });

        // Recent batches
        $recentBatches = ProductBatch::where('vendor_id', $user->id)
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($batch) {
                return [
                    'id' => $batch->id,
                    'name' => $batch->name,
                    'status' => $batch->status,
                    'total_products' => $batch->total_products ?? 0,
                    'created_at' => $batch->created_at->format('M j, Y'),
                    'created_at_human' => $batch->created_at->diffForHumans(),
                ];
            });

        // Chart data for last 30 days
        $chartData = $this->getVendorChartData($user);

        return [
            'vendor' => [
                'id' => $vendor->id,
                'name' => $vendor->name,
                'status' => $vendor->status,
                'company_email' => $vendor->company_email,
            ],
            'stats' => [
                'total_products' => $totalProducts,
                'total_batches' => $totalBatches,
                'active_batches' => $activeBatches,
                'completed_batches' => $completedBatches,
                'rejected_batches' => $rejectedBatches,
                'total_value' => $totalValue,
                'average_price' => $averagePrice,
            ],
            'products_by_status' => $productsByStatus,
            'recent_products' => $recentProducts,
            'recent_batches' => $recentBatches,
            'chart_data' => $chartData,
        ];
    }

    /**
     * Get chart data for vendor dashboard
     */
    private function getVendorChartData(User $user): array
    {
        // Generate all dates for the last 30 days
        $dateRange = collect();
        for ($i = 29; $i >= 0; $i--) {
            $dateRange->push(Carbon::now()->subDays($i)->format('Y-m-d'));
        }

        // Product growth for this vendor over last 30 days
        $productGrowthData = Product::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count')
        )
            ->where('vendor_id', $user->id)
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $productGrowth = $dateRange->map(function ($date) use ($productGrowthData) {
            return [
                'date' => $date,
                'count' => $productGrowthData->has($date) ? (int) $productGrowthData->get($date)->count : 0,
            ];
        });

        // Batch progress for this vendor
        $batchProgressData = ProductBatch::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as total'),
            DB::raw('COUNT(CASE WHEN status IN (\'approved\', \'reviewed\') THEN 1 END) as completed')
        )
            ->where('vendor_id', $user->id)
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $batchProgress = $dateRange->map(function ($date) use ($batchProgressData) {
            $data = $batchProgressData->get($date);
            $total = $data ? (int) $data->total : 0;
            $completed = $data ? (int) $data->completed : 0;

            return [
                'date' => $date,
                'total' => $total,
                'completed' => $completed,
                'completion_rate' => $total > 0 ? round(($completed / $total) * 100, 1) : 0,
            ];
        });

        // Revenue trends for this vendor
        $revenueTrendsData = Product::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(listing_price) as revenue'),
            DB::raw('COUNT(*) as products')
        )
            ->where('vendor_id', $user->id)
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $revenueTrends = $dateRange->map(function ($date) use ($revenueTrendsData) {
            $data = $revenueTrendsData->get($date);

            return [
                'date' => $date,
                'revenue' => $data ? (float) ($data->revenue ?? 0) : 0,
                'products' => $data ? (int) $data->products : 0,
            ];
        });

        return [
            'product_growth' => $productGrowth->values()->toArray(),
            'batch_progress' => $batchProgress->values()->toArray(),
            'revenue_trends' => $revenueTrends->values()->toArray(),
        ];
    }

    /**
     * Get empty analytics for vendors without vendor records
     */
    private function getEmptyVendorAnalytics(): array
    {
        return [
            'vendor' => null,
            'stats' => [
                'total_products' => 0,
                'total_batches' => 0,
                'active_batches' => 0,
                'completed_batches' => 0,
                'rejected_batches' => 0,
                'total_value' => 0,
                'average_price' => 0,
            ],
            'products_by_status' => collect(),
            'recent_products' => collect(),
            'recent_batches' => collect(),
            'chart_data' => [
                'product_growth' => [],
                'batch_progress' => [],
                'revenue_trends' => [],
            ],
        ];
    }
}
