<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\InventoryTransactionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SupplierController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/dashboard/stats', [ProductController::class, 'dashboardStats']);

    Route::apiResource('products', ProductController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('suppliers', SupplierController::class);
    
    Route::get('/transactions', [InventoryTransactionController::class, 'index']);
    Route::post('/transactions', [InventoryTransactionController::class, 'store']);
    Route::get('/reports/category-valuation', [ReportsController::class, 'inventoryByCategory']);
    Route::get('/reports/low-stock', [ReportsController::class, 'lowStockReport']);
});
