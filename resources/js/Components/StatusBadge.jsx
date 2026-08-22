export function StockBadge({ quantity, minStock }) {
    if (quantity <= 0) {
        return <span className="badge-danger">Habis</span>;
    }
    if (quantity <= minStock) {
        return <span className="badge-warning">Rendah</span>;
    }
    return <span className="badge-success">Aman</span>;
}

export function StatusBadge({ status }) {
    const map = {
        pending: { label: 'Pending', class: 'badge-warning' },
        approved: { label: 'Disetujui', class: 'badge-success' },
        rejected: { label: 'Ditolak', class: 'badge-danger' },
        active: { label: 'Aktif', class: 'badge-success' },
        inactive: { label: 'Nonaktif', class: 'badge-neutral' },
    };
    const config = map[status] || { label: status, class: 'badge-neutral' };
    return <span className={config.class}>{config.label}</span>;
}

export function TypeBadge({ type }) {
    const map = {
        in: { label: 'Masuk', class: 'badge-success' },
        out: { label: 'Keluar', class: 'badge-danger' },
        adjustment: { label: 'Penyesuaian', class: 'badge-info' },
    };
    const config = map[type] || { label: type, class: 'badge-neutral' };
    return <span className={config.class}>{config.label}</span>;
}

export function RoleBadge({ role }) {
    const map = {
        admin: { label: 'Admin', class: 'badge-danger' },
        manager: { label: 'Manager', class: 'badge-info' },
        staff: { label: 'Staff', class: 'badge-success' },
        viewer: { label: 'Viewer', class: 'badge-neutral' },
    };
    const config = map[role] || { label: role, class: 'badge-neutral' };
    return <span className={config.class}>{config.label}</span>;
}
