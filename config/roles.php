<?php

return [
    'roles' => [
        'admin' => 'Admin',
        'manager' => 'Manager',
        'staff' => 'Staff',
        'viewer' => 'Viewer',
    ],

    'permissions' => [
        'admin' => [
            'users.manage',
            'products.manage',
            'suppliers.manage',
            'transactions.manage',
            'transactions.approve',
            'reports.view',
            'reports.export',
            'dashboard.view',
        ],
        'manager' => [
            'products.manage',
            'suppliers.manage',
            'transactions.manage',
            'transactions.approve',
            'reports.view',
            'reports.export',
            'dashboard.view',
        ],
        'staff' => [
            'products.manage',
            'transactions.manage',
            'dashboard.view',
        ],
        'viewer' => [
            'dashboard.view',
        ],
    ],
];
