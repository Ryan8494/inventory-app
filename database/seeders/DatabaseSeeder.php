<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            SupplierSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            StockTransactionSeeder::class,
        ]);
    }
}
