<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ExampleClassTest extends DuskTestCase
{
    /**
     * Test basic page loading.
     */
    public function test_basic_example(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                ->assertTitle('Welcome - Laravel');
        });
    }

    /**
     * Test that we can create unique test users for parallel testing.
     */
    public function test_can_create_unique_test_users_for_parallel_testing(): void
    {
        $email = $this->getUniqueEmail('dusk');

        $user = $this->createTestUser([
            'name' => 'Dusk Test User',
            'email' => $email,
        ]);

        $this->assertEquals($email, $user->email);
        $this->assertInstanceOf(\App\Models\User::class, $user);
    }

    /**
     * Test that parallel testing isolation works correctly.
     */
    public function test_parallel_testing_isolation_works(): void
    {
        $uniqueId = config('testing.unique_id');

        $this->assertNotNull($uniqueId);
        $this->assertStringStartsWith('dusk_', $uniqueId);

        $this->browse(function (Browser $browser) use ($uniqueId) {
            $browser->visit('/')
                ->assertTitle('Welcome - Laravel');

            // Each parallel test gets its own unique context
            $this->assertEquals($uniqueId, config('testing.unique_id'));
        });
    }
}
