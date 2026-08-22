<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Models\Product;
use App\Models\StockTransaction;
use App\Services\StockService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function __construct(private StockService $stockService)
    {
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', StockTransaction::class);

        $transactions = StockTransaction::with(['product', 'user', 'approver'])
            ->when($request->type, fn ($q, $t) => $q->where('type', $t))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->search, function ($q, $s) {
                $q->whereHas('product', fn ($pq) => $pq->where('name', 'like', "%{$s}%"));
            })
            ->when(in_array($request->sort, ['qty_desc', 'qty_asc']), function ($q) use ($request) {
                $q->orderBy('quantity', $request->sort === 'qty_desc' ? 'desc' : 'asc');
            }, function ($q) use ($request) {
                if ($request->sort === 'date_desc') {
                    $q->latest();
                } elseif ($request->sort === 'date_asc') {
                    $q->oldest();
                } else {
                    $q->latest();
                }
            })
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'type', 'status', 'sort']),
        ]);
    }

    public function create()
    {
        $this->authorize('create', StockTransaction::class);

        return Inertia::render('Transactions/Create', [
            'products' => Product::orderBy('name')->get(),
        ]);
    }

    public function store(TransactionRequest $request)
    {
        $this->authorize('create', StockTransaction::class);

        $product = Product::findOrFail($request->product_id);

        try {
            match ($request->type) {
                'in' => $this->stockService->stockIn($product, $request->quantity, $request->note, auth()->id()),
                'out' => $this->stockService->stockOut($product, $request->quantity, $request->note, auth()->id()),
                'adjustment' => $this->stockService->adjustment($product, $request->quantity, $request->note, auth()->id()),
            };

            return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil dibuat dan menunggu persetujuan.');
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function show(StockTransaction $transaction)
    {
        $this->authorize('view', $transaction);

        $transaction->load(['product', 'user', 'approver']);

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }

    public function approve(StockTransaction $transaction)
    {
        $this->authorize('approve', $transaction);

        try {
            $this->stockService->approve($transaction, auth()->id());
            return back()->with('success', 'Transaksi berhasil disetujui. Stok telah diperbarui.');
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function reject(StockTransaction $transaction)
    {
        $this->authorize('approve', $transaction);

        $this->stockService->reject($transaction, auth()->id());

        return back()->with('warning', 'Transaksi ditolak.');
    }
}
