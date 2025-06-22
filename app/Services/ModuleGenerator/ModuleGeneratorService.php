<?php

namespace App\Services\ModuleGenerator;

use App\Services\ModuleGenerator\Generators\BackendGenerator;
use App\Services\ModuleGenerator\Generators\DatabaseGenerator;
use App\Services\ModuleGenerator\Generators\FrontendGenerator;
use Illuminate\Support\Str;

class ModuleGeneratorService
{
    protected BackendGenerator $backendGenerator;

    protected FrontendGenerator $frontendGenerator;

    protected DatabaseGenerator $databaseGenerator;

    public function __construct()
    {
        $this->backendGenerator = new BackendGenerator;
        $this->frontendGenerator = new FrontendGenerator;
        $this->databaseGenerator = new DatabaseGenerator;
    }

    /**
     * @param  array<string, bool>  $options
     */
    public function generate(string $name, array $options = []): ModuleGenerationResult
    {
        $moduleName = Str::studly($name);
        $moduleNameLower = $this->kebabCase($name);

        $result = new ModuleGenerationResult($moduleName, $moduleNameLower);

        // Generate backend structure
        $this->backendGenerator->generate($moduleName, $options, $result);

        // Generate frontend structure
        $this->frontendGenerator->generate($moduleNameLower, $options, $result);

        // Generate database files if requested
        if ($this->shouldGenerateDatabase($options)) {
            $this->databaseGenerator->generate($moduleName, $options, $result);
        }

        // Register service provider
        $this->registerServiceProvider($moduleName, $result);

        return $result;
    }

    /**
     * @param  array<string, bool>  $options
     */
    protected function shouldGenerateDatabase(array $options): bool
    {
        return ($options['crud'] ?? false) ||
               ($options['model'] ?? false) ||
               ($options['migration'] ?? false) ||
               ($options['factory'] ?? false) ||
               ($options['seeder'] ?? false);
    }

    protected function registerServiceProvider(string $moduleName, ModuleGenerationResult $result): void
    {
        $providersPath = base_path('bootstrap/providers.php');
        $providerClass = "App\\Modules\\{$moduleName}\\{$moduleName}ServiceProvider::class";

        if (! file_exists($providersPath)) {
            $result->addError('Could not find bootstrap/providers.php file');

            return;
        }

        $content = file_get_contents($providersPath);

        // Check if provider is already registered
        if (str_contains($content, $providerClass)) {
            $result->addWarning('Service provider already registered');

            return;
        }

        // Add the provider before the closing bracket
        $pattern = '/(\s*\];?\s*)$/';
        $replacement = "    {$providerClass},\n$1";
        $newContent = preg_replace($pattern, $replacement, $content);

        // Clean up any formatting issues
        $newContent = preg_replace('/,\s*,/', ',', $newContent);
        $newContent = preg_replace('/(\w),(\w)/', '$1,\n    $2', $newContent);

        file_put_contents($providersPath, $newContent);
        $result->addSuccess('Service provider registered automatically');
    }

    protected function kebabCase(string $value): string
    {
        // Handle acronyms properly (e.g., CRM -> crm, not c-r-m)
        if (ctype_upper($value)) {
            return strtolower($value);
        }

        // Handle mixed case with acronyms (e.g., APIKey -> api-key, CRMSystem -> crm-system)
        // First, handle sequences of capitals followed by lowercase
        $value = preg_replace('/([A-Z]+)([A-Z][a-z])/', '$1-$2', $value);
        // Then handle lowercase followed by capital
        $value = preg_replace('/([a-z])([A-Z])/', '$1-$2', $value);

        return strtolower($value);
    }
}
