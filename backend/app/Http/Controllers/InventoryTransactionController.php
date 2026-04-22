<?php

namespace App\Http\Controllers;

use App\Models\InventoryTransaction;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryTransactionController extends Controller
{
    public function index()
    {
        return InventoryTransaction::with(['product', 'user'])->latest()->paginate(20);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:in,out',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string',
        ]);

        return DB::transaction(function () use ($request) {
            $product = Product::findOrFail($request->product_id);
            
            if ($request->type === 'out' && $product->stock_quantity < $request->quantity) {
                return response()->json([
                    'message' => 'Insufficient stock. Current stock: ' . $product->stock_quantity
                ], 422);
            }

            $transaction = InventoryTransaction::create([
                'product_id' => $request->product_id,
                'user_id' => $request->user()->id,
                'type' => $request->type,
                'quantity' => $request->quantity,
                'reason' => $request->reason,
                'transaction_date' => now(),
            ]);

            // Update product stock
            if ($request->type === 'in') {
                $product->increment('stock_quantity', $request->quantity);
            } else {
                $product->decrement('stock_quantity', $request->quantity);
            }

            return response()->json([
                'message' => 'Transaction recorded successfully',
                'transaction' => $transaction->load('product'),
                'current_stock' => $product->stock_quantity
            ]);
        });
    }
}
