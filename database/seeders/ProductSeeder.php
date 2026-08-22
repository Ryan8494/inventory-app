<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@inventaris.test')->first();
        $staff = User::where('email', 'staff@inventaris.test')->first();

        $categories = Category::all();
        $suppliers = Supplier::all();

        if ($categories->isEmpty() || $suppliers->isEmpty()) {
            return;
        }

        $products = [
            [
                'name' => 'Laptop Lenovo ThinkPad X1',
                'sku' => 'ELEC-001',
                'zone' => 'A1',
                'category' => 'Elektronik',
                'supplier' => 'PT Maju Bersama',
                'buy_price' => 15000000,
                'sell_price' => 18000000,
                'stock_quantity' => 25,
                'min_stock' => 5,
            ],
            [
                'name' => 'Mouse Logitech MX Master 3',
                'sku' => 'ELEC-002',
                'zone' => 'A2',
                'category' => 'Elektronik',
                'supplier' => 'PT Maju Bersama',
                'buy_price' => 750000,
                'sell_price' => 950000,
                'stock_quantity' => 50,
                'min_stock' => 10,
            ],
            [
                'name' => 'Kursi Ergonomis Oscar',
                'sku' => 'FURN-001',
                'zone' => 'B1',
                'category' => 'Furniture',
                'supplier' => 'CV Furniture Jaya',
                'buy_price' => 2500000,
                'sell_price' => 3200000,
                'stock_quantity' => 15,
                'min_stock' => 3,
            ],
            [
                'name' => 'Meja Kerja 120x60cm',
                'sku' => 'FURN-002',
                'zone' => 'B2',
                'category' => 'Furniture',
                'supplier' => 'CV Furniture Jaya',
                'buy_price' => 1200000,
                'sell_price' => 1500000,
                'stock_quantity' => 20,
                'min_stock' => 5,
            ],
            [
                'name' => 'Pulau Pilot G2 - Biru',
                'sku' => 'ATK-001',
                'zone' => 'C1',
                'category' => 'ATK',
                'supplier' => 'Toko Sumber Jaya',
                'buy_price' => 15000,
                'sell_price' => 25000,
                'stock_quantity' => 500,
                'min_stock' => 100,
            ],
            [
                'name' => 'Kertas A4 70gsm (500 lembar)',
                'sku' => 'ATK-002',
                'zone' => 'C2',
                'category' => 'ATK',
                'supplier' => 'Toko Sumber Jaya',
                'buy_price' => 45000,
                'sell_price' => 65000,
                'stock_quantity' => 200,
                'min_stock' => 50,
            ],
            [
                'name' => 'Bearing 6205-2RS',
                'sku' => 'SPR-001',
                'zone' => 'D1',
                'category' => 'Sparepart',
                'supplier' => 'PT Maju Bersama',
                'buy_price' => 35000,
                'sell_price' => 55000,
                'stock_quantity' => 80,
                'min_stock' => 20,
            ],
            [
                'name' => 'V-Belt B68',
                'sku' => 'SPR-002',
                'zone' => 'D2',
                'category' => 'Sparepart',
                'supplier' => 'PT Maju Bersama',
                'buy_price' => 125000,
                'sell_price' => 185000,
                'stock_quantity' => 3,
                'min_stock' => 10,
            ],
            [
                'name' => 'Oli Mesin Shell Helix HX5 10W-40',
                'sku' => 'CAI-001',
                'zone' => 'D3',
                'category' => 'Cairan',
                'supplier' => 'Toko Sumber Jaya',
                'buy_price' => 85000,
                'sell_price' => 120000,
                'stock_quantity' => 40,
                'min_stock' => 15,
            ],
            [
                'name' => 'Wearpack Kuning Safety',
                'sku' => 'PAK-001',
                'zone' => 'C8',
                'category' => 'Pakaian',
                'supplier' => 'CV Furniture Jaya',
                'buy_price' => 180000,
                'sell_price' => 250000,
                'stock_quantity' => 0,
                'min_stock' => 5,
            ],
        ];

        foreach ($products as $product) {
            $category = $categories->where('name', $product['category'])->first();
            $supplier = $suppliers->where('name', $product['supplier'])->first();

            Product::updateOrCreate(
                ['sku' => $product['sku']],
                [
                    'name' => $product['name'],
                    'zone' => $product['zone'],
                    'category_id' => $category->id,
                    'supplier_id' => $supplier?->id,
                    'buy_price' => $product['buy_price'],
                    'sell_price' => $product['sell_price'],
                    'stock_quantity' => $product['stock_quantity'],
                    'min_stock' => $product['min_stock'],
                    'created_by' => $admin?->id ?? $staff?->id,
                ]
            );
        }
    }
}
