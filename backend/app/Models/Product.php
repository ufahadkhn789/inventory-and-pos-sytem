<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'sku', 
        'description', 
        'category_id', 
        'supplier_id', 
        'purchase_price', 
        'selling_price', 
        'stock_quantity', 
        'low_stock_threshold'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function transactions()
    {
        return $this->hasMany(InventoryTransaction::class);
    }
}
