import { type SharedData } from '@/core/types';

export const useRBACAccess = (props: SharedData): { canAccessRBAC: boolean } => {
    const { auth, rbac_config } = props;

    if (!auth?.user) {
        return { canAccessRBAC: false };
    }

    const { access } = rbac_config;

    const isSuperAdmin = auth.user.role?.slug === access.super_admin_role;

    const hasRequiredPermission = access.required_permissions.some((requiredPermission) =>
        auth.user?.permissions?.some((permission) => permission.slug === requiredPermission),
    );

    const canAccessRBAC = isSuperAdmin || hasRequiredPermission;

    return { canAccessRBAC };
};
