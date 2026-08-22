import Dropdown from '@/Components/Dropdown';
import Sidebar from '@/Components/Sidebar';
import FlashMessage from '@/Components/FlashMessage';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

function RoleBadge({ role }) {
    const colors = {
        admin: 'bg-red-500',
        manager: 'bg-primary',
        staff: 'bg-emerald-500',
        viewer: 'bg-gray-400',
    };

    return (
        <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-white rounded-sm uppercase tracking-wider ${colors[role] || 'bg-gray-400'}`}>
            {role}
        </span>
    );
}

export default function AppLayout({ title, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        return localStorage.getItem('sidebar_collapsed') === 'true';
    });
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        localStorage.setItem('sidebar_collapsed', String(sidebarCollapsed));
    }, [sidebarCollapsed]);

    return (
        <div className="min-h-screen bg-chalk">
            <Sidebar collapsed={sidebarCollapsed} />

            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-sidebar'}`}>
                <header className="sticky top-0 z-30 h-16 bg-surface border-b border-line flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-1.5 rounded-sm text-steel hover:bg-chalk hover:text-deep transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d={sidebarCollapsed ? "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
                            </svg>
                        </button>
                        {title && (
                            <h1 className="text-lg font-heading font-semibold text-deep">{title}</h1>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <RoleBadge role={user?.role} />

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button type="button" className="flex items-center gap-2 text-sm text-steel hover:text-deep transition-colors">
                                    <div className="w-9 h-9 rounded-sm bg-ink-navy text-white flex items-center justify-center font-heading font-semibold text-xs shrink-0">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden sm:block">{user?.name}</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <div className="px-3 py-2 border-b border-line">
                                    <div className="text-sm font-medium text-deep">{user?.name}</div>
                                    <div className="text-xs text-steel">{user?.email}</div>
                                </div>
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <button
                                    onClick={() => { setShowLogoutConfirm(true); }}
                                    className="block w-full text-left px-3 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out"
                                >
                                    Logout
                                </button>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="p-6">
                    <FlashMessage />
                    {children}
                </main>
            </div>

            <ConfirmDialog
                open={showLogoutConfirm}
                title="Konfirmasi Logout"
                message="Apakah Anda yakin ingin keluar dari sistem?"
                confirmText="Ya, Keluar"
                cancelText="Batal"
                danger
                onConfirm={() => { setShowLogoutConfirm(false); router.post(route('logout')); }}
                onCancel={() => setShowLogoutConfirm(false)}
            />
        </div>
    );
}
