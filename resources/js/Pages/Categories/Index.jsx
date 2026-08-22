import AppLayout from '@/Components/AppLayout';
import DataTable, { Pagination, SearchFilter } from '@/Components/DataTable';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Link, router } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import { useState } from 'react';

export default function Index({ categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
    const { canDeleteCategories } = usePermission();

    const handleSearch = (value) => {
        setSearch(value);
        router.get(route('categories.index'), { search: value }, { preserveState: true, replace: true });
    };

    const columns = [
        { key: 'name', label: 'Nama', render: (row) => <span className="font-medium text-deep">{row.name}</span> },
        { key: 'description', label: 'Deskripsi', render: (row) => <span className="text-steel text-xs">{row.description || '-'}</span> },
        { key: 'products_count', label: 'Produk', align: 'right', mono: true, render: (row) => row.products_count },
    ];

    return (
        <AppLayout title="Kategori">
            <div className="page-header">
                <div className="w-64">
                    <SearchFilter value={search} onChange={handleSearch} placeholder="Cari kategori..." />
                </div>
                <Link href={route('categories.create')} className="btn-primary">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Tambah Kategori
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={categories.data}
                emptyMessage="Belum ada kategori"
                actions={(row) => (
                    <div className="flex items-center justify-end gap-1">
                        <Link href={route('categories.edit', row.id)} className="btn-ghost text-xs px-2 py-1">Edit</Link>
                        {canDeleteCategories() && (
                            <button onClick={() => setDeleteDialog({ open: true, id: row.id, name: row.name })} className="btn-ghost text-xs px-2 py-1 text-red-500 hover:text-red-700">Hapus</button>
                        )}
                    </div>
                )}
            />

            <Pagination links={categories.links} />

            <ConfirmDialog
                open={deleteDialog.open}
                title="Hapus Kategori"
                message={`Yakin ingin hapus kategori "${deleteDialog.name}"? Kategori yang masih memiliki produk tidak dapat dihapus.`}
                confirmText="Hapus"
                danger
                onConfirm={() => { router.delete(route('categories.destroy', deleteDialog.id)); setDeleteDialog({ open: false, id: null, name: '' }); }}
                onCancel={() => setDeleteDialog({ open: false, id: null, name: '' })}
            />
        </AppLayout>
    );
}
