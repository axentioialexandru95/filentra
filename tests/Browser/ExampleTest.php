<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;

test('basic example', function () {
    /** @var \Tests\DuskTestCase $this */
    $this->browse(function (Browser $browser) {
        $browser->visit('/')
            ->assertTitle('Welcome - Laravel');
    });
});

test('can create unique test users for parallel testing', function () {
    /** @var \Tests\DuskTestCase $this */
    $email = $this->getUniqueEmail('dusk');

    $user = $this->createTestUser([
        'name' => 'Dusk Test User',
        'email' => $email,
    ]);

    expect($user->email)->toBe($email);
    expect($user)->toBeInstanceOf(\App\Modules\Users\Models\User::class);
});

test('parallel testing isolation works', function () {
    /** @var \Tests\DuskTestCase $this */
    $uniqueId = config('testing.unique_id');

    expect($uniqueId)->not()->toBeNull();
    expect($uniqueId)->toStartWith('dusk_');

    $this->browse(function (Browser $browser) use ($uniqueId) {
        $browser->visit('/')
            ->assertTitle('Welcome - Laravel');

        // Each parallel test gets its own unique context
        expect(config('testing.unique_id'))->toBe($uniqueId);
    });
});
