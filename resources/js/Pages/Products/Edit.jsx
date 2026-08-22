import AppLayout from '@/Components/AppLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Edit({ product, categories, suppliers }) {
    const { data, setData, post, processing, errors } = useForm({
        name: product.name,
        sku: product.sku,
        category_id: product.category_id,
        supplier_id: product.supplier_id || '',
        buy_price: product.buy_price,
        sell_price: product.sell_price,
        stock_quantity: product.stock_quantity,
        min_stock: product.min_stock,
        photo: null,
        _method: 'put',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('products.update', product.id), { forceFormData: true });
    };

    return (
        <AppLayout title="Edit Produk">
            <div className="max-w-2xl mx-auto">
                <form onSubmit={submit} className="card p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Nama Produk <span className="text-red-500">*</span></label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="input-field" placeholder="Contoh: Mouse Logitech MX Master 3" />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">SKU <span className="text-red-500">*</span></label>
                            <input type="text" value={data.sku} onChange={(e) => setData('sku', e.target.value)} className="input-field font-mono" placeholder="ELEC-001" />
                            {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Foto Baru</label>
                            <input type="file" onChange={(e) => setData('photo', e.target.files[0])} className="input-field text-sm file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:bg-chalk file:text-steel hover:file:bg-line" accept="image/*" />
                            {product.photo && <p className="text-xs text-steel mt-1">Foto saat ini: {product.photo.split('/').pop()}</p>}
                            {errors.photo && <p className="text-xs text-red-500 mt-1">{errors.photo}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Kategori <span className="text-red-500">*</span></label>
                            <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} className="input-field">
                                <option value="">Pilih Kategori</option>
                                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Supplier</label>
                            <select value={data.supplier_id} onChange={(e) => setData('supplier_id', e.target.value)} className="input-field">
                                <option value="">Pilih Supplier</option>
                                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.supplier_id && <p className="text-xs text-red-500 mt-1">{errors.supplier_id}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Harga Beli <span className="text-red-500">*</span></label>
                            <input type="number" value={data.buy_price} onChange={(e) => setData('buy_price', e.target.value)} className="input-field font-mono" min="0" placeholder="0" />
                            {errors.buy_price && <p className="text-xs text-red-500 mt-1">{errors.buy_price}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Harga Jual <span className="text-red-500">*</span></label>
                            <input type="number" value={data.sell_price} onChange={(e) => setData('sell_price', e.target.value)} className="input-field font-mono" min="0" placeholder="0" />
                            {errors.sell_price && <p className="text-xs text-red-500 mt-1">{errors.sell_price}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Stok Saat Ini <span className="text-red-500">*</span></label>
                            <input type="number" value={data.stock_quantity} onChange={(e) => setData('stock_quantity', e.target.value)} className="input-field font-mono" min="0" placeholder="0" />
                            {errors.stock_quantity && <p className="text-xs text-red-500 mt-1">{errors.stock_quantity}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-steel uppercase tracking-wider mb-1">Stok Minimum</label>
                            <input type="number" value={data.min_stock} onChange={(e) => setData('min_stock', e.target.value)} className="input-field font-mono" min="0" placeholder="0" />
                            {errors.min_stock && <p className="text-xs text-red-500 mt-1">{errors.min_stock}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-line">
                        <button type="submit" disabled={processing} className="btn-primary">{processing ? 'Menyimpan...' : 'Perbarui'}</button>
                        <Link href={route('products.index')} className="btn-secondary">Batal</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
