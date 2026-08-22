import { usePage } from '@inertiajs/react';

export function usePermission() {
    const { auth } = usePage().props;
    const user = auth.user;

    const hasRole = (...roles) => {
        if (!user) return false;
        return roles.includes(user.role);
    };

    const isAdmin = () => hasRole('admin');
    const isManager = () => hasRole('manager');
    const isStaff = () => hasRole('staff');
    const isViewer = () => hasRole('viewer');

    const canManageUsers = () => hasRole('admin');
    const canManageProducts = () => hasRole('admin', 'manager', 'staff');
    const canDeleteProducts = () => hasRole('admin', 'manager');
    const canManageSuppliers = () => hasRole('admin', 'manager');
    const canDeleteSuppliers = () => hasRole('admin');
    const canDeleteCategories = () => hasRole('admin', 'manager');
    const canManageTransactions = () => hasRole('admin', 'manager', 'staff');
    const canApproveTransactions = () => hasRole('admin', 'manager');
    const canViewReports = () => hasRole('admin', 'manager');
    const canExportReports = () => hasRole('admin', 'manager');

    return {
        user,
        hasRole,
        isAdmin,
        isManager,
        isStaff,
        isViewer,
        canManageUsers,
        canManageProducts,
        canDeleteProducts,
        canManageSuppliers,
        canDeleteSuppliers,
        canDeleteCategories,
        canManageTransactions,
        canApproveTransactions,
        canViewReports,
        canExportReports,
    };
}
