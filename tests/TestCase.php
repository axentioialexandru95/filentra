<?php

namespace Tests;

use App\Modules\Users\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    /**
     * Setup the test environment for parallel testing.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Generate unique test data for parallel testing
        $this->setTestContext();
    }

    /**
     * Set unique test context to avoid conflicts in parallel tests.
     */
    protected function setTestContext(): void
    {
        // Generate unique identifiers for this test instance
        $uniqueId = uniqid('test_', true);

        // Store in config for use in factories and tests
        config(['testing.unique_id' => $uniqueId]);
    }

    /**
     * Create a test user with unique data.
     *
     * @param  array<string, mixed>  $attributes
     */
    protected function createTestUser(array $attributes = []): User
    {
        return User::factory()->create($attributes);
    }

    /**
     * Act as a test user.
     *
     * @param  array<string, mixed>  $attributes
     */
    protected function actingAsTestUser(array $attributes = []): static
    {
        $user = $this->createTestUser($attributes);

        return $this->actingAs($user);
    }

    /**
     * Get a unique email for testing (parallel-safe).
     */
    protected function getUniqueEmail(string $prefix = 'test'): string
    {
        $uniqueId = config('testing.unique_id', uniqid());

        return "{$prefix}_{$uniqueId}@example.com";
    }

    /**
     * Get a unique string for testing (parallel-safe).
     */
    protected function getUniqueString(string $prefix = 'test'): string
    {
        $uniqueId = config('testing.unique_id', uniqid());

        return "{$prefix}_{$uniqueId}";
    }
}
