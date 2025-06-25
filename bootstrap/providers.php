<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Modules\Auth\AuthServiceProvider::class,
    App\Modules\Settings\SettingsServiceProvider::class,
    App\Modules\Users\UsersServiceProvider::class,
    App\Modules\Waitlist\WaitlistServiceProvider::class,
    App\Modules\RBAC\RBACServiceProvider::class,
];
