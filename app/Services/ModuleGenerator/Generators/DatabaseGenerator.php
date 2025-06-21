<?php

namespace App\Services\ModuleGenerator\Generators;

use App\Services\ModuleGenerator\ModuleGenerationResult;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class DatabaseGenerator
{
    public function generate(string $moduleName, array $options, ModuleGenerationResult $result): void
    {
        $isCrud = $options['crud'] ?? false;

        // Generate model if requested
        if ($options['model'] ?? $isCrud) {
            $this->createModel($moduleName, $result);
        }

        // Generate migration if requested
        if ($options['migration'] ?? $isCrud) {
            $this->createMigration($moduleName, $result);
        }

        // Generate factory if requested
        if ($options['factory'] ?? $isCrud) {
            $this->createFactory($moduleName, $result);
        }

        // Generate seeder if requested
        if ($options['seeder'] ?? $isCrud) {
            $this->createSeeder($moduleName, $result);
        }
    }

    protected function createModel(string $moduleName, ModuleGenerationResult $result): void
    {
        $content = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class {$moduleName} extends Model
{
    use HasFactory;

    protected \$fillable = [
        'name',
        'description',
        'status',
    ];

    protected \$casts = [
        'status' => 'string',
    ];

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return \\Database\\Factories\\{$moduleName}Factory::new();
    }

    // Scopes
    public function scopeActive(\$query)
    {
        return \$query->where('status', 'active');
    }

    public function scopeInactive(\$query)
    {
        return \$query->where('status', 'inactive');
    }
}
PHP;

        $basePath = app_path("Modules/{$moduleName}/Models");
        $filePath = "{$basePath}/{$moduleName}.php";
        File::put($filePath, $content);
        $result->addCreatedFile($filePath, 'model');
    }

    protected function createMigration(string $moduleName, ModuleGenerationResult $result): void
    {
        $timestamp = date('Y_m_d_His');
        $tableName = Str::snake(Str::plural($moduleName));
        $migrationName = "create_{$tableName}_table";

        $content = <<<PHP
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('{$tableName}', function (Blueprint \$table) {
            \$table->id();
            \$table->string('name');
            \$table->text('description')->nullable();
            \$table->enum('status', ['active', 'inactive'])->default('active');
            \$table->timestamps();

            \$table->index(['status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('{$tableName}');
    }
};
PHP;

        $migrationPath = database_path("migrations/{$timestamp}_{$migrationName}.php");
        File::put($migrationPath, $content);
        $result->addCreatedFile($migrationPath, 'migration');
    }

    protected function createFactory(string $moduleName, ModuleGenerationResult $result): void
    {
        $content = <<<PHP
<?php

namespace Database\Factories;

use App\Modules\\{$moduleName}\\Models\\{$moduleName};
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\\{$moduleName}\\Models\\{$moduleName}>
 */
class {$moduleName}Factory extends Factory
{
    protected \$model = {$moduleName}::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'status' => fake()->randomElement(['active', 'inactive']),
        ];
    }

    /**
     * Indicate that the model is active.
     */
    public function active(): static
    {
        return \$this->state(fn (array \$attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the model is inactive.
     */
    public function inactive(): static
    {
        return \$this->state(fn (array \$attributes) => [
            'status' => 'inactive',
        ]);
    }
}
PHP;

        $factoryPath = database_path("factories/{$moduleName}Factory.php");
        File::put($factoryPath, $content);
        $result->addCreatedFile($factoryPath, 'factory');
    }

    protected function createSeeder(string $moduleName, ModuleGenerationResult $result): void
    {
        $content = <<<PHP
<?php

namespace Database\Seeders;

use App\Modules\\{$moduleName}\\Models\\{$moduleName};
use Illuminate\Database\Seeder;

class {$moduleName}Seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 50 sample records
        {$moduleName}::factory(50)->create();

        // Create some specific active records
        {$moduleName}::factory(10)->active()->create();

        // Create some specific inactive records
        {$moduleName}::factory(5)->inactive()->create();
    }
}
PHP;

        $seederPath = database_path("seeders/{$moduleName}Seeder.php");
        File::put($seederPath, $content);
        $result->addCreatedFile($seederPath, 'seeder');
    }
}
