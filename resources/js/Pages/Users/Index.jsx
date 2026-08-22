import AppLayout from '@/Components/AppLayout';
import DataTable, { Pagination, SearchFilter } from '@/Components/DataTable';
import { RoleBadge, StatusBadge } from '@/Components/StatusBadge';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ users, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });

    const handleSearch = (value) => {
        setSearch(value);
        router.get(route('users.index'), { search: value, role: filters.role }, { preserveState: true, replace: true });
    };

    const columns = [
        {
            key: 'name', label: 'User',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-sm bg-ink-navy text-white flex items-center justify-center font-heading font-semibold text-xs shrink-0">
                        {row.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <div className="font-medium text-deep truncate">{row.name}</div>
                        <div className="text-xs text-steel truncate">{row.email}</div>
                    </div>
                </div>
            ),
        },
        { key: 'role', label: 'Role', render: (row) => <RoleBadge role={row.role} /> },
        { key: 'is_active', label: 'Status', render: (row) => <StatusBadge status={row.is_active ? 'active' : 'inactive'} /> },
        { key: 'stock_transactions_count', label: 'Transaksi', align: 'right', mono: true, render: (row) => row.stock_transactions_count },
    ];

    return (
        <AppLayout title="Manajemen User">
            <div className="page-header">
                <div className="w-64">
                    <SearchFilter value={search} onChange={handleSearch} placeholder="Cari nama/email..." />
                </div>
                <Link href={route('users.create')} className="btn-primary">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Tambah User
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={users.data}
                emptyMessage="Belum ada user"
                actions={(row) => (
                    <div className="flex items-center justify-end gap-1">
                        <Link href={route('users.edit', row.id)} className="btn-ghost text-xs px-2 py-1">Edit</Link>
                        <button onClick={() => setDeleteDialog({ open: true, id: row.id, name: row.name })} className="btn-ghost text-xs px-2 py-1 text-red-500 hover:text-red-700">Hapus</button>
                    </div>
                )}
            />

            <Pagination links={users.links} />

            <ConfirmDialog
                open={deleteDialog.open}
                title="Hapus User"
                message={`Yakin ingin hapus user "${deleteDialog.name}"?`}
                confirmText="Hapus"
                danger
                onConfirm={() => { router.delete(route('users.destroy', deleteDialog.id)); setDeleteDialog({ open: false, id: null, name: '' }); }}
                onCancel={() => setDeleteDialog({ open: false, id: null, name: '' })}
            />
        </AppLayout>
    );
}
