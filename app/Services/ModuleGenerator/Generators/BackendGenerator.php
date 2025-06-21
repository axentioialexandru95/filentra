<?php

namespace App\Services\ModuleGenerator\Generators;

use App\Services\ModuleGenerator\ModuleGenerationResult;
use Illuminate\Support\Facades\File;

class BackendGenerator
{
    /**
     * @param  array<string, bool>  $options
     */
    public function generate(string $moduleName, array $options, ModuleGenerationResult $result): void
    {
        $basePath = app_path("Modules/{$moduleName}");
        $isCrud = $options['crud'] ?? false;

        // Create backend directories
        $this->createDirectories($basePath, $result);

        // Create service provider
        $this->createServiceProvider($basePath, $moduleName, $result);

        // Create routes file
        $this->createRoutesFile($basePath, $moduleName, $isCrud, $result);

        // Create controller
        if ($isCrud) {
            $this->createCrudController($basePath, $moduleName, $result);
            $this->createFormRequests($basePath, $moduleName, $result);
        } else {
            $this->createSampleController($basePath, $moduleName, $result);
        }

        // Create resource if requested
        if ($options['resource'] ?? $isCrud) {
            $this->createApiResource($basePath, $moduleName, $result);
        }
    }

    protected function createDirectories(string $basePath, ModuleGenerationResult $result): void
    {
        $directories = [
            "{$basePath}/Controllers",
            "{$basePath}/Services",
            "{$basePath}/Requests",
            "{$basePath}/Resources",
            "{$basePath}/Models",
        ];

        foreach ($directories as $directory) {
            File::makeDirectory($directory, 0755, true);
            $result->addCreatedDirectory($directory);
        }
    }

