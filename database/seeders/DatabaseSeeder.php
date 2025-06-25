<?php

namespace Database\Seeders;

use App\Modules\Users\Models\User;
use App\Role;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run role and permission seeder first
        $this->call([
            RolePermissionSeeder::class,
        ]);

        // Get or create admin user with superadmin role
        $superAdminRole = Role::where('slug', 'superadmin')->first();

        $adminUser = User::updateOrCreate(
            ['email' => 'admin@admin.com'], // Search criteria
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'role_id' => $superAdminRole->id,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info("Admin user created/updated: {$adminUser->email}");
        $this->command->info("Role assigned: {$superAdminRole->name}");
    }
}
