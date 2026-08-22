<?php

namespace App\Policies;

use App\Models\User;

class StockTransactionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin', 'manager', 'staff');
    }

    public function view(User $user): bool
    {
        return $user->hasRole('admin', 'manager', 'staff');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin', 'manager', 'staff');
    }

    public function approve(User $user): bool
    {
        return $user->hasRole('admin', 'manager');
    }
}
