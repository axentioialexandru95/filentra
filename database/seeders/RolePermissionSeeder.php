<?php

namespace Database\Seeders;

use App\Permission;
use App\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create comprehensive permissions
        $permissions = [
            // User Management
            [
                'name' => 'View Users',
                'slug' => 'view_users',
                'description' => 'Can view users in the system',
                'category' => 'user_management',
            ],
            [
                'name' => 'Create Users',
                'slug' => 'create_users',
                'description' => 'Can create new users',
                'category' => 'user_management',
            ],
            [
                'name' => 'Edit Users',
                'slug' => 'edit_users',
                'description' => 'Can edit users',
                'category' => 'user_management',
            ],
            [
                'name' => 'Delete Users',
                'slug' => 'delete_users',
                'description' => 'Can delete users',
                'category' => 'user_management',
            ],
            [
                'name' => 'Export Users',
                'slug' => 'export_users',
                'description' => 'Can export user data',
                'category' => 'user_management',
            ],

            // Role & Permission Management
            [
                'name' => 'View Roles',
                'slug' => 'view_roles',
                'description' => 'Can view roles and permissions',
                'category' => 'role_management',
            ],
            [
                'name' => 'Manage Roles',
                'slug' => 'manage_roles',
                'description' => 'Can create, edit and delete roles and permissions',
                'category' => 'role_management',
            ],

            // Dashboard & Analytics
            [
                'name' => 'View Dashboard',
                'slug' => 'view_dashboard',
                'description' => 'Can access main dashboard',
                'category' => 'dashboard',
            ],
            [
                'name' => 'View Analytics',
                'slug' => 'view_analytics',
                'description' => 'Can view analytics and reports',
                'category' => 'dashboard',
            ],
            [
                'name' => 'Export Reports',
                'slug' => 'export_reports',
                'description' => 'Can export reports and data',
                'category' => 'dashboard',
            ],

            // System Administration
            [
                'name' => 'Manage System Settings',
                'slug' => 'manage_system_settings',
                'description' => 'Can manage system-wide settings',
                'category' => 'system',
            ],
            [
                'name' => 'View System Logs',
                'slug' => 'view_system_logs',
                'description' => 'Can view system logs and audit trails',
                'category' => 'system',
            ],
            [
                'name' => 'Manage Database',
                'slug' => 'manage_database',
                'description' => 'Can manage database operations',
                'category' => 'system',
            ],
            [
                'name' => 'Manage Backups',
                'slug' => 'manage_backups',
                'description' => 'Can create and manage system backups',
                'category' => 'system',
            ],

            // Impersonation & Security
            [
                'name' => 'Impersonate Users',
                'slug' => 'impersonate_users',
                'description' => 'Can impersonate other users',
                'category' => 'security',
            ],
            [
                'name' => 'View Security Logs',
                'slug' => 'view_security_logs',
                'description' => 'Can view security and access logs',
                'category' => 'security',
            ],
            [
                'name' => 'Manage Sessions',
                'slug' => 'manage_sessions',
                'description' => 'Can manage user sessions',
                'category' => 'security',
            ],

            // Content Management
            [
                'name' => 'Manage Content',
                'slug' => 'manage_content',
                'description' => 'Can create and edit content',
                'category' => 'content',
            ],
            [
                'name' => 'Publish Content',
                'slug' => 'publish_content',
                'description' => 'Can publish and unpublish content',
                'category' => 'content',
            ],
            [
                'name' => 'Delete Content',
                'slug' => 'delete_content',
                'description' => 'Can delete content',
                'category' => 'content',
            ],

            // E-commerce & Inventory (for future expansion)
            [
                'name' => 'View Products',
                'slug' => 'view_products',
                'description' => 'Can view product listings',
                'category' => 'ecommerce',
            ],
            [
                'name' => 'Manage Products',
                'slug' => 'manage_products',
                'description' => 'Can create, edit and manage products',
                'category' => 'ecommerce',
            ],
            [
                'name' => 'Manage Orders',
                'slug' => 'manage_orders',
                'description' => 'Can view and manage orders',
                'category' => 'ecommerce',
            ],
            [
                'name' => 'Manage Inventory',
                'slug' => 'manage_inventory',
                'description' => 'Can manage inventory and stock levels',
                'category' => 'inventory',
            ],
            [
                'name' => 'View Reports',
                'slug' => 'view_reports',
                'description' => 'Can view business reports',
                'category' => 'reports',
            ],

            // Communication & Notifications
            [
                'name' => 'Send Notifications',
                'slug' => 'send_notifications',
                'description' => 'Can send notifications to users',
                'category' => 'communication',
            ],
            [
                'name' => 'Manage Messages',
                'slug' => 'manage_messages',
                'description' => 'Can manage messages and communications',
                'category' => 'communication',
            ],

            // Waitlist Management
            [
                'name' => 'View Waitlist',
                'slug' => 'view_waitlist',
                'description' => 'Can view waitlist entries',
                'category' => 'waitlist',
            ],
            [
                'name' => 'Manage Waitlist',
                'slug' => 'manage_waitlist',
                'description' => 'Can manage waitlist entries',
                'category' => 'waitlist',
            ],
        ];

        foreach ($permissions as $permissionData) {
            Permission::firstOrCreate(
                ['slug' => $permissionData['slug']],
                $permissionData
            );
        }

        // Create roles with specific permission sets
        $roles = [
            [
                'name' => 'Super Administrator',
                'slug' => 'superadmin',
                'description' => 'Has complete access to the entire system',
                'level' => 100,
                'permissions' => array_column($permissions, 'slug'), // All permissions
            ],
            [
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'Has administrative access to most system features',
                'level' => 90,
                'permissions' => [
                    'view_users', 'create_users', 'edit_users', 'delete_users',
                    'view_roles', 'view_dashboard', 'view_analytics', 'export_reports',
                    'manage_content', 'publish_content', 'delete_content',
                    'view_products', 'manage_products', 'manage_orders',
                    'view_reports', 'send_notifications', 'manage_messages',
                    'view_waitlist', 'manage_waitlist', 'view_security_logs',
                ],
            ],
            [
                'name' => 'Manager',
                'slug' => 'manager',
                'description' => 'Can manage users and content',
                'level' => 50,
                'permissions' => [
                    'view_users', 'create_users', 'edit_users',
                    'view_dashboard', 'view_analytics',
                    'manage_content', 'publish_content',
                    'view_products', 'manage_products',
                    'view_reports', 'view_waitlist', 'manage_waitlist',
                ],
            ],
            [
                'name' => 'Content Editor',
                'slug' => 'content_editor',
                'description' => 'Can create and edit content',
                'level' => 30,
                'permissions' => [
                    'view_dashboard', 'manage_content', 'publish_content',
                    'view_products', 'view_reports',
                ],
            ],
            [
                'name' => 'Vendor',
                'slug' => 'vendor',
                'description' => 'Vendor with access to manage their products and orders',
                'level' => 25,
                'permissions' => [
                    'view_dashboard', 'view_products', 'manage_products',
                    'manage_orders', 'view_reports',
                ],
            ],
            [
                'name' => 'Warehouse Manager',
                'slug' => 'warehouse_manager',
                'description' => 'Warehouse manager with inventory and logistics access',
                'level' => 40,
                'permissions' => [
                    'view_dashboard', 'view_users',
                    'view_products', 'manage_inventory',
                    'manage_orders', 'view_reports',
                ],
            ],
            [
                'name' => 'Customer Support',
                'slug' => 'customer_support',
                'description' => 'Customer support representative',
                'level' => 20,
                'permissions' => [
                    'view_dashboard', 'view_users',
                    'view_products', 'manage_orders',
                    'send_notifications', 'manage_messages',
                    'view_waitlist',
                ],
            ],
            [
                'name' => 'User',
                'slug' => 'user',
                'description' => 'Standard user with basic access',
                'level' => 10,
                'permissions' => [
                    'view_dashboard',
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

        $this->command->info('Comprehensive roles and permissions seeded successfully!');
    }
}
