import AppLayout from '@/Components/AppLayout';
import { StatusBadge, TypeBadge } from '@/Components/StatusBadge';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Link, router } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import { useState } from 'react';

export default function Show({ transaction }) {
    const { canApproveTransactions } = usePermission();
    const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '' });

    const statusLabels = {
        pending: 'Menunggu Persetujuan',
        approved: 'Disetujui',
        rejected: 'Ditolak',
    };

    return (
        <AppLayout title="Detail Transaksi">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading font-semibold text-deep">Transaksi #{transaction.id}</h3>
                        <StatusBadge status={transaction.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-steel text-xs uppercase tracking-wider">Produk</span>
                            <p className="font-medium text-deep mt-0.5">{transaction.product?.name}</p>
                            <p className="text-xs text-steel font-mono">{transaction.product?.sku}</p>
                        </div>
                        <div>
                            <span className="text-steel text-xs uppercase tracking-wider">Tipe</span>
                            <div className="mt-0.5"><TypeBadge type={transaction.type} /></div>
                        </div>
                        <div>
                            <span className="text-steel text-xs uppercase tracking-wider">Jumlah</span>
                            <p className="font-mono font-bold text-deep text-lg tabular-nums mt-0.5">{transaction.quantity}</p>
                        </div>
                        <div>
                            <span className="text-steel text-xs uppercase tracking-wider">Diajukan Oleh</span>
                            <p className="text-deep mt-0.5">{transaction.user?.name}</p>
                        </div>
                        <div className="col-span-2">
                            <span className="text-steel text-xs uppercase tracking-wider">Catatan</span>
                            <p className="text-deep mt-0.5">{transaction.note || '-'}</p>
                        </div>
                        <div>
                            <span className="text-steel text-xs uppercase tracking-wider">Tanggal</span>
                            <p className="text-deep mt-0.5">{new Date(transaction.created_at).toLocaleString('id-ID')}</p>
                        </div>
                        {transaction.approver && (
                            <div>
                                <span className="text-steel text-xs uppercase tracking-wider">Disetujui Oleh</span>
                                <p className="text-deep mt-0.5">{transaction.approver?.name}</p>
                                <p className="text-xs text-steel">{transaction.approved_at ? new Date(transaction.approved_at).toLocaleString('id-ID') : '-'}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href={route('transactions.index')} className="btn-secondary">Kembali</Link>
                    {transaction.status === 'pending' && canApproveTransactions() && (
                        <>
                            <button onClick={() => setConfirmDialog({ open: true, action: 'approve' })} className="btn-primary bg-emerald-600 hover:bg-emerald-700">Setujui</button>
                            <button onClick={() => setConfirmDialog({ open: true, action: 'reject' })} className="btn-danger">Tolak</button>
                        </>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.action === 'approve' ? 'Setujui Transaksi' : 'Tolak Transaksi'}
                message={confirmDialog.action === 'approve' ? 'Setujui transaksi ini?' : 'Tolak transaksi ini?'}
                confirmText={confirmDialog.action === 'approve' ? 'Setujui' : 'Tolak'}
                danger={confirmDialog.action === 'reject'}
                onConfirm={() => {
                    if (confirmDialog.action === 'approve') router.post(route('transactions.approve', transaction.id));
                    else router.post(route('transactions.reject', transaction.id));
                    setConfirmDialog({ open: false, action: '' });
                }}
                onCancel={() => setConfirmDialog({ open: false, action: '' })}
            />
        </AppLayout>
    );
}
