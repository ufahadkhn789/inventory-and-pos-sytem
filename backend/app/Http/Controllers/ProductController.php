<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductController extends Controller
{
    public function index()
    {
        return Product::with(['category', 'supplier'])->latest()->paginate(10);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'low_stock_threshold' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return $product->load(['category', 'supplier', 'transactions.user']);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'sku' => 'sometimes|string|unique:products,sku,' . $product->id,
            'category_id' => 'sometimes|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'purchase_price' => 'sometimes|numeric|min:0',
            'selling_price' => 'sometimes|numeric|min:0',
            'stock_quantity' => 'sometimes|integer|min:0',
            'low_stock_threshold' => 'sometimes|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(null, 204);
    }
    
    public function dashboardStats()
    {
        $today = Carbon::today();
        
        return response()->json([
            'total_products' => Product::count(),
            'total_inventory_value' => (float) Product::selectRaw('SUM(stock_quantity * purchase_price) as total')->value('total') ?? 0,
            'potential_revenue' => (float) Product::selectRaw('SUM(stock_quantity * selling_price) as total')->value('total') ?? 0,
            'low_stock_count' => Product::whereColumn('stock_quantity', '<=', 'low_stock_threshold')->count(),
            'total_categories' => Category::count(),
            'total_suppliers' => Supplier::count(),
            'recent_transactions' => InventoryTransaction::with('product')->latest()->take(5)->get(),
            'transactions_today' => InventoryTransaction::whereDate('created_at', $today)->count(),
            'low_stock_items' => Product::whereColumn('stock_quantity', '<=', 'low_stock_threshold')->take(5)->get()
        ]);
    }
}
