<?php

use App\Http\Controllers\Modules\Waitlist\Controllers\WaitlistController;
use Illuminate\Support\Facades\Route;

// Public waitlist signup
Route::post('/waitlist', [WaitlistController::class, 'store'])->name('waitlist.store');

// Protected waitlist management routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/waitlist', [WaitlistController::class, 'index'])->name('waitlist.index');
    Route::get('/waitlist/export', [WaitlistController::class, 'exportCsv'])->name('waitlist.export');
    Route::get('/waitlist/stats', [WaitlistController::class, 'stats'])->name('waitlist.stats');
});
