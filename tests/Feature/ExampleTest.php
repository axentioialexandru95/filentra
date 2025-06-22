<?php

it('returns a successful response', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});

it('can create users with unique data for parallel testing', function () {
    $email = $this->getUniqueEmail('user');
    $name = $this->getUniqueString('User');

    $user = $this->createTestUser([
        'name' => $name,
        'email' => $email,
    ]);

    expect($user->email)->toBe($email);
    expect($user->name)->toBe($name);
    expect($user)->toBeInstanceOf(\App\Modules\Users\Models\User::class);
});

it('creates isolated test data across parallel processes', function () {
    $uniqueId = config('testing.unique_id');

    expect($uniqueId)->not()->toBeNull();
    expect($uniqueId)->toStartWith('test_');
});

it('can act as authenticated user', function () {
    $response = $this->actingAsTestUser()
        ->get('/dashboard');

    // Dashboard route exists, so we expect success or redirect
    $response->assertStatus(200);
});
