<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('modules/dashboard/pages/welcome');
})->name('home');

// Auth routes
require __DIR__.'/auth.php';

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
});

// Superadmin only routes
Route::middleware(['auth', 'verified', 'role:superadmin'])->group(function () {
    // Analytics Dashboard
    Route::get('analytics', [\App\Http\Controllers\AnalyticsController::class, 'dashboard'])->name('analytics.dashboard');
});

// Impersonation routes (permission-based)
Route::middleware(['auth', 'verified', 'permission:impersonate_users'])->group(function () {
    Route::post('impersonate/{user}', [\App\Http\Controllers\ImpersonationController::class, 'start'])->name('impersonate.start');
    Route::post('impersonate/stop', [\App\Http\Controllers\ImpersonationController::class, 'stop'])->name('impersonate.stop');
    Route::get('impersonate/status', [\App\Http\Controllers\ImpersonationController::class, 'status'])->name('impersonate.status');
});
