<?php

namespace App\Modules\Users;

use Illuminate\Support\ServiceProvider;

class UsersServiceProvider extends ServiceProvider
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
        // $this->loadViewsFrom(__DIR__ . '/views', 'users');

        // Publish assets if needed
        // $this->publishes([
        //     __DIR__ . '/assets' => public_path('modules/users'),
        // ], 'users-assets');
    }
}
