<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin Utama',
                'email' => 'admin@inventaris.test',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
            ],
            [
                'name' => 'Manager Gudang',
                'email' => 'manager@inventaris.test',
                'password' => Hash::make('password'),
                'role' => 'manager',
                'is_active' => true,
            ],
            [
                'name' => 'Staff Gudang',
                'email' => 'staff@inventaris.test',
                'password' => Hash::make('password'),
                'role' => 'staff',
                'is_active' => true,
            ],
            [
                'name' => 'Viewer Laporan',
                'email' => 'viewer@inventaris.test',
                'password' => Hash::make('password'),
                'role' => 'viewer',
                'is_active' => true,
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                $user
            );
        }
    }
}
