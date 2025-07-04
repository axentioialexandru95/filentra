<?php

namespace Tests;

use App\Modules\Users\Models\User;
use Facebook\WebDriver\Chrome\ChromeOptions;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Illuminate\Foundation\Testing\DatabaseTruncation;
use Illuminate\Support\Collection;
use Laravel\Dusk\TestCase as BaseTestCase;
use PHPUnit\Framework\Attributes\BeforeClass;

abstract class DuskTestCase extends BaseTestCase
{
    use DatabaseTruncation;

    /**
     * Setup the test environment for parallel testing.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Generate unique test context for parallel tests
        $this->setTestContext();
    }

    /**
     * Set unique test context to avoid conflicts in parallel tests.
     */
    protected function setTestContext(): void
    {
        // Generate unique identifiers for this test instance
        $uniqueId = uniqid('dusk_', true);

        // Store in config for use in tests
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
     * Get a unique email for testing (parallel-safe).
     */
    protected function getUniqueEmail(string $prefix = 'dusk'): string
    {
        $uniqueId = config('testing.unique_id', uniqid());

        return "{$prefix}_{$uniqueId}@example.com";
    }

    /**
     * Prepare for Dusk test execution.
     */
    #[BeforeClass]
    public static function prepare(): void
    {
        if (! static::runningInSail()) {
            static::startChromeDriver(['--port=9515']);
        }
    }

    /**
     * Create the RemoteWebDriver instance.
     */
    protected function driver(): RemoteWebDriver
    {
        $options = (new ChromeOptions)->addArguments(collect([
            $this->shouldStartMaximized() ? '--start-maximized' : '--window-size=1920,1080',
            '--disable-search-engine-choice-screen',
            '--disable-smooth-scrolling',
        ])->unless($this->hasHeadlessDisabled(), function (Collection $items) {
            return $items->merge([
                '--disable-gpu',
                '--headless=new',
            ]);
        })->all());

        return RemoteWebDriver::create(
            $_ENV['DUSK_DRIVER_URL'] ?? config('dusk.driver_url') ?? 'http://localhost:9515',
            DesiredCapabilities::chrome()->setCapability(
                ChromeOptions::CAPABILITY, $options
            )
        );
    }
}
