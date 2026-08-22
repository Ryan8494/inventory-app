import { Link, usePage } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';

const navigation = [
    {
        label: 'MENU',
        items: [
            { name: 'Dashboard', href: 'dashboard', icon: 'grid', roles: ['admin', 'manager', 'staff', 'viewer'] },
            { name: 'Produk', href: 'products.index', icon: 'box', roles: ['admin', 'manager', 'staff'] },
            { name: 'Kategori', href: 'categories.index', icon: 'tag', roles: ['admin', 'manager', 'staff'] },
            { name: 'Supplier', href: 'suppliers.index', icon: 'truck', roles: ['admin', 'manager'] },
            { name: 'Gudang', href: 'warehouse.index', icon: 'warehouse', roles: ['admin', 'manager', 'staff'] },
        ],
    },
    {
        label: 'TRANSAKSI',
        items: [
            { name: 'Stok', href: 'transactions.index', icon: 'exchange', roles: ['admin', 'manager', 'staff'] },
        ],
    },
    {
        label: 'SISTEM',
        items: [
            { name: 'Laporan', href: 'reports.index', icon: 'chart', roles: ['admin', 'manager'] },
            { name: 'Analitik', href: 'analytics.index', icon: 'analytics', roles: ['admin', 'manager'] },
            { name: 'User', href: 'users.index', icon: 'users', roles: ['admin'] },
        ],
    },
];

function Icon({ name, className = 'w-5 h-5' }) {
    const icons = {
        grid: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />,
        box: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />,
        tag: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />,
        truck: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21a.75.75 0 00.75-.75V12.75a3 3 0 00-3-3H6.75a3 3 0 00-3 3v5.25c0 .414.336.75.75.75h15.75z" />,
        exchange: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />,
        warehouse: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />,
        chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />,
        analytics: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />,
        users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />,
    };

    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            {icons[name]}
        </svg>
    );
}

export default function Sidebar({ collapsed = false }) {
    const { url } = usePage();
    const { user, hasRole } = usePermission();

    return (
        <aside className={`fixed left-0 top-0 z-40 h-screen bg-deep text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-sidebar'}`}>
            <div className={`flex items-center h-16 border-b border-white/10 ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <img src="/storage/LogoInventaris.jpg" alt="Logo" className="w-8 h-8 rounded-sm object-cover" />
                        <div>
                            <div className="font-heading font-semibold text-sm text-white leading-tight">Inventaris</div>
                            <div className="text-[10px] text-white/40 font-mono tracking-wider uppercase">Management System</div>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <img src="/storage/LogoInventaris.jpg" alt="Logo" className="w-8 h-8 rounded-sm object-cover" />
                )}
            </div>

            <nav className="mt-4 px-3 space-y-6 overflow-y-auto" style={{ height: 'calc(100vh - 4rem - 1px)' }}>
                {navigation.map((group) => {
                    const visibleItems = group.items.filter(item => hasRole(...item.roles));
                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={group.label}>
                            {!collapsed && (
                                <div className="px-2 mb-2 text-[10px] font-mono font-medium text-white/30 tracking-widest uppercase">
                                    {group.label}
                                </div>
                            )}
                            <div className="space-y-0.5">
                                {visibleItems.map((item) => {
                                    const isActive = url.startsWith(route(item.href).toString().replace(window.location.origin, ''));
                                    return (
                                        <Link
                                            key={item.name}
                                            href={route(item.href)}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors duration-150 ${
                                                isActive
                                                    ? 'bg-ink-navy text-white'
                                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                            } ${collapsed ? 'justify-center' : ''}`}
                                            title={collapsed ? item.name : undefined}
                                        >
                                            <Icon name={item.icon} className="w-5 h-5 shrink-0" />
                                            {!collapsed && <span>{item.name}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
}
