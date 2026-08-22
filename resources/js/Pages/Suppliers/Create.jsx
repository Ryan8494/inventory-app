import AppLayout from '@/Components/AppLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('suppliers.store'));
    };

    return (
        <AppLayout title="Tambah Supplier">
            <div className="max-w-lg mx-auto">
                <form onSubmit={submit} className="card p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Nama Supplier <span className="text-red-500">*</span></label>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="input-field" placeholder="PT Supplier Jaya" />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Email</label>
                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="input-field" placeholder="email@supplier.com" />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Telepon</label>
                            <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className="input-field" placeholder="08123456789" />
                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Alamat</label>
                        <textarea value={data.address} onChange={(e) => setData('address', e.target.value)} className="input-field" rows={3} placeholder="Alamat lengkap supplier..." />
                        {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Status</label>
                        <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="input-field">
                            <option value="active">Aktif</option>
                            <option value="inactive">Nonaktif</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <button type="submit" disabled={processing} className="btn-primary">{processing ? 'Menyimpan...' : 'Simpan'}</button>
                        <Link href={route('suppliers.index')} className="btn-secondary">Batal</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
