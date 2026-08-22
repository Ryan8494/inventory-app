<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function __construct(private AnalyticsService $analytics)
    {
    }

    public function index()
    {
        $lineChart = $this->analytics->getLineChart(30);
        $topProducts = $this->analytics->getTopProducts(10);
        $heatmap = $this->analytics->getHeatmap(20);
        $categoryDistribution = $this->analytics->getCategoryDistribution();

        return Inertia::render('Analytics/Index', [
            'lineChart' => $lineChart,
            'topProducts' => $topProducts,
            'heatmap' => $heatmap,
            'categoryDistribution' => $categoryDistribution,
        ]);
    }
}
