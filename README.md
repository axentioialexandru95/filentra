# Filentra

A modern Laravel application with React frontend, built for file management and collaboration.

## Tech Stack

- **Backend**: Laravel 12.x with PHP 8.4
- **Frontend**: React 19 with TypeScript and Inertia.js
- **Database**: MySQL/SQLite
- **Testing**: Pest PHP, Jest, Laravel Dusk
- **Code Quality**: PHPStan, Laravel Pint, ESLint, Prettier

## Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd Filentra
composer install
npm install

# Environment setup
cp .env.example .env
php artisan key:generate
php artisan migrate

# Development
composer dev  # Starts all services (Laravel, Queue, Logs, Vite)
```

## Code Quality & Static Analysis

### PHPStan Static Analysis

This project uses PHPStan with Larastan for comprehensive PHP static analysis.

```bash
# Run PHPStan (shows only new errors)
composer phpstan

# Run full analysis (shows all errors including baseline)
composer phpstan:check

# Generate new baseline (when fixing existing errors)
composer phpstan:baseline

# Clear analysis cache
composer phpstan:clear
```

**Configuration:**
- **Level**: 6 (good balance of strictness and practicality)
- **Baseline**: 42 existing errors are baselined for gradual improvement
- **Laravel Integration**: Full support for facades, Eloquent, collections
- **CI/CD**: Automatically runs in GitHub Actions

### Other Quality Tools

```bash
# PHP code style
vendor/bin/pint

# Frontend linting
npm run lint
npm run types
npm run format

# All tests
composer test     # PHP tests
npm test         # JavaScript tests
php artisan dusk # Browser tests
```

## Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-functionality
   ```

2. **Write Code & Tests**
   - PHP code follows PSR-12 standards
   - TypeScript with strict type checking
   - All new code must pass PHPStan level 6

3. **Run Quality Checks**
   ```bash
   composer phpstan  # Must pass
   vendor/bin/pint   # Auto-fixes style
   npm run lint      # Must pass
   composer test     # Must pass
   ```

4. **Create Pull Request**
   - GitHub Actions automatically run quality checks
   - PHPStan must pass (only new errors block merge)
   - All tests must pass
   - Code style and linting must pass

## Testing

### PHP Tests (Pest)
```bash
composer test                    # Run all PHP tests
./vendor/bin/pest --coverage    # With coverage
./vendor/bin/pest --filter=Unit # Specific suite
```

### JavaScript Tests (Jest)
```bash
npm test              # Run all JS tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

### Browser Tests (Dusk)
```bash
php artisan dusk                    # All browser tests
php artisan dusk --group=auth       # Specific group
```

## Project Structure

```
Filentra/
├── app/                    # Laravel application code
├── resources/
│   ├── js/                # React/TypeScript frontend
│   └── views/             # Blade templates (minimal)
├── tests/
│   ├── Feature/           # Feature tests (Pest)
│   ├── Unit/              # Unit tests (Pest)
│   ├── Browser/           # Browser tests (Dusk)
│   └── javascript/        # Frontend tests (Jest)
├── docs/                  # Project documentation
├── .github/workflows/     # CI/CD workflows
├── phpstan.neon          # PHPStan configuration
└── phpstan-baseline.neon # PHPStan baseline
```

## Documentation

- [PHPStan Setup](docs/PHPSTAN.md)
- [Testing Guide](docs/TESTING_SETUP.md)

## CI/CD

GitHub Actions workflows automatically:
- Run PHPStan static analysis
- Execute all test suites
- Check code formatting
- Lint frontend code
- Validate TypeScript types

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all quality checks pass
5. Submit a pull request

**Quality Requirements:**
- PHPStan Level 6 compliance
- All tests pass
- Code style compliance (Pint)
- Frontend linting passes
- No new PHPStan errors

## License

MIT License. See [LICENSE](LICENSE) for details.