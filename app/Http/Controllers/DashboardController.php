<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(private ReportService $reportService)
    {
    }

    public function index()
    {
        $stats = $this->reportService->getDashboardStats();

        return Inertia::render('Dashboard/Index', $stats);
    }
}
