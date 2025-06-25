<?php

use App\Modules\Products\Controllers\BatchController;
use App\Modules\Products\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// Products routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Product routes
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');
    Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::patch('products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // CSV upload routes
    Route::post('products/upload-csv', [ProductController::class, 'uploadCsv'])->name('products.upload-csv');
    Route::get('products/for-batch', [ProductController::class, 'forBatch'])->name('products.for-batch');

    // Product quality management (admin only)
    Route::patch('products/{product}/quality', [ProductController::class, 'updateQuality'])->name('products.update-quality');

    // Batch routes
    Route::get('batches', [BatchController::class, 'index'])->name('batches.index');
    Route::get('batches/create', [BatchController::class, 'create'])->name('batches.create');
    Route::post('batches', [BatchController::class, 'store'])->name('batches.store');
    Route::get('batches/{batch}', [BatchController::class, 'show'])->name('batches.show');
    Route::delete('batches/{batch}', [BatchController::class, 'destroy'])->name('batches.destroy');

    // Batch management
    Route::patch('batches/{batch}/send-for-review', [BatchController::class, 'sendForReview'])->name('batches.send-for-review');
    Route::patch('batches/{batch}/review', [BatchController::class, 'review'])->name('batches.review');
});
