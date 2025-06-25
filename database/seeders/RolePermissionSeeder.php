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
        // Create comprehensive permissions for reverse logistics system
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

            // Dashboard
            [
                'name' => 'View Dashboard',
                'slug' => 'view_dashboard',
                'description' => 'Can access main dashboard',
                'category' => 'dashboard',
            ],

            // Product Management
            [
                'name' => 'View Products',
                'slug' => 'view_products',
                'description' => 'Can view product listings',
                'category' => 'products',
            ],
            [
                'name' => 'Create Products',
                'slug' => 'create_products',
                'description' => 'Can create new products',
                'category' => 'products',
            ],
            [
                'name' => 'Edit Products',
                'slug' => 'edit_products',
                'description' => 'Can edit products',
                'category' => 'products',
            ],
            [
                'name' => 'Delete Products',
                'slug' => 'delete_products',
                'description' => 'Can delete products',
                'category' => 'products',
            ],
            [
                'name' => 'Upload CSV',
                'slug' => 'upload_csv',
                'description' => 'Can upload CSV files with product data',
                'category' => 'products',
            ],
            [
                'name' => 'Manage Product Quality',
                'slug' => 'manage_product_quality',
                'description' => 'Can assign quality ratings (A, B, C) to products',
                'category' => 'products',
            ],

            // Batch Management
            [
                'name' => 'View Batches',
                'slug' => 'view_batches',
                'description' => 'Can view product batches',
                'category' => 'batches',
            ],
            [
                'name' => 'Create Batches',
                'slug' => 'create_batches',
                'description' => 'Can create product batches',
                'category' => 'batches',
            ],
            [
                'name' => 'Manage Batches',
                'slug' => 'manage_batches',
                'description' => 'Can edit and delete product batches',
                'category' => 'batches',
            ],
            [
                'name' => 'Send Batches for Review',
                'slug' => 'send_batches_for_review',
                'description' => 'Can send batches for verification',
                'category' => 'batches',
            ],
            [
                'name' => 'Review Batches',
                'slug' => 'review_batches',
                'description' => 'Can review and approve/reject batches',
                'category' => 'batches',
            ],

            // Vendor Management
            [
                'name' => 'View Vendors',
                'slug' => 'view_vendors',
                'description' => 'Can view vendor information',
                'category' => 'vendors',
            ],
            [
                'name' => 'Manage Vendors',
                'slug' => 'manage_vendors',
                'description' => 'Can manage vendor accounts and submissions',
                'category' => 'vendors',
            ],

            // Warehouse Management
            [
                'name' => 'View Warehouse',
                'slug' => 'view_warehouse',
                'description' => 'Can view warehouse operations',
                'category' => 'warehouse',
            ],
            [
                'name' => 'Manage Inventory',
                'slug' => 'manage_inventory',
                'description' => 'Can manage inventory and stock levels',
                'category' => 'warehouse',
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

            // Impersonation & Security
            [
                'name' => 'Impersonate Users',
                'slug' => 'impersonate_users',
                'description' => 'Can impersonate other users',
                'category' => 'security',
            ],

            // Reports
            [
                'name' => 'View Reports',
                'slug' => 'view_reports',
                'description' => 'Can view business reports',
                'category' => 'reports',
            ],

            // Waitlist Management (keeping for compatibility)
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

        // Create roles with specific permission sets for reverse logistics
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
                'description' => 'Has administrative access to manage vendors, products, and quality control',
                'level' => 90,
                'permissions' => [
                    'view_users', 'create_users', 'edit_users', 'delete_users',
                    'view_roles', 'view_dashboard',
                    'view_products', 'manage_product_quality',
                    'view_batches', 'review_batches',
                    'view_vendors', 'manage_vendors',
                    'view_reports', 'view_system_logs',
                    'view_waitlist', 'manage_waitlist',
                ],
            ],
            [
                'name' => 'Vendor',
                'slug' => 'vendor',
                'description' => 'Can upload and manage products, create batches for verification, and submit them for quality review',
                'level' => 25,
                'permissions' => [
                    'view_dashboard',
                    'view_products', 'create_products', 'edit_products', 'delete_products', 'upload_csv',
                    'view_batches', 'create_batches', 'manage_batches', 'send_batches_for_review',
                    'view_reports',
                ],
            ],
            [
                'name' => 'Warehouse Manager',
                'slug' => 'warehouse_manager',
                'description' => 'Warehouse manager with inventory and logistics access',
                'level' => 40,
                'permissions' => [
                    'view_dashboard',
                    'view_products', 'view_batches',
                    'view_warehouse', 'manage_inventory',
                    'view_reports',
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

        $this->command->info('Reverse logistics roles and permissions seeded successfully!');
    }
}
