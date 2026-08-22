import AppLayout from '@/Components/AppLayout';
import { useState, useCallback, useRef, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, LabelList,
    PieChart, Pie,
} from 'recharts';

const C = {
    ink: '#1B2A3B',
    primary: '#004ac6',
    primaryMuted: '#DBEAFE',
    danger: '#DC2626',
    warning: '#D97706',
    accent: '#0EA5E9',
    gray: '#6B7280',
    border: '#D1D5DB',
    surface: '#F7F8FA',
    panel: '#FFFFFF',
    muted: '#737686',
};

const MONO = "'IBM Plex Mono', monospace";
const SANS = "'IBM Plex Sans', sans-serif";

function PanelHeader({ title, subtitle, children }) {
    return (
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: `1px solid ${C.border}` }}>
            <div>
                <h2 style={{ fontFamily: MONO, fontSize: '18px', fontWeight: 600, color: C.ink }}>{title}</h2>
                {subtitle && <p style={{ fontFamily: SANS, fontSize: '12px', color: C.muted, marginTop: '2px' }}>{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2">
                {children}
            </div>
        </div>
    );
}
function LineChartPanel({ data }) {
    const [lines, setLines] = useState({ in: true, out: true, net: false });
    const toggle = useCallback((k) => setLines((p) => ({ ...p, [k]: !p[k] })), []);

    const legend = [
        { key: 'in', label: 'MASUK', color: C.primary },
        { key: 'out', label: 'KELUAR', color: C.danger },
        { key: 'net', label: 'NET', color: C.gray },
    ];

    return (
        <div className="bg-white flex flex-col" style={{ borderRadius: '4px', border: `1px solid ${C.border}` }}>
            <PanelHeader title="Tren Stok 30 Hari" subtitle="Perbandingan stok masuk dan keluar selama 30 hari terakhir">
                <div className="flex items-center gap-0.5 p-0.5" style={{ border: `1px solid ${C.border}`, borderRadius: '4px' }}>
                    {legend.map((l) => (
                        <button
                            key={l.key}
                            onClick={() => toggle(l.key)}
                            className="px-2 py-0.5 transition-colors cursor-pointer"
                            style={{
                                fontFamily: MONO,
                                fontSize: '10px',
                                letterSpacing: '0.05em',
                                borderRadius: '2px',
                                background: lines[l.key] ? C.ink : 'transparent',
                                color: lines[l.key] ? '#fff' : C.muted,
                            }}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
            </PanelHeader>
            <div className="flex-1 px-3 pt-3 pb-2" style={{ minHeight: '320px' }}>
                <ResponsiveContainer width="100%" height={290}>
                    <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fontFamily: MONO, fill: C.gray }}
                            tickLine={false}
                            axisLine={{ stroke: C.border }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fontSize: 10, fontFamily: MONO, fill: C.gray }}
                            tickLine={false}
                            axisLine={false}
                            width={40}
                            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : v}
                        />
                        <Tooltip
                            contentStyle={{ fontFamily: MONO, fontSize: '11px', border: `1px solid ${C.border}`, borderRadius: '2px', boxShadow: 'none', background: C.panel }}
                            formatter={(v, name) => [`${v.toLocaleString('id-ID')} pcs`, name === 'in' ? 'Masuk' : name === 'out' ? 'Keluar' : 'Net']}
                            labelStyle={{ fontFamily: MONO, fontSize: '10px', color: C.muted }}
                        />
                        {lines.in && <Line type="monotone" dataKey="in" stroke={C.primary} strokeWidth={1.5} dot={false} activeDot={{ r: 3, fill: C.primary, strokeWidth: 0 }} />}
                        {lines.out && <Line type="monotone" dataKey="out" stroke={C.danger} strokeWidth={1.5} dot={false} activeDot={{ r: 3, fill: C.danger, strokeWidth: 0 }} />}
                        {lines.net && <Line type="monotone" dataKey="net" stroke={C.gray} strokeWidth={1} dot={false} activeDot={{ r: 3, fill: C.gray, strokeWidth: 0 }} strokeDasharray="4 3" />}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
function BarChartPanel({ data }) {
    const [mode, setMode] = useState('total');

    return (
        <div className="bg-white flex flex-col" style={{ borderRadius: '4px', border: `1px solid ${C.border}` }}>
            <PanelHeader title="Top 10 Produk" subtitle="Produk dengan volume transaksi tertinggi">
                <div className="flex items-center p-0.5" style={{ border: `1px solid ${C.border}`, borderRadius: '4px' }}>
                    {[{ key: 'total', label: 'TOTAL' }, { key: 'in', label: 'MASUK' }, { key: 'out', label: 'KELUAR' }].map((opt) => (
                        <button
                            key={opt.key}
                            onClick={() => setMode(opt.key)}
                            className="px-2 py-0.5 transition-colors cursor-pointer"
                            style={{
                                fontFamily: MONO,
                                fontSize: '10px',
                                letterSpacing: '0.05em',
                                borderRadius: '2px',
                                background: mode === opt.key ? C.ink : 'transparent',
                                color: mode === opt.key ? '#fff' : C.muted,
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </PanelHeader>
            <div className="flex-1 px-3 pt-3 pb-2" style={{ minHeight: '340px' }}>
                <ResponsiveContainer width="100%" height={310}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 4, right: 50, left: 4, bottom: 4 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                        <XAxis
                            type="number"
                            tick={{ fontSize: 10, fontFamily: MONO, fill: C.gray }}
                            tickLine={false}
                            axisLine={{ stroke: C.border }}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            width={155}
                            tick={{ fontSize: 9, fontFamily: MONO, fill: C.ink }}
                        />
                        <Tooltip
                            contentStyle={{ fontFamily: MONO, fontSize: '11px', border: `1px solid ${C.border}`, borderRadius: '2px', boxShadow: 'none', background: C.panel }}
                            formatter={(v, name) => [`${v.toLocaleString('id-ID')} unit`, name === 'in' ? 'Masuk' : name === 'out' ? 'Keluar' : 'Total']}
                            cursor={{ fill: C.surface }}
                        />
                        <Bar dataKey={mode} barSize={14} radius={[0, 2, 2, 0]}>
                            {data.map((_, i) => (
                                <Cell key={i} fill={C.ink} fillOpacity={0.85} />
                            ))}
                            <LabelList
                                dataKey={mode}
                                position="right"
                                style={{ fontFamily: MONO, fontSize: '10px', fill: C.gray }}
                                formatter={(v) => v.toLocaleString('id-ID')}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
function HeatmapPanel({ data }) {
    const dayLabels = ['', 'Sen', '', 'Rab', '', 'Jum', ''];
    const maxCount = Math.max(...data.map((d) => d.count), 1);

    const getColor = (count) => {
        if (count === 0) return C.surface;
        const ratio = count / maxCount;
        if (ratio <= 0.25) return '#DBEAFE';
        if (ratio <= 0.5) return '#93C5FD';
        if (ratio <= 0.75) return C.primary;
        return '#003A99';
    };

    const weeks = [];
    let currentWeek = [];
    data.forEach((d, i) => {
        currentWeek.push(d);
        if (d.day === 6 || i === data.length - 1) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    const cell = 18;
    const gap = 3;

    return (
        <div className="bg-white flex flex-col" style={{ borderRadius: '4px', border: `1px solid ${C.border}` }}>
            <PanelHeader title="Heatmap Harian" subtitle="Jumlah transaksi harian dalam format kalender">
                <div className="flex items-center gap-1" style={{ fontFamily: MONO, fontSize: '9px' }}>
                    <span style={{ color: C.muted }}>0</span>
                    {[C.surface, '#DBEAFE', '#93C5FD', C.primary, '#003A99'].map((c, i) => (
                        <span key={i} style={{ width: cell, height: cell, backgroundColor: c, borderRadius: '1px', border: c === C.surface ? `1px solid ${C.border}` : 'none', display: 'inline-block' }} />
                    ))}
                    <span style={{ color: C.muted }}>{maxCount}</span>
                </div>
            </PanelHeader>
            <div className="flex-1 px-5 py-4 overflow-x-auto flex justify-center items-center" style={{ minHeight: '300px' }}>
                <div className="flex gap-0">
                    <div className="flex flex-col mr-1.5" style={{ paddingTop: cell + gap + 16 }}>
                        {dayLabels.map((label, i) => (
                            <div key={i} style={{ fontFamily: MONO, fontSize: '9px', color: C.gray, height: cell, lineHeight: `${cell}px`, marginBottom: gap }}>
                                {label}
                            </div>
                        ))}
                    </div>
                    {weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col">
                            <div className="text-center mb-1" style={{ fontFamily: MONO, fontSize: '9px', color: C.gray, height: 14, lineHeight: '14px' }}>
                                {wi % 4 === 0 && week[0]?.date ? new Date(week[0].date + 'T00:00:00').toLocaleDateString('id-ID', { month: 'short' }) : ''}
                            </div>
                            {Array.from({ length: 7 }, (_, di) => {
                                const entry = week.find((w) => w.day === di);
                                if (!entry) return <div key={di} style={{ width: cell, height: cell, marginBottom: gap }} />;
                                return (
                                    <div key={di} className="group/cell relative" style={{ width: cell, height: cell, marginBottom: gap }}>
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: getColor(entry.count),
                                                borderRadius: '1px',
                                                border: entry.count === 0 ? `1px solid ${C.border}` : 'none',
                                            }}
                                        />
                                        <div
                                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-[#1B2A3B] text-white whitespace-nowrap opacity-0 group-hover/cell:opacity-100 transition-opacity pointer-events-none z-20"
                                            style={{ fontFamily: MONO, fontSize: '9px', borderRadius: '2px' }}
                                        >
                                            {new Date(entry.date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}: {entry.count} trs
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
function DonutChartPanel({ data }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    const chartRef = useRef(null);
    const legendRef = useRef(null);

    const handleHover = useCallback((index) => {
        if (!chartRef.current || !legendRef.current) return;
        const paths = chartRef.current.querySelectorAll('.recharts-pie-sector path');
        const legendItems = legendRef.current.children;

        paths.forEach((path, i) => {
            path.style.transition = 'opacity 200ms ease, transform 200ms ease';
            path.style.transformOrigin = 'center';
            if (index === null) {
                path.style.opacity = '1';
                path.style.transform = '';
            } else if (i === index) {
                path.style.opacity = '1';
                path.style.transform = 'scale(1.04)';
            } else {
                path.style.opacity = '0.3';
                path.style.transform = '';
            }
        });

        Array.from(legendItems).forEach((item, i) => {
            item.style.transition = 'opacity 200ms ease';
            if (index === null) {
                item.style.opacity = '1';
            } else if (i === index) {
                item.style.opacity = '1';
            } else {
                item.style.opacity = '0.3';
            }
        });
    }, [data]);

    const renderCenter = ({ viewBox }) => {
        const { cx, cy } = viewBox;
        return (
            <g>
                <text x={cx} y={cy - 4} textAnchor="middle" style={{ fontFamily: MONO, fontSize: '24px', fontWeight: 700, fill: C.ink }}>{total.toLocaleString('id-ID')}</text>
                <text x={cx} y={cy + 14} textAnchor="middle" style={{ fontFamily: SANS, fontSize: '11px', fill: C.muted }}>Total Stok</text>
            </g>
        );
    };

    return (
        <div className="bg-white flex flex-col" style={{ borderRadius: '4px', border: `1px solid ${C.border}` }}>
            <PanelHeader title="Distribusi Stok" subtitle="Proporsi stok berdasarkan kategori produk" />
            <div className="flex-1 px-4 py-4 flex items-center justify-center" style={{ minHeight: '320px' }}>
                <div className="flex items-center gap-8">
                    <div ref={chartRef} className="flex justify-center" style={{ width: '220px' }}>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Tooltip
                                    content={({ payload }) => {
                                        if (!payload || !payload.length) return null;
                                        const d = payload[0].payload;
                                        return (
                                            <div style={{ fontFamily: MONO, fontSize: '11px', background: C.panel, border: `1px solid ${C.border}`, borderRadius: '2px', padding: '8px 10px', boxShadow: 'none' }}>
                                                <div style={{ color: C.ink, fontWeight: 600, marginBottom: '4px' }}>{d.name}</div>
                                                <div style={{ color: C.gray }}>{d.value.toLocaleString('id-ID')} unit · {d.percentage}%</div>
                                            </div>
                                        );
                                    }}
                                />
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Pie data={[{ v: 1 }]} dataKey="v" cx="50%" cy="50%" innerRadius={0} outerRadius={0} isAnimationActive={false} content={renderCenter} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div ref={legendRef} className="shrink-0 space-y-2.5" style={{ width: '140px' }}>
                        {data.map((d, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 cursor-pointer"
                                style={{ fontFamily: MONO, fontSize: '11px' }}
                                onMouseEnter={() => handleHover(i)}
                                onMouseLeave={() => handleHover(null)}
                            >
                                <span style={{ width: 8, height: 8, backgroundColor: d.color, borderRadius: '1px', flexShrink: 0 }} />
                                <span className="truncate" style={{ color: C.muted, flex: 1 }}>{d.name}</span>
                                <span style={{ color: C.ink, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{d.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default function Index({ lineChart, topProducts, heatmap, categoryDistribution }) {
    return (
        <AppLayout title="Analitik">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <LineChartPanel data={lineChart} />
                <BarChartPanel data={topProducts} />
                <HeatmapPanel data={heatmap} />
                <DonutChartPanel data={categoryDistribution} />
            </div>
        </AppLayout>
    );
}
