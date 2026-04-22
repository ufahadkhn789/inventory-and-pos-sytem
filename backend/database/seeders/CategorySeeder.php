<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Grocery & Staples', 'description' => 'Flour, rice, pulses, sugar, oil'],
            ['name' => 'Dairy & Eggs', 'description' => 'Milk, butter, cheese, eggs'],
            ['name' => 'Fresh Produce', 'description' => 'Vegetables and fruits'],
            ['name' => 'Meat & Seafood', 'description' => 'Chicken, beef, fish'],
            ['name' => 'Beverages', 'description' => 'Soft drinks, juices, water, tea, coffee'],
            ['name' => 'Snacks & Confectionery', 'description' => 'Biscuits, chips, chocolates, sweets'],
            ['name' => 'Personal Care', 'description' => 'Shampoo, soap, toothpaste, skincare'],
            ['name' => 'Household Needs', 'description' => 'Detergents, cleaners, tissue paper'],
            ['name' => 'Baby Care', 'description' => 'Diapers, baby food, wipes'],
            ['name' => 'Frozen Foods', 'description' => 'Ice cream, frozen meals, nuggets'],
            ['name' => 'Bakery', 'description' => 'Bread, cakes, pastries'],
            ['name' => 'Pet Care', 'description' => 'Pet food and accessories'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['name' => $category['name']], $category);
        }
    }
}
