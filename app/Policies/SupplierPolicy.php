<?php

namespace App\Policies;

use App\Models\User;

class SupplierPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin', 'manager');
    }

    public function view(User $user): bool
    {
        return $user->hasRole('admin', 'manager');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin', 'manager');
    }

    public function update(User $user): bool
    {
        return $user->hasRole('admin', 'manager');
    }

    public function delete(User $user): bool
    {
        return $user->hasRole('admin');
    }
}
