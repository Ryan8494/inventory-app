import { useEffect, useRef } from 'react';

const MONO = "'IBM Plex Mono', monospace";
const SANS = "'IBM Plex Sans', sans-serif";

export default function ConfirmDialog({ open, title, message, confirmText = 'Konfirmasi', cancelText = 'Batal', danger = false, onConfirm, onCancel }) {
    const backdropRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e) => { if (e.key === 'Escape') onCancel(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onCancel]);

    if (!open) return null;

    const confirmBg = danger ? '#DC2626' : '#1B2A3B';
    const confirmHover = danger ? '#B91C1C' : '#0F172A';

    return (
        <div
            ref={backdropRef}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)' }}
            onClick={(e) => { if (e.target === backdropRef.current) onCancel(); }}
        >
            <div
                className="w-full max-w-sm"
                style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '24px' }}
            >
                <h3 style={{ fontFamily: MONO, fontSize: '16px', fontWeight: 600, color: '#1B2A3B', marginBottom: '8px' }}>
                    {title}
                </h3>
                <p style={{ fontFamily: SANS, fontSize: '13px', color: '#6B7280', marginBottom: '20px', lineHeight: '1.5' }}>
                    {message}
                </p>
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                        style={{ fontFamily: MONO, border: '1px solid #D1D5DB', borderRadius: '4px', color: '#6B7280', background: 'transparent' }}
                        onMouseEnter={(e) => { e.target.style.background = '#F7F8FA'; e.target.style.color = '#1B2A3B'; }}
                        onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#6B7280'; }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-3 py-1.5 text-xs font-medium text-white transition-colors cursor-pointer"
                        style={{ fontFamily: MONO, background: confirmBg, borderRadius: '4px', border: 'none' }}
                        onMouseEnter={(e) => { e.target.style.background = confirmHover; }}
                        onMouseLeave={(e) => { e.target.style.background = confirmBg; }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
