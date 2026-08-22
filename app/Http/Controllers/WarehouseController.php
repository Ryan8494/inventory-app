<?php

namespace App\Http\Controllers;

use App\Services\WarehouseService;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    public function __construct(private WarehouseService $warehouseService)
    {
    }

    public function index()
    {
        $zones = $this->warehouseService->getZoneData();
        $summary = $this->warehouseService->getSummary($zones);

        return Inertia::render('Warehouse/Index', [
            'zones' => $zones,
            'summary' => $summary,
        ]);
    }
}
