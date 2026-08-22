import AppLayout from '@/Components/AppLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Create({ products }) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        type: 'in',
        quantity: '',
        note: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('transactions.store'));
    };

    const selectedProduct = products.find((p) => p.id == data.product_id);

    return (
        <AppLayout title="Transaksi Baru">
            <div className="max-w-lg mx-auto">
                <form onSubmit={submit} className="card p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Produk <span className="text-red-500">*</span></label>
                        <select value={data.product_id} onChange={(e) => setData('product_id', e.target.value)} className="input-field">
                            <option value="">Pilih Produk</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock_quantity})</option>
                            ))}
                        </select>
                        {errors.product_id && <p className="text-xs text-red-500 mt-1">{errors.product_id}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Tipe Transaksi <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-3 gap-2">
                            {['in', 'out', 'adjustment'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setData('type', type)}
                                    className={`py-2 text-sm font-medium rounded-sm border transition-colors ${
                                        data.type === type
                                            ? type === 'in' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : type === 'out' ? 'bg-red-50 border-red-300 text-red-700' : 'bg-blue-50 border-blue-300 text-blue-700'
                                            : 'bg-white border-line text-steel hover:bg-chalk'
                                    }`}
                                >
                                    {type === 'in' ? 'Stok Masuk' : type === 'out' ? 'Stok Keluar' : 'Penyesuaian'}
                                </button>
                            ))}
                        </div>
                        {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Jumlah <span className="text-red-500">*</span></label>
                        <input type="number" value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} className="input-field font-mono" min="1" placeholder="0" />
                        {selectedProduct && <p className="text-xs text-steel mt-1">Stok saat ini: {selectedProduct.stock_quantity}</p>}
                        {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Catatan</label>
                        <textarea value={data.note} onChange={(e) => setData('note', e.target.value)} className="input-field" rows={3} placeholder="Catatan transaksi..." />
                        {errors.note && <p className="text-xs text-red-500 mt-1">{errors.note}</p>}
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-sm p-3">
                        <p className="text-xs text-amber-800">Transaksi baru akan berstatus <strong>Pending</strong> dan menunggu persetujuan Manager/Admin.</p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button type="submit" disabled={processing} className="btn-primary">{processing ? 'Mengirim...' : 'Buat Transaksi'}</button>
                        <Link href={route('transactions.index')} className="btn-secondary">Batal</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
