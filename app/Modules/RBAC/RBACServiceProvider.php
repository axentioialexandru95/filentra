<?php

namespace App\Modules\RBAC;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class RBACServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register module services here
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Load routes with middleware
        Route::middleware(['web'])
            ->prefix('rbac')
            ->name('rbac.')
            ->group(__DIR__ . '/routes.php');

        // Load views if needed
        // $this->loadViewsFrom(__DIR__ . '/modules/rbac/views', 'rbac');

        // Publish assets if needed
        // $this->publishes([
        //     __DIR__ . '/assets' => public_path('modules/rbac'),
        // ], 'rbac-assets');
    }
}