    protected function createServiceProvider(string $basePath, string $moduleName, ModuleGenerationResult $result): void
    {
        $moduleNameLower = $this->kebabCase($moduleName);

        $content = <<<PHP
<?php

namespace App\Modules\\{$moduleName};

use Illuminate\Support\ServiceProvider;

class {$moduleName}ServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register module services here
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Load routes
        \$this->loadRoutesFrom(__DIR__ . '/routes.php');

        // Load views if needed
        // \$this->loadViewsFrom(__DIR__ . '/views', '{$moduleNameLower}');

        // Publish assets if needed
        // \$this->publishes([
        //     __DIR__ . '/assets' => public_path('modules/{$moduleNameLower}'),
        // ], '{$moduleNameLower}-assets');
    }
}
PHP;

        $filePath = "{$basePath}/{$moduleName}ServiceProvider.php";
        File::put($filePath, $content);
        $result->addCreatedFile($filePath, 'service_provider');
    }

    protected function createRoutesFile(string $basePath, string $moduleName, bool $isCrud, ModuleGenerationResult $result): void
    {
        $controllerNamespace = "App\\Modules\\{$moduleName}\\Controllers";
        $prefix = $this->kebabCase($moduleName);

        if ($isCrud) {
            $content = <<<PHP
<?php

use {$controllerNamespace}\\{$moduleName}Controller;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->group(function () {
    Route::prefix('{$prefix}')->name('{$prefix}.')->group(function () {
        Route::get('/', [{$moduleName}Controller::class, 'index'])->name('index');
        Route::get('/create', [{$moduleName}Controller::class, 'create'])->name('create');
        Route::post('/', [{$moduleName}Controller::class, 'store'])->name('store');
        Route::get('/{{$prefix}}', [{$moduleName}Controller::class, 'show'])->name('show');
        Route::get('/{{$prefix}}/edit', [{$moduleName}Controller::class, 'edit'])->name('edit');
        Route::patch('/{{$prefix}}', [{$moduleName}Controller::class, 'update'])->name('update');
        Route::delete('/{{$prefix}}', [{$moduleName}Controller::class, 'destroy'])->name('destroy');

        // API routes for data fetching
        Route::get('/api/stats', [{$moduleName}Controller::class, 'stats'])->name('api.stats');
        Route::get('/api/data', [{$moduleName}Controller::class, 'data'])->name('api.data');
    });
});
PHP;
        } else {
            $content = <<<PHP
<?php

use {$controllerNamespace}\\{$moduleName}Controller;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->group(function () {
    Route::prefix('{$prefix}')->name('{$prefix}.')->group(function () {
        Route::get('/', [{$moduleName}Controller::class, 'index'])->name('index');
        // Add more routes here
    });
});
PHP;
        }

        $filePath = "{$basePath}/routes.php";
        File::put($filePath, $content);
        $result->addCreatedFile($filePath, 'routes');
    }

    protected function createSampleController(string $basePath, string $moduleName, ModuleGenerationResult $result): void
    {
        $moduleNameLower = $this->kebabCase($moduleName);

        $content = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class {$moduleName}Controller extends Controller
{
    /**
     * Display the module index page.
     */
    public function index(Request \$request): Response
    {
        return Inertia::render('modules/{$moduleNameLower}/pages/index', [
            // Pass data to the frontend component
        ]);
    }
}
PHP;

        $filePath = "{$basePath}/Controllers/{$moduleName}Controller.php";
        File::put($filePath, $content);
        $result->addCreatedFile($filePath, 'controller');
    }

    protected function createCrudController(string $basePath, string $moduleName, ModuleGenerationResult $result): void
    {
        $modelNamespace = "App\\Modules\\{$moduleName}\\Models\\{$moduleName}";
        $resourceNamespace = "App\\Modules\\{$moduleName}\\Resources\\{$moduleName}Resource";
        $requestNamespace = "App\\Modules\\{$moduleName}\\Requests";
        $moduleNameLower = $this->kebabCase($moduleName);

        $content = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\Controllers;

use App\Http\Controllers\Controller;
use {$modelNamespace};
use {$resourceNamespace};
use {$requestNamespace}\\Store{$moduleName}Request;
use {$requestNamespace}\\Update{$moduleName}Request;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class {$moduleName}Controller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request \$request): Response
    {
        \$items = {$moduleName}::query()
            ->when(\$request->search, function (\$query, \$search) {
                \$query->where('name', 'like', "%{\$search}%");
            })
            ->when(\$request->status, function (\$query, \$status) {
                \$query->where('status', \$status);
            })
            ->latest()
            ->paginate(10);

        \$stats = [
            'total' => {$moduleName}::count(),
            'active' => {$moduleName}::where('status', 'active')->count(),
            'inactive' => {$moduleName}::where('status', 'inactive')->count(),
            'recent' => {$moduleName}::whereDate('created_at', '>=', now()->subDays(7))->count(),
        ];

        return Inertia::render('modules/{$moduleNameLower}/pages/index', [
            'data' => \$items,
            'stats' => \$stats,
            'filters' => \$request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('modules/{$moduleNameLower}/pages/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Store{$moduleName}Request \$request)
    {
        \$item = {$moduleName}::create(\$request->validated());

        return redirect()->route('{$moduleNameLower}.index')
            ->with('success', '{$moduleName} created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show({$moduleName} \${$moduleNameLower}): Response
    {
        return Inertia::render('modules/{$moduleNameLower}/pages/show', [
            'item' => new {$moduleName}Resource(\${$moduleNameLower}),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit({$moduleName} \${$moduleNameLower}): Response
    {
        return Inertia::render('modules/{$moduleNameLower}/pages/edit', [
            'item' => new {$moduleName}Resource(\${$moduleNameLower}),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Update{$moduleName}Request \$request, {$moduleName} \${$moduleNameLower})
    {
        \${$moduleNameLower}->update(\$request->validated());

        return redirect()->route('{$moduleNameLower}.index')
            ->with('success', '{$moduleName} updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy({$moduleName} \${$moduleNameLower})
    {
        \${$moduleNameLower}->delete();

        return redirect()->route('{$moduleNameLower}.index')
            ->with('success', '{$moduleName} deleted successfully.');
    }

    /**
     * Get stats for the module.
     */
    public function stats()
    {
        return response()->json([
            'total' => {$moduleName}::count(),
            'active' => {$moduleName}::where('status', 'active')->count(),
            'inactive' => {$moduleName}::where('status', 'inactive')->count(),
            'recent' => {$moduleName}::whereDate('created_at', '>=', now()->subDays(7))->count(),
        ]);
    }

    /**
     * Get data for the module.
     */
    public function data(Request \$request)
    {
        \$items = {$moduleName}::query()
            ->when(\$request->search, function (\$query, \$search) {
                \$query->where('name', 'like', "%{\$search}%");
            })
            ->when(\$request->status, function (\$query, \$status) {
                \$query->where('status', \$status);
            })
            ->latest()
            ->paginate(10);

        return {$moduleName}Resource::collection(\$items);
    }
}
PHP;

        $filePath = "{$basePath}/Controllers/{$moduleName}Controller.php";
        File::put($filePath, $content);
        $result->addCreatedFile($filePath, 'crud_controller');
    }

    protected function createFormRequests(string $basePath, string $moduleName, ModuleGenerationResult $result): void
    {
        // Create Store Request
        $storeContent = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Store{$moduleName}Request extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ];
    }
}
PHP;

        // Create Update Request
        $updateContent = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Update{$moduleName}Request extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ];
    }
}
PHP;

        $storeFilePath = "{$basePath}/Requests/Store{$moduleName}Request.php";
        $updateFilePath = "{$basePath}/Requests/Update{$moduleName}Request.php";

        File::put($storeFilePath, $storeContent);
        File::put($updateFilePath, $updateContent);

        $result->addCreatedFile($storeFilePath, 'form_request');
        $result->addCreatedFile($updateFilePath, 'form_request');
    }

    protected function createApiResource(string $basePath, string $moduleName, ModuleGenerationResult $result): void
    {
        $content = <<<PHP
<?php

namespace App\Modules\\{$moduleName}\\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class {$moduleName}Resource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request \$request): array
    {
        return [
            'id' => \$this->id,
            'name' => \$this->name,
            'description' => \$this->description,
            'status' => \$this->status,
            'created_at' => \$this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => \$this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
PHP;

        $filePath = "{$basePath}/Resources/{$moduleName}Resource.php";
        File::put($filePath, $content);
        $result->addCreatedFile($filePath, 'api_resource');
    }

    protected function kebabCase(string $value): string
    {
        if (ctype_upper($value)) {
            return strtolower($value);
        }

        $value = preg_replace('/([A-Z]+)([A-Z][a-z])/', '$1-$2', $value);
        $value = preg_replace('/([a-z])([A-Z])/', '$1-$2', $value);

        return strtolower($value);
    }
}
