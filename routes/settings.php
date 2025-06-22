<?php

use App\Modules\Settings\Controllers\PasswordController;
use App\Modules\Settings\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Settings routes for main domain (non-tenant)
Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('modules/settings/pages/appearance');
    })->name('appearance');
});

// Settings routes for tenant context
Route::middleware('auth')->prefix('{tenant}')->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('tenant.profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('tenant.profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('tenant.profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('tenant.password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('tenant.password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('modules/settings/pages/appearance');
    })->name('tenant.appearance');
});
