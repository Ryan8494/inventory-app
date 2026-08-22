import AppLayout from '@/Components/AppLayout';
import DataTable, { Pagination, SearchFilter } from '@/Components/DataTable';
import { StatusBadge } from '@/Components/StatusBadge';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Link, router } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import { useState } from 'react';

export default function Index({ suppliers, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
    const { canDeleteSuppliers } = usePermission();

    const handleSearch = (value) => {
        setSearch(value);
        router.get(route('suppliers.index'), { search: value }, { preserveState: true, replace: true });
    };

    const columns = [
        { key: 'name', label: 'Nama', render: (row) => <span className="font-medium text-deep truncate block">{row.name}</span> },
        { key: 'email', label: 'Email', render: (row) => <span className="text-xs text-steel">{row.email || '-'}</span> },
        { key: 'phone', label: 'Telepon', render: (row) => <span className="text-xs font-mono">{row.phone || '-'}</span> },
        { key: 'address', label: 'Alamat', render: (row) => <span className="text-xs text-steel max-w-[200px] truncate block">{row.address || '-'}</span> },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
        { key: 'products_count', label: 'Produk', align: 'right', mono: true, render: (row) => row.products_count },
    ];

    return (
        <AppLayout title="Supplier">
            <div className="page-header">
                <div className="w-64">
                    <SearchFilter value={search} onChange={handleSearch} placeholder="Cari supplier..." />
                </div>
                <Link href={route('suppliers.create')} className="btn-primary">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Tambah Supplier
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={suppliers.data}
                emptyMessage="Belum ada supplier"
                actions={(row) => (
                    <div className="flex items-center justify-end gap-1">
                        <Link href={route('suppliers.edit', row.id)} className="btn-ghost text-xs px-2 py-1">Edit</Link>
                        {canDeleteSuppliers() && (
                            <button onClick={() => setDeleteDialog({ open: true, id: row.id, name: row.name })} className="btn-ghost text-xs px-2 py-1 text-red-500 hover:text-red-700">Hapus</button>
                        )}
                    </div>
                )}
            />

            <Pagination links={suppliers.links} />

            <ConfirmDialog
                open={deleteDialog.open}
                title="Hapus Supplier"
                message={`Yakin ingin hapus supplier "${deleteDialog.name}"?`}
                confirmText="Hapus"
                danger
                onConfirm={() => { router.delete(route('suppliers.destroy', deleteDialog.id)); setDeleteDialog({ open: false, id: null, name: '' }); }}
                onCancel={() => setDeleteDialog({ open: false, id: null, name: '' })}
            />
        </AppLayout>
    );
}
