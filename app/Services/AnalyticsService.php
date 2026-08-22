<?php

namespace App\Services;

use App\Models\Category;
use App\Models\StockTransaction;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    public function getLineChart(int $days = 30): array
    {
        $startDate = Carbon::now()->subDays($days - 1)->startOfDay();

        $transactions = StockTransaction::where('created_at', '>=', $startDate)
            ->where('status', 'approved')
            ->select(
                DB::raw('DATE(created_at) as date'),
                'type',
                DB::raw('SUM(quantity) as total')
            )
            ->groupBy(DB::raw('DATE(created_at)'), 'type')
            ->get();

        $grouped = $transactions->groupBy(function ($row) {
            return $row->date instanceof Carbon ? $row->date->format('Y-m-d') : $row->date;
        });

        $result = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dateStr = $date->format('Y-m-d');
            $dayData = $grouped->get($dateStr, collect());

            $in = $dayData->where('type', 'in')->sum('total');
            $out = $dayData->where('type', 'out')->sum('total');

            $result[] = [
                'date' => $date->format('d M'),
                'in' => (int) $in,
                'out' => (int) $out,
                'net' => (int) ($in - $out),
            ];
        }

        return $result;
    }

    public function getTopProducts(int $limit = 10): array
    {
        $products = StockTransaction::where('status', 'approved')
            ->with('product:id,name')
            ->select(
                'product_id',
                'type',
                DB::raw('SUM(quantity) as total')
            )
            ->groupBy('product_id', 'type')
            ->get()
            ->groupBy('product_id');

        $result = [];
        foreach ($products as $productId => $txs) {
            $product = $txs->first()->product;
            if (!$product) continue;

            $in = $txs->where('type', 'in')->sum('total');
            $out = $txs->where('type', 'out')->sum('total');

            $result[] = [
                'name' => $product->name,
                'in' => (int) $in,
                'out' => (int) $out,
                'total' => (int) ($in + $out),
            ];
        }

        usort($result, fn ($a, $b) => $b['total'] - $a['total']);

        return array_slice($result, 0, $limit);
    }

    public function getHeatmap(int $weeks = 20): array
    {
        $startDate = Carbon::now()->subWeeks($weeks)->startOfWeek();
        $endDate = Carbon::now()->endOfWeek();

        $daily = StockTransaction::where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->where('status', 'approved')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->pluck('count', 'date');

        $result = [];
        $current = $startDate->copy();
        while ($current <= $endDate) {
            $dateStr = $current->format('Y-m-d');
            $result[] = [
                'date' => $dateStr,
                'count' => (int) ($daily->get($dateStr, 0)),
                'day' => $current->dayOfWeek,
            ];
            $current->addDay();
        }

        return $result;
    }

    public function getCategoryDistribution(): array
    {
        $categories = Category::withCount(['products as stock_sum' => function ($q) {
            $q->select(DB::raw('COALESCE(SUM(stock_quantity), 0)'));
        }])->get();

        $colors = [
            '#004ac6',
            '#D97706',
            '#DC2626',
            '#0EA5E9',
            '#6B7280',
            '#16A34A',
            '#9333EA',
            '#EC4899',
        ];

        $result = [];
        $total = $categories->sum('stock_sum');

        foreach ($categories as $i => $cat) {
            $result[] = [
                'name' => $cat->name,
                'value' => (int) $cat->stock_sum,
                'percentage' => $total > 0 ? round(($cat->stock_sum / $total) * 100, 1) : 0,
                'color' => $colors[$i % count($colors)],
            ];
        }

        return array_filter($result, fn ($r) => $r['value'] > 0);
    }
}
