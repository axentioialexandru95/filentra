<?php

namespace Database\Factories;

use App\Modules\Waitlist\Models\Waitlist;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Waitlist> */
class WaitlistFactory extends Factory
{
    protected $model = Waitlist::class;

    public function definition(): array
    {
        return [
            'email' => $this->faker->unique()->safeEmail(),
            'interests' => $this->faker->randomElement(['general', 'billing', 'support', 'features']),
            'joined_at' => now(),
        ];
    }
}
