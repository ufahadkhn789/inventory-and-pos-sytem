<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index() { return Category::all(); }
    public function store(Request $request) {
        $v = $request->validate(['name' => 'required|string', 'description' => 'nullable|string']);
        return Category::create($v);
    }
    public function show(Category $category) { return $category; }
    public function update(Request $request, Category $category) {
        $v = $request->validate(['name' => 'sometimes|string', 'description' => 'nullable|string']);
        $category->update($v);
        return $category;
    }
    public function destroy(Category $category) { $category->delete(); return response()->json(null, 204); }
}
