<?php

namespace App\Console\Commands;

use App\Services\ModuleGenerator\ModuleGenerationResult;
use App\Services\ModuleGenerator\ModuleGeneratorService;
use Illuminate\Console\Command;

class GenerateModule extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'filentra:make {name : The name of the module}
                           {--model : Generate a model for the module}
                           {--migration : Generate migration files}
                           {--factory : Generate factory files}
                           {--seeder : Generate seeder files}
                           {--resource : Generate API resource files}
                           {--crud : Generate full CRUD functionality (includes all options)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate a new Filentra module with complete backend and frontend structure and optional CRUD functionality';

    protected ModuleGeneratorService $moduleGenerator;

    public function __construct(ModuleGeneratorService $moduleGenerator)
    {
        parent::__construct();
        $this->moduleGenerator = $moduleGenerator;
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $name = $this->argument('name');

        // Build options array
        $options = [
            'crud' => $this->option('crud'),
            'model' => $this->option('model'),
            'migration' => $this->option('migration'),
            'factory' => $this->option('factory'),
            'seeder' => $this->option('seeder'),
            'resource' => $this->option('resource'),
        ];

        $this->info("Creating module: {$name}");

        // Generate the module
        $result = $this->moduleGenerator->generate($name, $options);

        // Display results
        $this->displayResults($result, $options);

        return Command::SUCCESS;
    }

    /**
     * @param  array<string, bool>  $options
     */
    protected function displayResults(ModuleGenerationResult $result, array $options): void
    {
        if ($result->hasErrors()) {
            $this->error('❌ Module generation failed!');
            foreach ($result->getErrors() as $error) {
                $this->error("   • {$error}");
            }

            return;
        }

        $this->info("✅ Module {$result->getModuleName()} created successfully!");
        $this->newLine();

        $this->comment('📁 Created structure:');
        $this->line("   Backend:  {$result->getBackendPath()}");
        $this->line("   Frontend: {$result->getFrontendPath()}");
        $this->newLine();

        // Display success messages
        foreach ($result->getSuccesses() as $success) {
            $this->line("   ✅ {$success}");
        }

        // Display warnings
        foreach ($result->getWarnings() as $warning) {
            $this->warn("   ⚠️  {$warning}");
        }

        $this->newLine();

        $this->comment('🚀 Next steps:');
        $this->displayNextSteps($options, $result);

        $this->newLine();

        $this->comment('📋 Files created:');
        $this->displayCreatedFiles($result, $options);
    }

    /**
     * @param  array<string, bool>  $options
     */
    protected function displayNextSteps(array $options, ModuleGenerationResult $result): void
    {
        $steps = ['   1. Run: composer dump-autoload'];

        if ($options['migration'] || $options['crud']) {
            $steps[] = '   2. Run: php artisan migrate';
            $steps[] = '   3. Build frontend: npm run build';
        } else {
            $steps[] = '   2. Build frontend: npm run build';
        }

        if ($options['seeder'] || $options['crud']) {
            $steps[] = '   ' . (count($steps) + 1) . ". Run: php artisan db:seed --class={$result->getModuleName()}Seeder";
        }

        foreach ($steps as $step) {
            $this->line($step);
        }
    }

    /**
     * @param  array<string, bool>  $options
     */
    protected function displayCreatedFiles(ModuleGenerationResult $result, array $options): void
    {
        $isCrud = $options['crud'];

        $this->line('   • Controllers, Services, Requests, Resources directories');
        $this->line("   • {$result->getModuleName()}ServiceProvider.php with route loading");
        $this->line('   • routes.php with ' . ($isCrud ? 'full CRUD routes' : 'sample routes'));
        $this->line('   • Frontend components, pages, hooks, actions directories');
        $this->line('   • types.ts with TypeScript interfaces');
        $this->line('   • ' . ($isCrud ? 'Complete CRUD React pages with table and forms' : 'Sample React page with layout'));

        if ($options['model'] || $isCrud) {
            $this->line("   • {$result->getModuleName()} model");
        }
        if ($options['migration'] || $isCrud) {
            $this->line("   • Database migration for {$result->getModuleNameLower()} table");
        }
        if ($options['factory'] || $isCrud) {
            $this->line("   • {$result->getModuleName()}Factory for testing");
        }
        if ($options['seeder'] || $isCrud) {
            $this->line("   • {$result->getModuleName()}Seeder with sample data");
        }
        if ($options['resource'] || $isCrud) {
            $this->line("   • API Resource for {$result->getModuleName()}");
        }

        $this->line('   • Service provider auto-registered in bootstrap/providers.php');

        // Show file count summary
        $summary = $result->getSummary();
        $this->newLine();
        $this->comment("📊 Summary: {$summary['files_created']} files created in {$summary['directories_created']} directories");
    }
}
