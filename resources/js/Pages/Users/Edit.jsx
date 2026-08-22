import AppLayout from '@/Components/AppLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Edit({ editUser }) {
    const { data, setData, put, processing, errors } = useForm({
        name: editUser.name,
        email: editUser.email,
        password: '',
        password_confirmation: '',
        role: editUser.role,
        is_active: editUser.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('users.update', editUser.id));
    };

    return (
        <AppLayout title="Edit User">
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
                            <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Password Baru</label>
                            <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="input-field" placeholder="Kosongkan jika tidak diubah" />
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Konfirmasi Password</label>
                            <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="input-field" placeholder="Ulangi password" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                        <div>
                            <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Status</label>
                            <select value={data.is_active ? '1' : '0'} onChange={(e) => setData('is_active', e.target.value === '1')} className="input-field">
                                <option value="1">Aktif</option>
                                <option value="0">Nonaktif</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <button type="submit" disabled={processing} className="btn-primary">{processing ? 'Menyimpan...' : 'Perbarui'}</button>
                        <Link href={route('users.index')} className="btn-secondary">Batal</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
