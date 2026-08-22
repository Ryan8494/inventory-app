import AppLayout from '@/Components/AppLayout';
import DataTable, { Pagination, SearchFilter } from '@/Components/DataTable';
import { StockBadge } from '@/Components/StatusBadge';
import ConfirmDialog from '@/Components/ConfirmDialog';
import FilterDropdown from '@/Components/FilterDropdown';
import { Link, router } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import { useState } from 'react';

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function Index({ products, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
    const { canDeleteProducts } = usePermission();

    const handleSearch = (value) => {
        setSearch(value);
        router.get(route('products.index'), { search: value, category_id: filters.category_id, sort: filters.sort }, { preserveState: true, replace: true });
    };

    const categoryFilters = [
        {
            key: 'category_id',
            label: 'Kategori',
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />,
            options: categories.map((c) => ({ value: String(c.id), label: c.name })),
        },
        {
            key: 'sort',
            label: 'Stok',
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />,
            options: [
                { value: 'stock_desc', label: 'Stok Terbanyak' },
                { value: 'stock_asc', label: 'Stok Terendah' },
            ],
        },
    ];

    // Pastikan filter values selalu eksplisit string
    const filterValues = {
        category_id: filters.category_id || '',
        sort: filters.sort || '',
    };

    const handleFilterApply = (values) => {
        router.get(route('products.index'), { search, category_id: values.category_id || undefined, sort: values.sort || undefined }, { preserveState: true, replace: true });
    };

    const handleFilterReset = () => {
        router.get(route('products.index'), { search }, { preserveState: true, replace: true });
    };

    const columns = [
        {
            key: 'name', label: 'Produk',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-sm bg-chalk border border-line flex items-center justify-center overflow-hidden shrink-0">
                        {row.photo ? (
                            <img src={`/storage/${row.photo}`} alt={row.name} className="w-full h-full object-cover" />
                        ) : (
                            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" /></svg>
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="font-medium text-deep truncate">{row.name}</div>
                        <div className="text-xs text-steel font-mono">{row.sku}</div>
                    </div>
                </div>
            ),
        },
        { key: 'category', label: 'Kategori', render: (row) => <span className="text-xs">{row.category?.name}</span> },
        { key: 'buy_price', label: 'Harga Beli', align: 'right', mono: true, render: (row) => <span className="text-xs">{formatRupiah(row.buy_price)}</span> },
        { key: 'sell_price', label: 'Harga Jual', align: 'right', mono: true, render: (row) => <span className="text-xs">{formatRupiah(row.sell_price)}</span> },
        { key: 'stock_quantity', label: 'Stok', align: 'right', render: (row) => (
            <div className="text-right">
                <span className="font-mono font-semibold text-deep tabular-nums">{row.stock_quantity}</span>
                <div className="mt-0.5"><StockBadge quantity={row.stock_quantity} minStock={row.min_stock} /></div>
            </div>
        )},
    ];

    return (
        <AppLayout title="Produk">
            <div className="page-header">
                <div className="flex items-center gap-3">
                    <div className="w-64">
                        <SearchFilter value={search} onChange={handleSearch} placeholder="Cari nama/SKU..." />
                    </div>
                    <FilterDropdown
                        filters={categoryFilters}
                        values={filterValues}
                        onApply={handleFilterApply}
                        onReset={handleFilterReset}
                    />
                </div>
                <Link href={route('products.create')} className="btn-primary">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Tambah Produk
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={products.data}
                emptyMessage="Belum ada produk"
                actions={(row) => (
                    <div className="flex items-center justify-end gap-1">
                        <Link href={route('products.edit', row.id)} className="btn-ghost text-xs px-2 py-1">Edit</Link>
                        {canDeleteProducts() && (
                            <button onClick={() => setDeleteDialog({ open: true, id: row.id, name: row.name })} className="btn-ghost text-xs px-2 py-1 text-red-500 hover:text-red-700">Hapus</button>
                        )}
                    </div>
                )}
            />

            <Pagination links={products.links} />

            <ConfirmDialog
                open={deleteDialog.open}
                title="Hapus Produk"
                message={`Yakin ingin hapus "${deleteDialog.name}"?`}
                confirmText="Hapus"
                danger
                onConfirm={() => { router.delete(route('products.destroy', deleteDialog.id)); setDeleteDialog({ open: false, id: null, name: '' }); }}
                onCancel={() => setDeleteDialog({ open: false, id: null, name: '' })}
            />
        </AppLayout>
    );
}
