<?php

namespace App\Services;

use App\Models\Product;
use App\Models\StockTransaction;

class WarehouseService
{
    private const ROWS = ['A', 'B', 'C', 'D'];
    private const COLS = [1, 2, 3, 4, 5, 6, 7, 8];
    private const MAX_CAPACITY_PER_ZONE = 500;

    public function getZoneData(): array
    {
        $products = Product::whereNotNull('zone')->get();
        $pendingIncoming = StockTransaction::where('type', 'in')
            ->where('status', 'pending')
            ->with('product')
            ->get()
            ->groupBy(fn ($tx) => $tx->product?->zone);

        $zones = [];

        foreach (self::ROWS as $row) {
            foreach (self::COLS as $col) {
                $zoneId = $row . $col;
                $zoneProducts = $products->where('zone', $zoneId);
                $totalStock = $zoneProducts->sum('stock_quantity');
                $skuCount = $zoneProducts->count();
                $capacity = min(100, round(($totalStock / self::MAX_CAPACITY_PER_ZONE) * 100));
                $pendingCount = $pendingIncoming->has($zoneId) ? $pendingIncoming[$zoneId]->count() : 0;

                $status = $this->resolveStatus($zoneProducts, $pendingCount);

                $zones[] = [
                    'id' => $zoneId,
                    'row' => $row,
                    'col' => $col,
                    'sku_count' => $skuCount,
                    'total_stock' => $totalStock,
                    'capacity' => $capacity,
                    'status' => $status,
                    'pending_incoming' => $pendingCount,
                    'products' => $zoneProducts->map(fn ($p) => [
                        'id' => $p->id,
                        'name' => $p->name,
                        'sku' => $p->sku,
                        'stock' => $p->stock_quantity,
                        'min_stock' => $p->min_stock,
                    ])->values(),
                ];
            }
        }

        return $zones;
    }

    private function resolveStatus($products, int $pendingCount): string
    {
        if ($pendingCount > 0) {
            return 'incoming';
        }

        if ($products->isEmpty()) {
            return 'empty';
        }

        $hasCritical = $products->contains(fn ($p) => $p->stock_quantity <= 0);
        if ($hasCritical) {
            return 'critical';
        }

        $hasReorder = $products->contains(fn ($p) => $p->stock_quantity <= $p->min_stock);
        if ($hasReorder) {
            return 'reorder';
        }

        return 'optimal';
    }

    public function getSummary(array $zones): array
    {
        $total = count($zones);
        $optimal = collect($zones)->where('status', 'optimal')->count();
        $reorder = collect($zones)->where('status', 'reorder')->count();
        $critical = collect($zones)->where('status', 'critical')->count();
        $incoming = collect($zones)->where('status', 'incoming')->count();
        $empty = collect($zones)->where('status', 'empty')->count();
        $occupied = $total - $empty;
        $totalSkus = collect($zones)->sum('sku_count');
        $totalStock = collect($zones)->sum('total_stock');
        $avgCapacity = $total > 0 ? round(collect($zones)->avg('capacity'), 1) : 0;

        return compact(
            'total', 'optimal', 'reorder', 'critical', 'incoming', 'empty',
            'occupied', 'totalSkus', 'totalStock', 'avgCapacity'
        );
    }
}
