<?php

namespace App\Services\ModuleGenerator;

class ModuleGenerationResult
{
    protected string $moduleName;
    protected string $moduleNameLower;
    protected array $createdFiles = [];
    protected array $createdDirectories = [];
    protected array $messages = [];
    protected array $errors = [];
    protected array $warnings = [];
    protected array $successes = [];

    public function __construct(string $moduleName, string $moduleNameLower)
    {
        $this->moduleName = $moduleName;
        $this->moduleNameLower = $moduleNameLower;
    }

    public function getModuleName(): string
    {
        return $this->moduleName;
    }

    public function getModuleNameLower(): string
    {
        return $this->moduleNameLower;
    }

    public function addCreatedFile(string $path, string $type = 'file'): void
    {
        $this->createdFiles[] = [
            'path' => $path,
            'type' => $type,
            'created_at' => now(),
        ];
    }

    public function addCreatedDirectory(string $path): void
    {
        $this->createdDirectories[] = [
            'path' => $path,
            'created_at' => now(),
        ];
    }

    public function addMessage(string $message, string $type = 'info'): void
    {
        $this->messages[] = [
            'message' => $message,
            'type' => $type,
            'timestamp' => now(),
        ];
    }

    public function addError(string $message): void
    {
        $this->errors[] = $message;
        $this->addMessage($message, 'error');
    }

    public function addWarning(string $message): void
    {
        $this->warnings[] = $message;
        $this->addMessage($message, 'warning');
    }

    public function addSuccess(string $message): void
    {
        $this->successes[] = $message;
        $this->addMessage($message, 'success');
    }

    public function getCreatedFiles(): array
    {
        return $this->createdFiles;
    }

    public function getCreatedDirectories(): array
    {
        return $this->createdDirectories;
    }

    public function getMessages(): array
    {
        return $this->messages;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getWarnings(): array
    {
        return $this->warnings;
    }

    public function getSuccesses(): array
    {
        return $this->successes;
    }

    public function hasErrors(): bool
    {
        return !empty($this->errors);
    }

    public function hasWarnings(): bool
    {
        return !empty($this->warnings);
    }

    public function isSuccessful(): bool
    {
        return !$this->hasErrors();
    }

    public function getBackendPath(): string
    {
        return "app/Modules/{$this->moduleName}/";
    }

    public function getFrontendPath(): string
    {
        return "resources/js/modules/{$this->moduleNameLower}/";
    }

    public function getSummary(): array
    {
        return [
            'module_name' => $this->moduleName,
            'module_name_lower' => $this->moduleNameLower,
            'backend_path' => $this->getBackendPath(),
            'frontend_path' => $this->getFrontendPath(),
            'files_created' => count($this->createdFiles),
            'directories_created' => count($this->createdDirectories),
            'errors' => count($this->errors),
            'warnings' => count($this->warnings),
            'successes' => count($this->successes),
            'is_successful' => $this->isSuccessful(),
        ];
    }
}
