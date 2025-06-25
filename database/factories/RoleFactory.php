<?php

namespace Database\Factories;

use App\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Role>
 */
class RoleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Role>
     */
    protected $model = Role::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->jobTitle(),
            'slug' => fake()->unique()->slug(),
            'description' => fake()->sentence(),
            'level' => fake()->numberBetween(1, 99),
            'is_active' => fake()->boolean(80), // 80% chance of being active
        ];
    }

    /**
     * Indicate that the role should be active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the role should be inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Create a superadmin role.
     */
    public function superadmin(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Super Administrator',
            'slug' => 'superadmin',
            'description' => 'Full system access',
            'level' => 100,
            'is_active' => true,
        ]);
    }
}