import AppLayout from '@/Components/AppLayout';
import StatsCard from '@/Components/StatsCard';
import { TypeBadge, StatusBadge } from '@/Components/StatusBadge';
import { router } from '@inertiajs/react';
import { useState } from 'react';

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Stock({ report, filters }) {
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('reports.index'), {
            start_date: startDate || undefined,
            end_date: endDate || undefined,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        router.get(route('reports.index'), {}, { preserveState: true, replace: true });
    };

    return (
        <AppLayout title="Laporan Stok Masuk/Keluar">
            <div className="space-y-6">
                <form onSubmit={handleFilter} className="card p-4">
                    <div className="flex items-end gap-3">
                        <div>
                            <label className="block text-xs font-medium text-steel mb-1">Dari Tanggal</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="input-field text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-steel mb-1">Sampai Tanggal</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="input-field text-sm"
                            />
                        </div>
                        <button type="submit" className="btn-primary text-sm">Terapkan</button>
                        {(startDate || endDate) && (
                            <button type="button" onClick={handleReset} className="btn-ghost text-sm text-steel">Reset</button>
                        )}
                    </div>
                </form>

                <div>
                    <h3 className="font-heading font-semibold text-deep text-sm mb-3">Ringkasan</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                        <StatsCard title="Total Transaksi" value={report.summary.total_transactions} subtitle="semua transaksi" />
                        <StatsCard title="Stok Masuk" value={report.summary.total_in} subtitle="unit disetujui" />
                        <StatsCard title="Stok Keluar" value={report.summary.total_out} subtitle="unit disetujui" />
                        <StatsCard title="Penyesuaian" value={report.summary.total_adjustment} subtitle="transaksi" />
                        <StatsCard title="Pending" value={report.summary.pending} subtitle="menunggu approval" />
                    </div>
                </div>

                <div className="card">
                    <div className="px-4 py-3 border-b border-line">
                        <h3 className="font-heading font-semibold text-deep text-sm">Detail Transaksi</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="table-header">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-steel uppercase tracking-wider">Tanggal</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-steel uppercase tracking-wider">Produk</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-steel uppercase tracking-wider">Tipe</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-steel uppercase tracking-wider">Jumlah</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-steel uppercase tracking-wider">Oleh</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-steel uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-steel uppercase tracking-wider">Catatan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-steel text-xs">Tidak ada data transaksi</td>
                                    </tr>
                                ) : (
                                    report.transactions.map((tx) => (
                                        <tr key={tx.id} className="table-row">
                                            <td className="px-4 py-3 font-mono text-xs tabular-nums">{formatDate(tx.created_at)}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-deep text-sm">{tx.product?.name}</div>
                                                <div className="text-xs text-steel font-mono">{tx.product?.sku}</div>
                                            </td>
                                            <td className="px-4 py-3"><TypeBadge type={tx.type} /></td>
                                            <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums">{tx.quantity}</td>
                                            <td className="px-4 py-3 text-xs text-steel">{tx.user?.name}</td>
                                            <td className="px-4 py-3"><StatusBadge status={tx.status} /></td>
                                            <td className="px-4 py-3 text-xs text-steel max-w-[150px] truncate">{tx.note || '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
