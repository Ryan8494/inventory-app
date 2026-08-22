import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const MONO = "'IBM Plex Mono', sans-serif";

const config = {
    success: {
        bg: '#F0FDF4',
        border: '#BBF7D0',
        accent: '#16A34A',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        ),
    },
    error: {
        bg: '#FEF2F2',
        border: '#FECACA',
        accent: '#DC2626',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        ),
    },
    warning: {
        bg: '#FFFBEB',
        border: '#FDE68A',
        accent: '#D97706',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        ),
    },
};

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
        } else if (flash?.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
        } else if (flash?.warning) {
            setMessage(flash.warning);
            setType('warning');
            setVisible(true);
        }
    }, [flash]);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => setVisible(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible || !message) return null;

    const c = config[type];

    return (
        <div
            className="flex items-center justify-between mb-4"
            style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderLeft: `3px solid ${c.accent}`,
                borderRadius: '4px',
                padding: '10px 14px',
            }}
        >
            <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    {c.icon}
                </svg>
                <span style={{ fontFamily: MONO, fontSize: '13px', color: '#1B2A3B' }}>{message}</span>
            </div>
            <button onClick={() => setVisible(false)} className="shrink-0 p-1 rounded-sm" style={{ color: '#6B7280' }}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
