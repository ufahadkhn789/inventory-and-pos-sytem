<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportsController extends Controller
{
    public function inventoryByCategory()
    {
        $report = Category::withCount('products')
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'product_count' => $category->products_count,
                    'total_value' => (float) Product::where('category_id', $category->id)
                        ->selectRaw('SUM(stock_quantity * purchase_price) as total')
                        ->value('total') ?? 0
                ];
            });

        return response()->json($report);
    }

    public function lowStockReport()
    {
        return Product::with('category')
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->get();
    }
}
