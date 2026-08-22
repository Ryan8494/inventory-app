<?php

namespace App\Services;

use App\Models\StockTransaction;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class StockService
{
    public function stockIn(Product $product, int $quantity, ?string $note, int $userId): StockTransaction
    {
        return DB::transaction(function () use ($product, $quantity, $note, $userId) {
            $transaction = StockTransaction::create([
                'product_id' => $product->id,
                'user_id' => $userId,
                'type' => 'in',
                'quantity' => $quantity,
                'note' => $note,
                'status' => 'pending',
            ]);

            return $transaction;
        });
    }

    public function stockOut(Product $product, int $quantity, ?string $note, int $userId): StockTransaction
    {
        if ($product->stock_quantity < $quantity) {
            throw new \RuntimeException('Stok tidak mencukupi. Stok saat ini: ' . $product->stock_quantity);
        }

        return DB::transaction(function () use ($product, $quantity, $note, $userId) {
            $transaction = StockTransaction::create([
                'product_id' => $product->id,
                'user_id' => $userId,
                'type' => 'out',
                'quantity' => $quantity,
                'note' => $note,
                'status' => 'pending',
            ]);

            return $transaction;
        });
    }

    public function adjustment(Product $product, int $quantity, ?string $note, int $userId): StockTransaction
    {
        return DB::transaction(function () use ($product, $quantity, $note, $userId) {
            $transaction = StockTransaction::create([
                'product_id' => $product->id,
                'user_id' => $userId,
                'type' => 'adjustment',
                'quantity' => $quantity,
                'note' => $note,
                'status' => 'pending',
            ]);

            return $transaction;
        });
    }

    public function approve(StockTransaction $transaction, int $approvedBy): void
    {
        if ($transaction->status !== 'pending') {
            throw new \RuntimeException('Transaksi ini sudah diproses.');
        }

        if ($transaction->type === 'out') {
            $product = $transaction->product->fresh();
            if ($product->stock_quantity < $transaction->quantity) {
                throw new \RuntimeException('Stok tidak mencukupi. Stok saat ini: ' . $product->stock_quantity);
            }
        }

        DB::transaction(function () use ($transaction, $approvedBy) {
            $transaction->update([
                'status' => 'approved',
                'approved_by' => $approvedBy,
                'approved_at' => now(),
            ]);

            $product = $transaction->product;

            if ($transaction->type === 'in') {
                $product->increment('stock_quantity', $transaction->quantity);
            } elseif ($transaction->type === 'out') {
                $product->decrement('stock_quantity', $transaction->quantity);
            } elseif ($transaction->type === 'adjustment') {
                $product->update(['stock_quantity' => $transaction->quantity]);
            }
        });
    }

    public function reject(StockTransaction $transaction, int $rejectedBy): void
    {
        $transaction->update([
            'status' => 'rejected',
            'approved_by' => $rejectedBy,
            'approved_at' => now(),
        ]);
    }
}
