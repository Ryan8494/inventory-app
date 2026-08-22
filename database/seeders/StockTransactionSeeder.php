<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\StockTransaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class StockTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@inventaris.test')->first();
        $manager = User::where('email', 'manager@inventaris.test')->first();
        $staff = User::where('email', 'staff@inventaris.test')->first();

        $transactions = [
            // Stok Masuk - Disetujui
            [
                'product_sku' => 'ELEC-001',
                'user_id' => $staff->id,
                'type' => 'in',
                'quantity' => 10,
                'note' => 'Pembelian awal dari supplier',
                'status' => 'approved',
                'approved_by' => $admin->id,
                'created_at' => now()->subDays(15),
            ],
            [
                'product_sku' => 'ELEC-002',
                'user_id' => $staff->id,
                'type' => 'in',
                'quantity' => 30,
                'note' => 'Restock mouse Logitech',
                'status' => 'approved',
                'approved_by' => $manager->id,
                'created_at' => now()->subDays(14),
            ],
            [
                'product_sku' => 'ATK-001',
                'user_id' => $staff->id,
                'type' => 'in',
                'quantity' => 200,
                'note' => 'Pembelian pulpen bulanan',
                'status' => 'approved',
                'approved_by' => $admin->id,
                'created_at' => now()->subDays(12),
            ],
            [
                'product_sku' => 'CAI-001',
                'user_id' => $staff->id,
                'type' => 'in',
                'quantity' => 20,
                'note' => 'Pengisian oli Shell Helix',
                'status' => 'approved',
                'approved_by' => $manager->id,
                'created_at' => now()->subDays(10),
            ],

            // Stok Keluar - Disetujui
            [
                'product_sku' => 'ELEC-001',
                'user_id' => $staff->id,
                'type' => 'out',
                'quantity' => 3,
                'note' => 'Dipinjam divisi IT untuk project',
                'status' => 'approved',
                'approved_by' => $admin->id,
                'created_at' => now()->subDays(13),
            ],
            [
                'product_sku' => 'FURN-001',
                'user_id' => $staff->id,
                'type' => 'out',
                'quantity' => 2,
                'note' => 'Pengadaan untuk kantor baru',
                'status' => 'approved',
                'approved_by' => $manager->id,
                'created_at' => now()->subDays(11),
            ],
            [
                'product_sku' => 'ATK-002',
                'user_id' => $staff->id,
                'type' => 'out',
                'quantity' => 50,
                'note' => 'Kebutuhan print bulanan',
                'status' => 'approved',
                'approved_by' => $admin->id,
                'created_at' => now()->subDays(8),
            ],
            [
                'product_sku' => 'SPR-001',
                'user_id' => $staff->id,
                'type' => 'out',
                'quantity' => 15,
                'note' => 'Maintenance mesin produksi',
                'status' => 'approved',
                'approved_by' => $manager->id,
                'created_at' => now()->subDays(6),
            ],

            // Penyesuaian Stok - Disetujui
            [
                'product_sku' => 'ATK-001',
                'user_id' => $manager->id,
                'type' => 'adjustment',
                'quantity' => 680,
                'note' => 'Koreksi stok setelah audit fisik',
                'status' => 'approved',
                'approved_by' => $admin->id,
                'created_at' => now()->subDays(5),
            ],
            [
                'product_sku' => 'ELEC-002',
                'user_id' => $manager->id,
                'type' => 'adjustment',
                'quantity' => 47,
                'note' => 'Selisih inventaris',
                'status' => 'approved',
                'approved_by' => $admin->id,
                'created_at' => now()->subDays(4),
            ],

            // Pending transactions
            [
                'product_sku' => 'SPR-002',
                'user_id' => $staff->id,
                'type' => 'out',
                'quantity' => 2,
                'note' => 'Permintaan maintenance bulanan',
                'status' => 'pending',
                'approved_by' => null,
                'created_at' => now()->subDays(2),
            ],
            [
                'product_sku' => 'FURN-002',
                'user_id' => $staff->id,
                'type' => 'in',
                'quantity' => 5,
                'note' => 'Pengadaan meja baru untuk lantai 3',
                'status' => 'pending',
                'approved_by' => null,
                'created_at' => now()->subDay(),
            ],
            [
                'product_sku' => 'CAI-001',
                'user_id' => $staff->id,
                'type' => 'out',
                'quantity' => 10,
                'note' => 'Pemakaian untuk workshop',
                'status' => 'pending',
                'approved_by' => null,
                'created_at' => now()->subHours(6),
            ],

            // Rejected transaction
            [
                'product_sku' => 'ELEC-001',
                'user_id' => $staff->id,
                'type' => 'out',
                'quantity' => 20,
                'note' => 'Peminjaman untuk acara (melebihi stok aman)',
                'status' => 'rejected',
                'approved_by' => $admin->id,
                'created_at' => now()->subDays(7),
            ],

            // Recent transactions
            [
                'product_sku' => 'FURN-001',
                'user_id' => $staff->id,
                'type' => 'in',
                'quantity' => 8,
                'note' => 'Restock kursi ergonomis',
                'status' => 'approved',
                'approved_by' => $manager->id,
                'created_at' => now()->subDays(3),
            ],
            [
                'product_sku' => 'PAK-001',
                'user_id' => $staff->id,
                'type' => 'in',
                'quantity' => 15,
                'note' => 'Pembelian wearpack safety',
                'status' => 'approved',
                'approved_by' => $admin->id,
                'created_at' => now()->subDays(1),
            ],
        ];

        foreach ($transactions as $tx) {
            $product = Product::where('sku', $tx['product_sku'])->first();
            if (!$product) continue;

            StockTransaction::create([
                'product_id' => $product->id,
                'user_id' => $tx['user_id'],
                'type' => $tx['type'],
                'quantity' => $tx['quantity'],
                'note' => $tx['note'],
                'status' => $tx['status'],
                'approved_by' => $tx['approved_by'],
                'approved_at' => $tx['status'] !== 'pending' ? $tx['created_at']->addHours(2) : null,
                'created_at' => $tx['created_at'],
                'updated_at' => $tx['created_at'],
            ]);
        }
    }
}
