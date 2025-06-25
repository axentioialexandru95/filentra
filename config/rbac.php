<?php

return [
    /*
    |--------------------------------------------------------------------------
    | RBAC Access Control
    |--------------------------------------------------------------------------
    |
    | This configuration defines who can access RBAC management features.
    | Users with any of the specified roles or permissions will be granted
    | access to manage roles and permissions.
    |
    | Environment Variables:
    | - RBAC_SUPER_ADMIN_ROLE: Role slug for super admin (default: 'superadmin')
    | - RBAC_MANAGE_ROLES_PERMISSION: Permission slug for RBAC access (default: 'manage_roles')
    | - RBAC_ROLES_MANAGEMENT: Enable roles management (default: true)
    | - RBAC_PERMISSIONS_MANAGEMENT: Enable permissions management (default: true)
    |
    */

    'access' => [
        /*
        |--------------------------------------------------------------------------
        | Super Admin Role
        |--------------------------------------------------------------------------
        |
        | The role slug that grants full access to RBAC features.
        | Users with this role can access all RBAC functionality.
        |
        */
        'super_admin_role' => env('RBAC_SUPER_ADMIN_ROLE', 'superadmin'),

        /*
        |--------------------------------------------------------------------------
        | Required Permissions
        |--------------------------------------------------------------------------
        |
        | Permission slugs that grant access to RBAC features.
        | Users with any of these permissions can access RBAC functionality.
        |
        */
        'required_permissions' => [
            env('RBAC_MANAGE_ROLES_PERMISSION', 'manage_roles'),
            // Add more permissions as needed
            // 'manage_permissions',
            // 'rbac_admin',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | RBAC Features
    |--------------------------------------------------------------------------
    |
    | Enable or disable specific RBAC features.
    |
    */

    'features' => [
        'roles_management' => env('RBAC_ROLES_MANAGEMENT', true),
        'permissions_management' => env('RBAC_PERMISSIONS_MANAGEMENT', true),
    ],
];
