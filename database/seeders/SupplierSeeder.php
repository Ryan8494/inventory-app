<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'PT Maju Bersama',
                'email' => 'info@majubersama.co.id',
                'phone' => '021-5551234',
                'address' => 'Jl. Raya Industri No. 45, Jakarta Timur',
                'status' => 'active',
            ],
            [
                'name' => 'CV Furniture Jaya',
                'email' => 'sales@furniturejaya.co.id',
                'phone' => '021-5555678',
                'address' => 'Jl. Kayu Manis No. 12, Bandung',
                'status' => 'active',
            ],
            [
                'name' => 'Toko Sumber Jaya',
                'email' => null,
                'phone' => '0812-3456-7890',
                'address' => 'Jl. Pasar Pagi No. 8, Surabaya',
                'status' => 'active',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::updateOrCreate(
                ['name' => $supplier['name']],
                $supplier
            );
        }
    }
}
