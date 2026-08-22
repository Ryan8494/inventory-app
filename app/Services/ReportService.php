<?php

namespace App\Services;

use App\Models\Product;
use App\Models\StockTransaction;
use App\Models\Category;
use App\Models\Supplier;
use Illuminate\Support\Facades\DB;

class ReportService
{
    public function getDashboardStats(): array
    {
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        $totalSuppliers = Supplier::count();

        $lowStockProducts = Product::whereColumn('stock_quantity', '<=', 'min_stock')
            ->where('stock_quantity', '>', 0)
            ->count();

        $outOfStockProducts = Product::where('stock_quantity', '<=', 0)->count();

        $pendingTransactions = StockTransaction::where('status', 'pending')->count();

        $totalStockValue = Product::sum(DB::raw('stock_quantity * buy_price'));

        $recentTransactions = StockTransaction::with(['product', 'user'])
            ->latest()
            ->take(5)
            ->get();

        $lowStockItems = Product::whereColumn('stock_quantity', '<=', 'min_stock')
            ->with('category')
            ->orderBy('stock_quantity')
            ->take(5)
            ->get();

        $categoryDistribution = Category::withCount('products')
            ->orderByDesc('products_count')
            ->get()
            ->map(fn ($c) => ['name' => $c->name, 'value' => $c->products_count]);

        $stockStatus = [
            'safe' => $totalProducts - $lowStockProducts - $outOfStockProducts,
            'low' => $lowStockProducts,
            'out' => $outOfStockProducts,
        ];

        return compact(
            'totalProducts',
            'totalCategories',
            'totalSuppliers',
            'lowStockProducts',
            'outOfStockProducts',
            'pendingTransactions',
            'totalStockValue',
            'recentTransactions',
            'lowStockItems',
            'categoryDistribution',
            'stockStatus'
        );
    }

    public function getStockReport(?string $startDate = null, ?string $endDate = null): array
    {
        $query = StockTransaction::with(['product', 'user', 'approver']);

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $transactions = $query->latest()->get();

        $summary = [
            'total_in' => $transactions->where('type', 'in')->where('status', 'approved')->sum('quantity'),
            'total_out' => $transactions->where('type', 'out')->where('status', 'approved')->sum('quantity'),
            'total_adjustment' => $transactions->where('type', 'adjustment')->where('status', 'approved')->count(),
            'pending' => $transactions->where('status', 'pending')->count(),
            'total_transactions' => $transactions->count(),
        ];

        return compact('transactions', 'summary');
    }
}
