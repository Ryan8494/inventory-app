import AppLayout from '@/Components/AppLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Edit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        description: category.description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('categories.update', category.id));
    };

    return (
        <AppLayout title="Edit Kategori">
            <div className="max-w-lg mx-auto">
                <form onSubmit={submit} className="card p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Nama Kategori <span className="text-red-500">*</span></label>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="input-field" placeholder="Contoh: Elektronik" />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Deskripsi</label>
                        <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} className="input-field" rows={3} placeholder="Deskripsi singkat kategori..." />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button type="submit" disabled={processing} className="btn-primary">{processing ? 'Menyimpan...' : 'Perbarui'}</button>
                        <Link href={route('categories.index')} className="btn-secondary">Batal</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
