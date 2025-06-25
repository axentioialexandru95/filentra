<?php

namespace App\Modules\Settings;

use Illuminate\Support\ServiceProvider;

class SettingsServiceProvider extends ServiceProvider
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
        // Load routes from module
        $this->loadRoutesFrom(__DIR__.'/routes.php');

        // Load views if needed
        // $this->loadViewsFrom(__DIR__ . '/views', 'settings');

        // Publish assets if needed
        // $this->publishes([
        //     __DIR__ . '/assets' => public_path('modules/settings'),
        // ], 'settings-assets');
    }
}
