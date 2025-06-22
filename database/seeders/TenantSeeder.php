<?php

namespace Database\Seeders;

use App\Modules\Tenants\Models\Tenant;
use App\Modules\Users\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create demo tenants
        $tenants = [
            [
                'name' => 'Acme Corporation',
                'subdomain' => 'acme',
                'status' => 'active',
            ],
            [
                'name' => 'Widget Industries',
                'subdomain' => 'widget',
                'status' => 'active',
            ],
            [
                'name' => 'Tech Solutions Ltd',
                'subdomain' => 'techsol',
                'status' => 'active',
            ],
            [
                'name' => 'Startup Hub',
                'subdomain' => 'startup',
                'status' => 'inactive',
            ],
        ];

        foreach ($tenants as $tenantData) {
            // Create or find tenant
            $tenant = Tenant::firstOrCreate(
                ['subdomain' => $tenantData['subdomain']],
                $tenantData
            );

            // Create users for each tenant
            $users = [
                [
                    'name' => 'Admin User',
                    'email' => "admin@{$tenant->subdomain}.example.com",
                    'password' => bcrypt('password'),
                    'tenant_id' => $tenant->id,
                    'email_verified_at' => now(),
                ],
                [
                    'name' => 'John Doe',
                    'email' => "john@{$tenant->subdomain}.example.com",
                    'password' => bcrypt('password'),
                    'tenant_id' => $tenant->id,
                    'email_verified_at' => now(),
                ],
                [
                    'name' => 'Jane Smith',
                    'email' => "jane@{$tenant->subdomain}.example.com",
                    'password' => bcrypt('password'),
                    'tenant_id' => $tenant->id,
                    'email_verified_at' => now(),
                ],
            ];

            foreach ($users as $userData) {
                User::firstOrCreate(
                    ['email' => $userData['email']],
                    $userData
                );
            }

            $this->command->info("Created tenant: {$tenant->name} ({$tenant->subdomain})");
        }

        $this->command->info('Tenant seeding completed!');
        $this->command->info('Available subdomains:');
        foreach (Tenant::all() as $tenant) {
            $this->command->info("  - {$tenant->subdomain}.test -> {$tenant->name} ({$tenant->status})");
        }
    }
}
