<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index() { return Supplier::all(); }
    public function store(Request $request) {
        $v = $request->validate([
            'name' => 'required|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string'
        ]);
        return Supplier::create($v);
    }
    public function show(Supplier $supplier) { return $supplier; }
    public function update(Request $request, Supplier $supplier) {
        $v = $request->validate([
            'name' => 'sometimes|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string'
        ]);
        $supplier->update($v);
        return $supplier;
    }
    public function destroy(Supplier $supplier) { $supplier->delete(); return response()->json(null, 204); }
}
