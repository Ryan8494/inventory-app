import AppLayout from '@/Components/AppLayout';
import { StockBadge, StatusBadge, TypeBadge } from '@/Components/StatusBadge';
import { Link } from '@inertiajs/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DONUT_COLORS = ['#2563EB', '#0EA5E9', '#D97706', '#DC2626', '#6B7280', '#8B5CF6', '#059669', '#EC4899'];

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function TotalProdukCard({ totalProducts, categoryDistribution }) {
    const displayCategories = categoryDistribution.filter(c => c.value > 0);

    return (
        <div className="card p-5 flex gap-4 min-h-[120px]">
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    <p className="text-xs font-medium text-steel uppercase tracking-wider">Total Produk</p>
                    <p className="mt-2 text-2xl font-heading font-bold text-deep tabular-nums leading-tight">{totalProducts}</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {displayCategories.slice(0, 3).map((cat, i) => (
                        <span key={cat.name} className="inline-flex items-center gap-1 text-[10px] text-steel">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                            {cat.name} ({cat.value})
                        </span>
                    ))}
                    {displayCategories.length > 3 && (
                        <span className="text-[10px] text-steel">+{displayCategories.length - 3}</span>
                    )}
                </div>
            </div>
            {displayCategories.length > 0 && (
                <div className="w-16 h-16 shrink-0 self-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={displayCategories}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                innerRadius={18}
                                outerRadius={30}
                                strokeWidth={0}
                                paddingAngle={2}
                            >
                                {displayCategories.map((_, i) => (
                                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(val, name) => [`${val} produk`, name]}
                                contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #E2E8F0' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

function NilaiStokCard({ totalStockValue, totalSuppliers }) {
    const maxStock = 50000000;
    const pct = Math.min((totalStockValue / maxStock) * 100, 100);

    return (
        <div className="card p-5 flex flex-col justify-between min-h-[120px]">
            <div>
                <p className="text-xs font-medium text-steel uppercase tracking-wider">Nilai Stok</p>
                <p className="mt-2 text-2xl font-heading font-bold text-deep tabular-nums leading-tight truncate">{formatRupiah(totalStockValue)}</p>
            </div>
            <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-steel">{totalSuppliers} supplier aktif</span>
                    <span className="text-[10px] font-medium text-primary tabular-nums">{Math.round(pct)}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

function StokRendahCard({ lowStockProducts, outOfStockProducts, stockStatus, totalProducts }) {
    const safe = stockStatus?.safe ?? (totalProducts - lowStockProducts - outOfStockProducts);
    const segments = [
        { label: 'Aman', count: safe, color: '#059669' },
        { label: 'Rendah', count: lowStockProducts, color: '#D97706' },
        { label: 'Habis', count: outOfStockProducts, color: '#DC2626' },
    ].filter(s => s.count > 0);

    return (
        <div className="card p-5 flex flex-col justify-between min-h-[120px]">
            <div>
                <p className="text-xs font-medium text-steel uppercase tracking-wider">Stok Rendah</p>
                <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-2xl font-heading font-bold text-deep tabular-nums leading-tight">{lowStockProducts}</p>
                    {outOfStockProducts > 0 && (
                        <span className="text-xs font-medium text-red-500">+ {outOfStockProducts} habis</span>
                    )}
                </div>
            </div>
            <div className="mt-3">
                {totalProducts > 0 && (
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                        {segments.map((seg) => (
                            <div
                                key={seg.label}
                                className="h-full transition-all duration-700"
                                style={{
                                    width: `${(seg.count / totalProducts) * 100}%`,
                                    backgroundColor: seg.color,
                                }}
                                title={`${seg.label}: ${seg.count}`}
                            />
                        ))}
                    </div>
                )}
                <div className="flex gap-3 mt-1.5">
                    {segments.map((seg) => (
                        <span key={seg.label} className="inline-flex items-center gap-1 text-[10px] text-steel">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                            {seg.label} ({seg.count})
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MenungguApproveCard({ pendingTransactions }) {
    return (
        <div className="card p-5 flex flex-col justify-between min-h-[120px]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-steel uppercase tracking-wider">Menunggu Approve</p>
                    <p className="mt-2 text-2xl font-heading font-bold text-deep tabular-nums leading-tight">{pendingTransactions}</p>
                </div>
                {pendingTransactions > 0 && (
                    <div className="relative shrink-0 ml-3">
                        <span className="absolute inline-flex h-10 w-10 rounded-sm bg-primary/20 animate-ping" />
                        <span className="relative inline-flex h-10 w-10 rounded-sm bg-primary/10 text-primary items-center justify-center">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                    </div>
                )}
            </div>
            <div className="mt-3">
                <p className="text-xs text-steel">
                    {pendingTransactions === 0
                        ? 'Semua transaksi sudah diproses'
                        : `Menunggu persetujuan manager/admin`
                    }
                </p>
                {pendingTransactions > 0 && (
                    <div className="flex gap-0.5 mt-1.5">
                        {Array.from({ length: Math.min(pendingTransactions, 8) }).map((_, i) => (
                            <div
                                key={i}
                                className="h-2 rounded-full bg-primary/30"
                                style={{
                                    width: `${Math.max(100 / Math.min(pendingTransactions, 8) - 2, 8)}%`,
                                    backgroundColor: i === 0 ? '#2563EB' : undefined,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Index({ totalProducts, totalCategories, totalSuppliers, lowStockProducts, outOfStockProducts, pendingTransactions, totalStockValue, recentTransactions, lowStockItems, categoryDistribution, stockStatus }) {
    return (
        <AppLayout title="Dashboard">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <TotalProdukCard totalProducts={totalProducts} categoryDistribution={categoryDistribution || []} />
                <NilaiStokCard totalStockValue={totalStockValue} totalSuppliers={totalSuppliers} />
                <StokRendahCard lowStockProducts={lowStockProducts} outOfStockProducts={outOfStockProducts} stockStatus={stockStatus} totalProducts={totalProducts} />
                <MenungguApproveCard pendingTransactions={pendingTransactions} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <div className="card flex flex-col h-full">
                        <div className="px-4 py-3 border-b border-line flex items-center justify-between shrink-0">
                            <h3 className="font-heading font-semibold text-deep text-sm">Transaksi Terbaru</h3>
                            <Link href={route('transactions.index')} className="text-xs text-primary hover:text-primary-700 font-medium">Lihat Semua</Link>
                        </div>
                        <div className="divide-y divide-line flex-1">
                            {recentTransactions.length === 0 ? (
                                <div className="px-4 py-12 text-center text-sm text-steel">Belum ada transaksi</div>
                            ) : (
                                recentTransactions.map((tx) => (
                                    <div key={tx.id} className="px-4 py-3 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <TypeBadge type={tx.type} />
                                            <div className="min-w-0">
                                                <div className="text-sm font-medium text-deep truncate">{tx.product?.name}</div>
                                                <div className="text-xs text-steel truncate">{tx.user?.name} &middot; {tx.note || '-'}</div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-sm font-mono font-semibold text-deep tabular-nums">{tx.quantity}</div>
                                            <StatusBadge status={tx.status} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="card flex flex-col h-full">
                        <div className="px-4 py-3 border-b border-line flex items-center justify-between shrink-0">
                            <h3 className="font-heading font-semibold text-deep text-sm">Stok Rendah</h3>
                            <Link href={route('products.index')} className="text-xs text-primary hover:text-primary-700 font-medium">Lihat Semua</Link>
                        </div>
                        <div className="divide-y divide-line flex-1">
                            {lowStockItems.length === 0 ? (
                                <div className="px-4 py-12 text-center text-sm text-steel">Semua stok aman</div>
                            ) : (
                                lowStockItems.map((item) => (
                                    <div key={item.id} className="px-4 py-3 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-deep truncate">{item.name}</div>
                                            <div className="text-xs text-steel">{item.category?.name}</div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-sm font-mono font-semibold text-deep tabular-nums">{item.stock_quantity}</div>
                                            <StockBadge quantity={item.stock_quantity} minStock={item.min_stock} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
