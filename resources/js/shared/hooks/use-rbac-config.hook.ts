import { type RBACConfig, type SharedData } from '@/core/types';
import { usePage } from '@inertiajs/react';

export interface RBACConfigHook {
    rbacConfig: RBACConfig;
    canManageRoles: boolean;
    canManagePermissions: boolean;
    superAdminRole: string;
    requiredPermissions: string[];
}

export const useRBACConfig = (): RBACConfigHook => {
    const { props } = usePage<SharedData>();
    const { rbac_config } = props;

    return {
        rbacConfig: rbac_config,
        canManageRoles: rbac_config.features.roles_management,
        canManagePermissions: rbac_config.features.permissions_management,
        superAdminRole: rbac_config.access.super_admin_role,
        requiredPermissions: rbac_config.access.required_permissions,
    };
};
