<?php

namespace App\Modules\Products;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class ProductsServiceProvider extends ServiceProvider
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
        // Load routes with web middleware group
        Route::middleware('web')
            ->group(__DIR__ . '/routes.php');
    }
}
