import { Link } from '@inertiajs/react';

export default function DataTable({ columns, data, emptyMessage = 'Tidak ada data', actions }) {
    return (
        <div className="table-container">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="table-header">
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className={`px-4 py-3 text-left text-xs font-medium text-steel uppercase tracking-wider ${col.align === 'right' ? 'text-right' : ''} ${col.className || ''}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                            {actions && (
                                <th className="px-4 py-3 text-right text-xs font-medium text-steel uppercase tracking-wider w-[120px]">
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-16 text-center text-steel">
                                    <div className="flex flex-col items-center">
                                        <svg className="w-12 h-12 text-line mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                        </svg>
                                        <p className="text-sm">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr key={row.id || rowIndex} className="table-row group">
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : ''} ${col.className || ''} ${col.mono ? 'font-mono tabular-nums' : ''}`}
                                        >
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-4 py-3 text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                            {actions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    const currentPage = links.find(l => l.active);
    const lastPage = links[links.length - 2];

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-line bg-chalk/50">
            <div className="text-xs text-steel">
                {currentPage && lastPage && (
                    <span>Halaman <span className="font-medium text-deep">{currentPage.label}</span> dari <span className="font-medium text-deep">{lastPage.label}</span></span>
                )}
            </div>
            <div className="flex items-center gap-1">
                {links.map((link, i) => (
                    <Link
                        key={i}
                        href={link.url || '#'}
                        className={`min-w-[32px] h-8 inline-flex items-center justify-center px-2 text-xs font-medium rounded-sm transition-colors ${
                            link.active
                                ? 'bg-primary text-white'
                                : link.url
                                    ? 'text-steel hover:bg-chalk border border-line'
                                    : 'text-gray-300 cursor-not-allowed'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}

export function SearchFilter({ value, onChange, placeholder = 'Cari...' }) {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="input-field pl-10"
            />
        </div>
    );
}
