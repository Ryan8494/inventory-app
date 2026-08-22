import { useState, useRef, useEffect } from 'react';

const MONO = "'IBM Plex Mono', monospace";
const SANS = "'IBM Plex Sans', sans-serif";

function FilterIcon({ active }) {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? '#004ac6' : '#6B7280'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
        </svg>
    );
}

export default function FilterDropdown({ filters, values = {}, onApply, onReset, label = 'Filter' }) {
    const [open, setOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [localValues, setLocalValues] = useState(values);
    const ref = useRef(null);

    useEffect(() => {
        setLocalValues(values);
    }, [values]);

    useEffect(() => {
        if (!open) return;
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const hasActiveFilters = Object.values(values).some((v) => v !== '' && v !== null && v !== undefined && String(v).trim() !== '');

    const handleApply = () => {
        onApply(localValues);
        setOpen(false);
        setSelectedCard(null);
    };

    const handleReset = () => {
        const empty = {};
        filters.forEach((f) => { empty[f.key] = ''; });
        setLocalValues(empty);
        onReset();
        setOpen(false);
        setSelectedCard(null);
    };

    return (
        <div ref={ref} className="relative inline-block">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 transition-all cursor-pointer"
                style={{
                    fontFamily: SANS,
                    fontSize: '13px',
                    fontWeight: 500,
                    padding: '6px 12px',
                    borderRadius: '4px',
                    background: open ? '#DBEAFE' : 'transparent',
                    color: open ? '#004ac6' : '#1B2A3B',
                    border: `1px solid ${open ? '#004ac6' : '#D1D5DB'}`,
                }}
            >
                <FilterIcon active={open} />
                {label}
{hasActiveFilters && !open && (
                <span className="inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white" style={{ background: '#004ac6', borderRadius: '2px' }}>
                    {Object.values(values).filter(v => v !== '' && v !== null && v !== undefined && String(v).trim() !== '').length}
                </span>
            )}
            </button>

            {open && (
                <div
                    className="absolute left-0 z-50"
                    style={{
                        top: 'calc(100% + 4px)',
                        width: '220px',
                        background: '#FFFFFF',
                        border: '1px solid #D1D5DB',
                        borderRadius: '4px',
                        padding: '12px',
                        animation: 'fadeIn 120ms ease-out',
                    }}
                >
                    <div
                        className="mb-2.5 pb-2"
                        style={{
                            fontFamily: MONO,
                            fontSize: '12px',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            color: '#737686',
                            textTransform: 'uppercase',
                            borderBottom: '1px solid #E1E2ED',
                        }}
                    >
                        Tambah Filter
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                        {filters.map((f) => {
                            const isActive = selectedCard === f.key;
                            const hasValue = !!localValues[f.key];
                            return (
                                <button
                                    key={f.key}
                                    onClick={() => setSelectedCard(isActive ? null : f.key)}
                                    className="flex flex-col items-center justify-center cursor-pointer transition-colors"
                                    style={{
                                        minHeight: '72px',
                                        padding: '12px 8px',
                                        gap: '6px',
                                        borderRadius: '4px',
                                        background: isActive ? '#DBEAFE' : '#F7F8FA',
                                        border: isActive ? '1px solid #004ac6' : '1px solid #E1E2ED',
                                        borderLeft: '1px solid #E1E2ED',
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#004ac6' : '#737686'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        {f.icon}
                                    </svg>
                                    <span
                                        style={{
                                            fontFamily: MONO,
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase',
                                            color: isActive ? '#004ac6' : '#737686',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {f.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {selectedCard && (
                        <div className="mt-2">
                            <div className="h-px my-2" style={{ background: '#E1E2ED' }} />
                            <div className="space-y-1">
                                {filters.find((f) => f.key === selectedCard)?.options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setLocalValues((prev) => {
                                            const newVal = prev[selectedCard] === opt.value ? '' : opt.value;
                                            const updated = { ...prev, [selectedCard]: newVal };
                                            const group = filters.find(f => f.key === selectedCard)?.group;
                                            if (group && newVal) {
                                                filters.forEach(f => {
                                                    if (f.key !== selectedCard && f.group === group) {
                                                        updated[f.key] = '';
                                                    }
                                                });
                                            }
                                            return updated;
                                        })}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-left transition-colors cursor-pointer"
                                        style={{
                                            fontFamily: SANS,
                                            fontSize: '12px',
                                            borderRadius: '4px',
                                            background: localValues[selectedCard] === opt.value ? '#DBEAFE' : 'transparent',
                                            color: localValues[selectedCard] === opt.value ? '#004ac6' : '#1B2A3B',
                                            border: 'none',
                                        }}
                                    >
                                        <span
                                            className="w-3.5 h-3.5 flex items-center justify-center shrink-0"
                                            style={{
                                                border: `1.5px solid ${localValues[selectedCard] === opt.value ? '#004ac6' : '#D1D5DB'}`,
                                                borderRadius: '2px',
                                                background: localValues[selectedCard] === opt.value ? '#004ac6' : 'transparent',
                                            }}
                                        >
                                            {localValues[selectedCard] === opt.value && (
                                                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </span>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div
                        className="flex items-center justify-between mt-2.5 pt-2.5"
                        style={{ borderTop: '1px solid #E1E2ED' }}
                    >
                        <button
                            onClick={handleReset}
                            className="transition-colors cursor-pointer"
                            style={{
                                fontFamily: SANS,
                                fontSize: '12px',
                                background: 'transparent',
                                border: 'none',
                                color: '#737686',
                                padding: '6px 0',
                            }}
                            onMouseEnter={(e) => { e.target.style.color = '#DC2626'; }}
                            onMouseLeave={(e) => { e.target.style.color = '#737686'; }}
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleApply}
                            className="transition-colors cursor-pointer"
                            style={{
                                fontFamily: SANS,
                                fontSize: '12px',
                                fontWeight: 600,
                                background: '#1B2A3B',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '6px 16px',
                            }}
                            onMouseEnter={(e) => { e.target.style.background = '#004ac6'; }}
                            onMouseLeave={(e) => { e.target.style.background = '#1B2A3B'; }}
                        >
                            Terapkan
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
