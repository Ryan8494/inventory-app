import AppLayout from '@/Components/AppLayout';
import DataTable, { Pagination, SearchFilter } from '@/Components/DataTable';
import { StatusBadge, TypeBadge } from '@/Components/StatusBadge';
import ConfirmDialog from '@/Components/ConfirmDialog';
import FilterDropdown from '@/Components/FilterDropdown';
import { Link, router } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import { useState } from 'react';

export default function Index({ transactions, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const { canApproveTransactions } = usePermission();
    const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null, action: '', message: '' });

    const handleSearch = (value) => {
        setSearch(value);
        router.get(route('transactions.index'), { search: value, type: filters.type, status: filters.status, sort: filters.sort }, { preserveState: true, replace: true });
    };

    const txFilters = [
        {
            key: 'type',
            label: 'Tipe',
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />,
            options: [
                { value: 'in', label: 'Masuk' },
                { value: 'out', label: 'Keluar' },
                { value: 'adjustment', label: 'Penyesuaian' },
            ],
        },
        {
            key: 'status',
            label: 'Status',
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />,
            options: [
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Disetujui' },
                { value: 'rejected', label: 'Ditolak' },
            ],
        },
        {
            key: 'sort_date',
            label: 'Tanggal',
            group: 'sort',
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />,
            options: [
                { value: 'date_desc', label: 'Tanggal Terbaru' },
                { value: 'date_asc', label: 'Tanggal Terlama' },
            ],
        },
        {
            key: 'sort_qty',
            label: 'Jumlah',
            group: 'sort',
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />,
            options: [
                { value: 'qty_desc', label: 'Jumlah Terbanyak' },
                { value: 'qty_asc', label: 'Jumlah Terendah' },
            ],
        },
    ];

    const handleFilterApply = (values) => {
        const sort = values.sort_date || values.sort_qty || undefined;
        router.get(route('transactions.index'), { search, type: values.type || undefined, status: values.status || undefined, sort }, { preserveState: true, replace: true });
    };

    const handleFilterReset = () => {
        router.get(route('transactions.index'), { search }, { preserveState: true, replace: true });
    };

    const columns = [
        {
            key: 'product', label: 'Produk',
            render: (row) => (
                <div className="min-w-0">
                    <div className="font-medium text-deep text-sm truncate">{row.product?.name}</div>
                    <div className="text-xs text-steel font-mono">{row.product?.sku}</div>
                </div>
            ),
        },
        {
            key: 'created_at', label: 'Tanggal', render: (row) => (
                <span className="text-xs font-mono text-steel">
                    {new Date(row.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            ),
        },
        { key: 'type', label: 'Tipe', render: (row) => <TypeBadge type={row.type} /> },
        { key: 'quantity', label: 'Jumlah', align: 'right', mono: true, render: (row) => <span className="font-mono font-semibold tabular-nums">{row.quantity}</span> },
        { key: 'user', label: 'Oleh', render: (row) => <span className="text-xs">{row.user?.name}</span> },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
        { key: 'note', label: 'Catatan', render: (row) => <span className="text-xs text-steel max-w-[150px] truncate block">{row.note || '-'}</span> },
    ];

    return (
        <AppLayout title="Transaksi Stok">
            <div className="page-header">
                <div className="flex items-center gap-3">
                    <div className="w-56">
                        <SearchFilter value={search} onChange={handleSearch} placeholder="Cari produk..." />
                    </div>
                    <FilterDropdown
                        filters={txFilters}
                        values={{ type: filters.type || '', status: filters.status || '', sort_date: filters.sort === 'date_desc' || filters.sort === 'date_asc' ? filters.sort : '', sort_qty: filters.sort === 'qty_desc' || filters.sort === 'qty_asc' ? filters.sort : '' }}
                        onApply={handleFilterApply}
                        onReset={handleFilterReset}
                    />
                </div>
                <Link href={route('transactions.create')} className="btn-primary">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Transaksi Baru
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={transactions.data}
                emptyMessage="Belum ada transaksi"
                actions={(row) => (
                    <div className="flex items-center justify-end gap-1">
                        <Link href={route('transactions.show', row.id)} className="btn-ghost text-xs px-2 py-1">Detail</Link>
                        {row.status === 'pending' && canApproveTransactions() && (
                            <>
                                <button onClick={() => setConfirmDialog({ open: true, id: row.id, action: 'approve', message: 'Setujui transaksi ini?' })} className="btn-ghost text-xs px-2 py-1 text-emerald-600 hover:text-emerald-800">Approve</button>
                                <button onClick={() => setConfirmDialog({ open: true, id: row.id, action: 'reject', message: 'Tolak transaksi ini?' })} className="btn-ghost text-xs px-2 py-1 text-red-500 hover:text-red-700">Tolak</button>
                            </>
                        )}
                    </div>
                )}
            />

            <Pagination links={transactions.links} />

            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.action === 'approve' ? 'Setujui Transaksi' : 'Tolak Transaksi'}
                message={confirmDialog.message}
                confirmText={confirmDialog.action === 'approve' ? 'Setujui' : 'Tolak'}
                danger={confirmDialog.action === 'reject'}
                onConfirm={() => {
                    if (confirmDialog.action === 'approve') router.post(route('transactions.approve', confirmDialog.id));
                    else router.post(route('transactions.reject', confirmDialog.id));
                    setConfirmDialog({ open: false, id: null, action: '', message: '' });
                }}
                onCancel={() => setConfirmDialog({ open: false, id: null, action: '', message: '' })}
            />
        </AppLayout>
    );
}
