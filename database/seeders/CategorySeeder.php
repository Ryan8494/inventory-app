<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Elektronik', 'description' => 'Perangkat elektronik dan komponennya'],
            ['name' => 'Furniture', 'description' => 'Meja, kursi, lemari, dan perlengkapan kantor'],
            ['name' => 'ATK', 'description' => 'Alat Tulis Kantor dan perlengkapan administrasi'],
            ['name' => 'Sparepart', 'description' => 'Suku cadang untuk mesin dan peralatan'],
            ['name' => 'Cairan', 'description' => 'Cairan kimia, pelarut, dan bahan habis pakai'],
            ['name' => 'Pakaian', 'description' => 'Seragam dan perlengkapan wearpack'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['name' => $category['name']],
                $category
            );
        }
    }
}
