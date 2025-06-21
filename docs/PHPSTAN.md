# PHPStan Static Analysis Setup

PHPStan is a powerful static analysis tool for PHP that helps catch bugs and improve code quality by analyzing your code without executing it.

## Installation

PHPStan is installed with Larastan (Laravel extension):

```bash
composer require --dev phpstan/phpstan "larastan/larastan:^3.0"
```

## Configuration

PHPStan is configured via `phpstan.neon` in the project root. The current configuration:

- **Analysis Level**: 6 (out of 9) - provides good balance between strictness and practicality
- **Paths Analyzed**: `app/`, `database/`, `routes/`, `tests/`, `config/`, `bootstrap/providers.php`
- **Extensions**: Larastan v3.x (Laravel-specific rules and understanding)
- **Baseline**: `phpstan-baseline.neon` (existing errors to ignore while focusing on new issues)
- **Alternative Config**: `phpstan-no-baseline.neon` (for checking all errors including baseline)

## Usage

### Basic Analysis
```bash
# Run PHPStan analysis
composer phpstan

# Or directly
./vendor/bin/phpstan analyse
```

### Available Commands

```bash
# Standard analysis (with baseline - shows only new errors)
composer phpstan

# Check all errors (ignores baseline - shows everything)
composer phpstan:check

# Generate a new baseline (use when you want to ignore current errors)
composer phpstan:baseline

# Clear result cache (useful when configuration changes)
composer phpstan:clear
```

### IDE Integration

#### VS Code
1. Install the "PHPStan" extension
2. The `.vscode/settings.json` file is already configured
3. PHPStan will run automatically and show errors inline

#### PHPStorm
1. Go to Settings → Languages & Frameworks → PHP → Quality Tools → PHPStan
2. Set PHPStan path to: `./vendor/bin/phpstan`
3. Set Configuration file to: `./phpstan.neon`

#### Other IDEs
Most PHP IDEs support PHPStan through plugins or built-in integration.

## Understanding PHPStan Levels

- **Level 0**: Basic checks (missing functions, classes)
- **Level 1**: Undefined variables, unknown properties on objects
- **Level 2**: Unknown methods, calling methods on possibly null
- **Level 3**: Return types, types assigned to properties
- **Level 4**: Basic dead code detection
- **Level 5**: Checking types of arguments passed to methods
- **Level 6**: Report missing typehints *(current level)*
- **Level 7**: Report partially wrong union types
- **Level 8**: Report calling methods and accessing properties on nullable types
- **Level 9**: Be strict about the mixed type

## Common Error Types

### Missing Type Hints
```php
// ❌ PHPStan will complain
public function process($data)
{
    return $data;
}

// ✅ Better
public function process(array $data): array
{
    return $data;
}
```

### Undefined Methods
```php
// ❌ PHPStan doesn't know about Laravel test methods
$this->get('/'); // In a regular PHPUnit test

// ✅ Use proper base class or add PHPDoc
class MyTest extends Tests\TestCase // Extends Laravel's TestCase
{
    public function test_something()
    {
        $this->get('/'); // Now PHPStan knows about this method
    }
}
```

### Mixed Types
```php
// ❌ PHPStan doesn't like mixed
public function getData(): mixed
{
    return $this->data;
}

// ✅ Be more specific
/**
 * @return array<string, mixed>
 */
public function getData(): array
{
    return $this->data;
}
```

## Working with the Baseline

The baseline file (`phpstan-baseline.neon`) contains errors that existed when PHPStan was first set up. This allows you to:

1. **Focus on new code**: Only new errors will be reported
2. **Gradual improvement**: Fix baseline errors over time
3. **Team adoption**: Don't get overwhelmed by existing issues

### Updating the Baseline

```bash
# When you fix some baseline errors, regenerate it
composer phpstan:baseline

# This will create a new baseline with remaining errors
```

## Best Practices

### 1. Run PHPStan in CI/CD
Add to your GitHub Actions or similar:
```yaml
- name: Run PHPStan
  run: composer phpstan
```

### 2. Fix New Errors Immediately
Don't let new errors accumulate. Fix them as they appear.

### 3. Gradually Increase Level
Start at level 6, then increase over time:
```neon
parameters:
    level: 7  # Increase when ready for more strict analysis
```

### 4. Use PHPDoc When Needed
Sometimes PHPStan needs help understanding your code:
```php
/**
 * @param array<string, mixed> $config
 * @return Collection<int, User>
 */
public function processUsers(array $config): Collection
{
    // Implementation
}
```

### 5. Ignore Specific Errors Carefully
Only ignore errors when absolutely necessary:
```neon
parameters:
    ignoreErrors:
        - '#Call to an undefined method App\\Models\\.*#'
```

## Laravel-Specific Features

### Larastan Benefits
- Understands Laravel facades
- Knows about Eloquent relationships
- Recognizes Laravel helper functions
- Understands collection methods
- Validates blade templates (partially)

### Common Laravel Patterns
```php
// ✅ Larastan understands these
User::where('email', $email)->first();
collect($items)->filter()->map();
Cache::remember('key', 3600, fn() => expensive_operation());
```

## Troubleshooting

### Memory Issues
If PHPStan runs out of memory:
```bash
# Increase memory limit
./vendor/bin/phpstan analyse --memory-limit=2G
```

### Cache Issues
If you see strange errors:
```bash
# Clear cache
composer phpstan:clear
```

### Configuration Issues
Validate your configuration:
```bash
# Test configuration
./vendor/bin/phpstan analyse --configuration=phpstan.neon --dry-run
```

## Resources

- [PHPStan Documentation](https://phpstan.org/user-guide/getting-started)
- [Larastan Documentation](https://github.com/larastan/larastan)
- [PHPStan Rule Levels](https://phpstan.org/user-guide/rule-levels)
- [Writing Custom Rules](https://phpstan.org/developing-extensions/extension-types)