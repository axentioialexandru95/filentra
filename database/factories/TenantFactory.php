<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Tenants\Models\Tenant>
 */
class TenantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $companyName = $this->faker->company();
        $subdomain = str_replace([' ', '.', ',', "'", '"'], '', strtolower($companyName));
        $subdomain = substr($subdomain, 0, 20); // Limit length
        return [
            'name' => $companyName,
            'subdomain' => $subdomain . '-' . $this->faker->randomNumber(3),
            'status' => $this->faker->randomElement(['active', 'active', 'active', 'inactive']), // 75% active
        ];
    }
}
