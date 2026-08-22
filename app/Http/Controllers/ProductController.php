<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Product::class);

        $products = Product::with(['category', 'supplier'])
            ->when($request->search, function ($q, $s) {
                $q->where(function ($query) use ($s) {
                    $query->where('name', 'like', "%{$s}%")
                        ->orWhere('sku', 'like', "%{$s}%");
                });
            })
            ->when($request->category_id, fn ($q, $c) => $q->where('category_id', $c))
            ->when($request->sort === 'stock_desc', fn ($q) => $q->orderByDesc('stock_quantity'))
            ->when($request->sort === 'stock_asc', fn ($q) => $q->orderBy('stock_quantity'))
            ->when(!$request->sort, fn ($q) => $q->latest())
            ->paginate(15)
            ->withQueryString();

        $categories = Category::orderBy('name')->get();

        $filters = array_merge([
            'search' => '',
            'category_id' => '',
            'sort' => '',
        ], $request->only(['search', 'category_id', 'sort']));

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Product::class);

        return Inertia::render('Products/Create', [
            'categories' => Category::orderBy('name')->get(),
            'suppliers' => Supplier::where('status', 'active')->orderBy('name')->get(),
        ]);
    }

    public function store(ProductRequest $request)
    {
        $this->authorize('create', Product::class);

        $data = $request->validated();
        $data['created_by'] = auth()->id();

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('products', 'public');
        }

        $product = Product::create($data);

        return redirect()->route('products.index')->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit(Product $product)
    {
        $this->authorize('update', $product);

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => Category::orderBy('name')->get(),
            'suppliers' => Supplier::where('status', 'active')->orderBy('name')->get(),
        ]);
    }

    public function update(ProductRequest $request, Product $product)
    {
        $this->authorize('update', $product);

        $data = $request->validated();

        if ($request->hasFile('photo')) {
            if ($product->photo) {
                Storage::disk('public')->delete($product->photo);
            }
            $data['photo'] = $request->file('photo')->store('products', 'public');
        }

        $product->update($data);

        return redirect()->route('products.index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);

        if ($product->stockTransactions()->exists()) {
            return back()->with('error', 'Tidak dapat menghapus produk yang memiliki riwayat transaksi.');
        }

        if ($product->photo) {
            Storage::disk('public')->delete($product->photo);
        }

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Produk berhasil dihapus.');
    }
}
