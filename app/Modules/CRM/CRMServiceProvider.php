<?php

namespace App\Modules\CRM;

use Illuminate\Support\ServiceProvider;

class CRMServiceProvider extends ServiceProvider
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
        // Load routes
        $this->loadRoutesFrom(__DIR__ . '/routes.php');

        // Load views if needed
        // $this->loadViewsFrom(__DIR__ . '/views', 'crm');

        // Publish assets if needed
        // $this->publishes([
        //     __DIR__ . '/assets' => public_path('modules/crm'),
        // ], 'crm-assets');
    }
}