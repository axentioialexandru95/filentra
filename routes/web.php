<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes (no tenant required)
Route::get('/', function () {
    return Inertia::render('modules/dashboard/pages/welcome');
})->name('home');

// Auth routes (no tenant required)
require __DIR__ . '/auth.php';

// Authenticated routes with tenant context
Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('modules/dashboard/pages/dashboard');
    })->name('dashboard');
    
    // Users routes
    Route::get('users', [\App\Modules\Users\Controllers\UserController::class, 'index'])->name('users.index');
    Route::get('users/create', [\App\Modules\Users\Controllers\UserController::class, 'create'])->name('users.create');
    Route::post('users', [\App\Modules\Users\Controllers\UserController::class, 'store'])->name('users.store');
    Route::get('users/{user}', [\App\Modules\Users\Controllers\UserController::class, 'show'])->name('users.show');
    Route::get('users/{user}/edit', [\App\Modules\Users\Controllers\UserController::class, 'edit'])->name('users.edit');
    Route::patch('users/{user}', [\App\Modules\Users\Controllers\UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [\App\Modules\Users\Controllers\UserController::class, 'destroy'])->name('users.destroy');
    
    // Settings routes
    Route::redirect('settings', 'settings/profile');
    Route::get('settings/profile', [\App\Modules\Settings\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [\App\Modules\Settings\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [\App\Modules\Settings\Controllers\ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('settings/password', [\App\Modules\Settings\Controllers\PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [\App\Modules\Settings\Controllers\PasswordController::class, 'update'])->name('password.update');
    Route::get('settings/appearance', function () {
        return Inertia::render('modules/settings/pages/appearance');
    })->name('appearance');
});
