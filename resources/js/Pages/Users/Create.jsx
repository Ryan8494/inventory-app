import AppLayout from '@/Components/AppLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'staff',
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AppLayout title="Tambah User">
            <div className="max-w-lg mx-auto">
                <form onSubmit={submit} className="card p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Nama <span className="text-red-500">*</span></label>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="input-field" placeholder="Nama lengkap" />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Email <span className="text-red-500">*</span></label>
                        <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="input-field" placeholder="nama@email.com" />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Password <span className="text-red-500">*</span></label>
                            <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="input-field" placeholder="Minimal 8 karakter" />
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Konfirmasi Password <span className="text-red-500">*</span></label>
                            <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="input-field" placeholder="Ulangi password" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Role <span className="text-red-500">*</span></label>
                        <select value={data.role} onChange={(e) => setData('role', e.target.value)} className="input-field">
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="staff">Staff</option>
                            <option value="viewer">Viewer</option>
                        </select>
                        {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <button type="submit" disabled={processing} className="btn-primary">{processing ? 'Menyimpan...' : 'Simpan'}</button>
                        <Link href={route('users.index')} className="btn-secondary">Batal</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
