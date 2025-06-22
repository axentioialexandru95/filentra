<?php

namespace Database\Seeders;

use App\Role;
use App\Permission;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions first
        $permissions = [
            // Tenant Management
            [
                'name' => 'View Tenants',
                'slug' => 'view_tenants',
                'description' => 'Can view all tenants in the system',
                'category' => 'tenant_management',
            ],
            [
                'name' => 'Create Tenants',
                'slug' => 'create_tenants',
                'description' => 'Can create new tenants',
                'category' => 'tenant_management',
            ],
            [
                'name' => 'Edit Tenants',
                'slug' => 'edit_tenants',
                'description' => 'Can edit existing tenants',
                'category' => 'tenant_management',
            ],
            [
                'name' => 'Delete Tenants',
                'slug' => 'delete_tenants',
                'description' => 'Can delete tenants',
                'category' => 'tenant_management',
            ],

            // User Management
            [
                'name' => 'View Users',
                'slug' => 'view_users',
                'description' => 'Can view users in own tenant',
                'category' => 'user_management',
            ],
            [
                'name' => 'Create Users',
                'slug' => 'create_users',
                'description' => 'Can create new users in own tenant',
                'category' => 'user_management',
            ],
            [
                'name' => 'Edit Users',
                'slug' => 'edit_users',
                'description' => 'Can edit users in own tenant',
                'category' => 'user_management',
            ],
            [
                'name' => 'Delete Users',
                'slug' => 'delete_users',
                'description' => 'Can delete users in own tenant',
                'category' => 'user_management',
            ],

            // Impersonation
            [
                'name' => 'Impersonate Users',
                'slug' => 'impersonate_users',
                'description' => 'Can impersonate other users',
                'category' => 'impersonation',
            ],

            // System Settings
            [
                'name' => 'Manage System Settings',
                'slug' => 'manage_system_settings',
                'description' => 'Can manage system-wide settings',
                'category' => 'system',
            ],

            // Role Management
            [
                'name' => 'View Roles',
                'slug' => 'view_roles',
                'description' => 'Can view roles and permissions',
                'category' => 'role_management',
            ],
            [
                'name' => 'Manage Roles',
                'slug' => 'manage_roles',
                'description' => 'Can create and edit roles and permissions',
                'category' => 'role_management',
            ],
        ];

        foreach ($permissions as $permissionData) {
            Permission::firstOrCreate(
                ['slug' => $permissionData['slug']],
                $permissionData
            );
        }

        // Create roles
        $roles = [
            [
                'name' => 'Super Administrator',
                'slug' => 'superadmin',
                'description' => 'Has complete access to the entire system including all tenants',
                'level' => 100,
                'permissions' => array_column($permissions, 'slug'), // All permissions
            ],
            [
                'name' => 'Tenant Administrator',
                'slug' => 'tenant_admin',
                'description' => 'Has administrative access within their own tenant',
                'level' => 50,
                'permissions' => [
                    'view_users',
                    'create_users',
                    'edit_users',
                    'delete_users',
                    'view_roles',
                ],
            ],
            [
                'name' => 'Manager',
                'slug' => 'manager',
                'description' => 'Can manage users within their tenant',
                'level' => 30,
                'permissions' => [
                    'view_users',
                    'create_users',
                    'edit_users',
                ],
            ],
            [
                'name' => 'User',
                'slug' => 'user',
                'description' => 'Standard user with basic access',
                'level' => 10,
                'permissions' => [
                    'view_users',
                ],
            ],
        ];

        foreach ($roles as $roleData) {
            $permissions = $roleData['permissions'];
            unset($roleData['permissions']);

            $role = Role::firstOrCreate(
                ['slug' => $roleData['slug']],
                $roleData
            );

            // Attach permissions to role
            $permissionIds = Permission::whereIn('slug', $permissions)->pluck('id');
            $role->permissions()->sync($permissionIds);
        }

        $this->command->info('Roles and permissions seeded successfully!');
    }
}
