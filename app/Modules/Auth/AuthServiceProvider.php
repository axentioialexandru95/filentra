<?php

namespace App\Modules\Auth;

use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
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
        // $this->loadViewsFrom(__DIR__ . '/views', 'auth');

        // Publish assets if needed
        // $this->publishes([
        //     __DIR__ . '/assets' => public_path('modules/auth'),
        // ], 'auth-assets');
    }
}
