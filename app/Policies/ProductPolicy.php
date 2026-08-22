<?php

namespace App\Policies;

use App\Models\User;

class ProductPolicy
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

    public function update(User $user): bool
    {
        return $user->hasRole('admin', 'manager', 'staff');
    }

    public function delete(User $user): bool
    {
        return $user->hasRole('admin', 'manager');
    }
}
