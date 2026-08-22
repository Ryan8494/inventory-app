<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function __construct(private ReportService $reportService)
    {
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Product::class);

        $report = $this->reportService->getStockReport(
            $request->start_date,
            $request->end_date
        );

        return Inertia::render('Reports/Stock', [
            'report' => $report,
            'filters' => $request->only(['start_date', 'end_date']),
        ]);
    }
}
