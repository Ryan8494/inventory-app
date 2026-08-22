<?php

namespace Database\Seeders;

use App\Models\StockTransaction;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AnalyticsDataSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@inventaris.test')->first();
        $staff = User::where('email', 'staff@inventaris.test')->first();
        $manager = User::where('email', 'manager@inventaris.test')->first();

        $products = Product::all();
        if ($products->isEmpty()) return;

        $types = ['in', 'out'];
        $statuses = ['approved', 'approved', 'approved', 'pending'];

        $records = [];

        for ($day = 29; $day >= 0; $day--) {
            $date = Carbon::now()->subDays($day);
            $txCount = rand(1, 4);

            for ($i = 0; $i < $txCount; $i++) {
                $product = $products->random();
                $type = $types[array_rand($types)];
                $quantity = $type === 'in' ? rand(5, 50) : rand(1, 20);
                $status = $statuses[array_rand($statuses)];
                $user = [$admin, $staff, $manager][array_rand([$admin, $staff, $manager])];

                $records[] = [
                    'product_id' => $product->id,
                    'user_id' => $user->id,
                    'type' => $type,
                    'quantity' => $quantity,
                    'note' => $type === 'in' ? 'Restok dari supplier' : 'Pengeluaran untuk produksi',
                    'status' => $status,
                    'approved_by' => $status === 'approved' ? $admin->id : null,
                    'approved_at' => $status === 'approved' ? $date->copy()->addHours(rand(1, 6)) : null,
                    'created_at' => $date->copy()->setTime(rand(8, 17), rand(0, 59)),
                    'updated_at' => $date->copy()->setTime(rand(8, 17), rand(0, 59)),
                ];
            }
        }

        StockTransaction::insert($records);
    }
}
