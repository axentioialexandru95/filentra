<?php

use App\Modules\RBAC\Controllers\PermissionController;
use App\Modules\RBAC\Controllers\RoleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| RBAC Module Routes
|--------------------------------------------------------------------------
|
| These routes handle role-based access control management including
| roles and permissions. All routes require authentication and
| appropriate permissions.
|
*/

// Role Management Routes
Route::resource('roles', RoleController::class);

// Permission Management Routes
Route::resource('permissions', PermissionController::class);
