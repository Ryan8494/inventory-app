import AppLayout from '@/Components/AppLayout';
import { useState } from 'react';

const STATUS_CONFIG = {
    optimal:  { color: '#6B7280', label: 'Optimal',    bg: 'bg-gray-500' },
    reorder:  { color: '#D97706', label: 'Restock',    bg: 'bg-amber-600' },
    critical: { color: '#DC2626', label: 'Kritis',     bg: 'bg-red-600' },
    incoming: { color: '#0EA5E9', label: 'Masuk',      bg: 'bg-sky-500' },
    empty:    { color: '#1B2A3B', label: 'Kosong',     bg: 'bg-[#1B2A3B]' },
};

const ROWS = ['A', 'B', 'C', 'D'];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];

function Tooltip({ zone, position }) {
    if (!zone) return null;

    const cfg = STATUS_CONFIG[zone.status];

    return (
        <div
            className="fixed z-50 pointer-events-none"
            style={{ left: position.x + 12, top: position.y - 8 }}
        >
            <div className="bg-[#1B2A3B] text-white border border-white/10 p-3 min-w-[200px]" style={{ borderRadius: '2px' }}>
                <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-base tracking-wide">{zone.id}</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5" style={{ backgroundColor: cfg.color + '33', color: cfg.color, borderRadius: '2px' }}>
                        {cfg.label}
                    </span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                        <span className="text-white/50">Jumlah SKU</span>
                        <span className="text-white font-semibold tabular-nums">{zone.sku_count}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/50">Total Stok</span>
                        <span className="text-white font-semibold tabular-nums">{zone.total_stock.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/50">Kapasitas</span>
                        <span className="font-semibold tabular-nums" style={{ color: cfg.color }}>{zone.capacity}%</span>
                    </div>
                    {zone.pending_incoming > 0 && (
                        <div className="flex justify-between">
                            <span className="text-white/50">Masuk</span>
                            <span className="text-sky-400 font-semibold tabular-nums">{zone.pending_incoming}</span>
                        </div>
                    )}
                </div>

                {zone.products.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Barang</div>
                        <div className="space-y-0.5">
                            {zone.products.slice(0, 4).map((p) => (
                                <div key={p.id} className="flex justify-between text-[11px] font-mono">
                                    <span className="text-white/70 truncate max-w-[120px]">{p.sku}</span>
                                    <span className="text-white tabular-nums ml-3">{p.stock}</span>
                                </div>
                            ))}
                            {zone.products.length > 4 && (
                                <div className="text-[10px] text-white/40 font-mono">+{zone.products.length - 4} lagi</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Index({ zones, summary }) {
    const [hovered, setHovered] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const zoneMap = {};
    zones.forEach((z) => { zoneMap[z.id] = z; });

    const handleMouseMove = (e) => {
        setTooltipPos({ x: e.clientX, y: e.clientY });
    };

    const cellW = 100;
    const cellH = 80;
    const gap = 4;
    const padX = 48;
    const padY = 40;
    const svgW = padX + COLS.length * (cellW + gap) - gap + 16;
    const svgH = padY + ROWS.length * (cellH + gap) - gap + 16;

    return (
        <AppLayout title="Denah Gudang">
            <div className="flex gap-6 items-start">

                <div className="w-56 shrink-0 space-y-5">

                    <div>
                        <h3 className="text-[10px] font-heading font-semibold text-[#1B2A3B] uppercase tracking-widest mb-3">Legenda Zona</h3>
                        <div className="space-y-1.5">
                            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                <div key={key} className="flex items-center gap-2.5">
                                    <div className="w-4 h-3 shrink-0" style={{ backgroundColor: cfg.color, borderRadius: '2px' }} />
                                    <span className="text-xs font-heading text-[#1B2A3B]">{cfg.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-[#E2E8F0] pt-4">
                        <h3 className="text-[10px] font-heading font-semibold text-[#1B2A3B] uppercase tracking-widest mb-3">Ringkasan</h3>
                        <div className="space-y-2 text-xs font-mono">
                            <div className="flex justify-between">
                                <span className="text-[#64748B]">Total Zona</span>
                                <span className="text-[#1B2A3B] font-semibold tabular-nums">{summary.total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#64748B]">Terisi</span>
                                <span className="text-[#1B2A3B] font-semibold tabular-nums">{summary.occupied}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#64748B]">Kosong</span>
                                <span className="text-[#1B2A3B] font-semibold tabular-nums">{summary.empty}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#64748B]">Total SKU</span>
                                <span className="text-[#1B2A3B] font-semibold tabular-nums">{summary.totalSkus}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#64748B]">Total Stok</span>
                                <span className="text-[#1B2A3B] font-semibold tabular-nums">{summary.totalStock.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#64748B]">Rata-rata Kapasitas</span>
                                <span className="text-[#1B2A3B] font-semibold tabular-nums">{summary.avgCapacity}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-[#E2E8F0] pt-4">
                        <h3 className="text-[10px] font-heading font-semibold text-[#1B2A3B] uppercase tracking-widest mb-3">Jumlah Status</h3>
                        <div className="space-y-1.5">
                            {[
                                { key: 'optimal',  count: summary.optimal,  color: STATUS_CONFIG.optimal.color },
                                { key: 'reorder',  count: summary.reorder,  color: STATUS_CONFIG.reorder.color },
                                { key: 'critical', count: summary.critical, color: STATUS_CONFIG.critical.color },
                                { key: 'incoming', count: summary.incoming, color: STATUS_CONFIG.incoming.color },
                                { key: 'empty',    count: summary.empty,    color: STATUS_CONFIG.empty.color },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5" style={{ backgroundColor: item.color, borderRadius: '1px' }} />
                                        <span className="text-xs font-heading text-[#1B2A3B]">{STATUS_CONFIG[item.key].label}</span>
                                    </div>
                                    <span className="text-xs font-mono font-semibold text-[#1B2A3B] tabular-nums">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="bg-[#F7F8FA] border border-[#E2E8F0] p-4 overflow-x-auto" style={{ borderRadius: '4px' }}>

                        <svg
                            viewBox={`0 0 ${svgW} ${svgH}`}
                            className="w-full"
                            style={{ minWidth: '600px', fontFamily: "'IBM Plex Mono', monospace" }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => setHovered(null)}
                        >
                            {COLS.map((col, ci) => (
                                <text
                                    key={`col-${col}`}
                                    x={padX + ci * (cellW + gap) + cellW / 2}
                                    y={padY - 12}
                                    textAnchor="middle"
                                    className="text-[11px] font-mono font-semibold"
                                    fill="#1B2A3B"
                                >
                                    {col}
                                </text>
                            ))}

                            {ROWS.map((row, ri) => (
                                <text
                                    key={`row-${row}`}
                                    x={padX - 20}
                                    y={padY + ri * (cellH + gap) + cellH / 2 + 4}
                                    textAnchor="middle"
                                    className="text-[11px] font-mono font-semibold"
                                    fill="#1B2A3B"
                                >
                                    {row}
                                </text>
                            ))}

                            {ROWS.map((row, ri) =>
                                COLS.map((col, ci) => {
                                    const zoneId = row + col;
                                    const zone = zoneMap[zoneId];
                                    const cfg = STATUS_CONFIG[zone?.status || 'empty'];
                                    const x = padX + ci * (cellW + gap);
                                    const y = padY + ri * (cellH + gap);
                                    const isHovered = hovered?.id === zoneId;

                                    return (
                                        <g
                                            key={zoneId}
                                            onMouseEnter={() => setHovered(zone)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <rect
                                                x={x}
                                                y={y}
                                                width={cellW}
                                                height={cellH}
                                                fill={cfg.color}
                                                opacity={isHovered ? 0.85 : 0.65}
                                                rx={2}
                                                ry={2}
                                                stroke={isHovered ? '#1B2A3B' : 'transparent'}
                                                strokeWidth={isHovered ? 2 : 0}
                                            />

                                            <text
                                                x={x + cellW / 2}
                                                y={y + 22}
                                                textAnchor="middle"
                                                className="text-[13px] font-mono font-bold"
                                                fill="white"
                                                style={{ pointerEvents: 'none' }}
                                            >
                                                {zoneId}
                                            </text>

                                            <text
                                                x={x + cellW / 2}
                                                y={y + 38}
                                                textAnchor="middle"
                                                className="text-[10px] font-mono"
                                                fill="rgba(255,255,255,0.6)"
                                                style={{ pointerEvents: 'none' }}
                                            >
                                                {zone?.sku_count || 0} SKU
                                            </text>

                                            <text
                                                x={x + cellW / 2}
                                                y={y + 52}
                                                textAnchor="middle"
                                                className="text-[10px] font-mono font-semibold"
                                                fill="white"
                                                style={{ pointerEvents: 'none' }}
                                            >
                                                {zone?.capacity || 0}%
                                            </text>

                                            {zone?.pending_incoming > 0 && (
                                                <circle
                                                    cx={x + cellW - 8}
                                                    cy={y + 8}
                                                    r={4}
                                                    fill="#0EA5E9"
                                                    stroke="#1B2A3B"
                                                    strokeWidth={1}
                                                    style={{ pointerEvents: 'none' }}
                                                />
                                            )}
                                        </g>
                                    );
                                })
                            )}

                            <text
                                x={svgW / 2}
                                y={svgH - 4}
                                textAnchor="middle"
                                className="text-[9px] font-mono uppercase tracking-[0.2em]"
                                fill="#94A3B8"
                            >
                                DENAH GUDANG
                            </text>
                        </svg>
                    </div>
                </div>
            </div>

            <Tooltip zone={hovered} position={tooltipPos} />
        </AppLayout>
    );
}
