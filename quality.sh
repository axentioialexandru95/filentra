#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Functions
print_header() {
    echo -e "\n${BLUE}${BOLD}========================================${NC}"
    echo -e "${BLUE}${BOLD} $1${NC}"
    echo -e "${BLUE}${BOLD}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Default values
RUN_TESTS=true
FIX_ISSUES=false
QUICK_MODE=false
VERBOSE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --fix)
            FIX_ISSUES=true
            shift
            ;;
        --no-tests)
            RUN_TESTS=false
            shift
            ;;
        --quick)
            QUICK_MODE=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help|-h)
            echo "Laravel Code Quality Script"
            echo ""
            echo "Usage: ./quality.sh [options]"
            echo ""
            echo "Options:"
            echo "  --fix        Fix issues automatically where possible"
            echo "  --no-tests   Skip running tests"
            echo "  --quick      Run only essential checks (skip detailed reports)"
            echo "  --verbose    Show detailed output"
            echo "  --help, -h   Show this help message"
            echo ""
            echo "Examples:"
            echo "  ./quality.sh                # Check everything"
            echo "  ./quality.sh --fix          # Check and fix issues"
            echo "  ./quality.sh --quick --fix  # Quick check and fix"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for available options"
            exit 1
            ;;
    esac
done

# Start script
clear
print_header "🚀 LARAVEL CODE QUALITY CHECKER"

if [ "$FIX_ISSUES" = true ]; then
    print_info "Running in FIX mode - issues will be automatically corrected where possible"
fi

if [ "$QUICK_MODE" = true ]; then
    print_info "Running in QUICK mode - detailed reports will be skipped"
fi

# Check if we're in a Laravel project
if [ ! -f "artisan" ]; then
    print_error "This doesn't appear to be a Laravel project (no artisan file found)"
    exit 1
fi

TOTAL_ERRORS=0

# 1. Clear Laravel config cache
print_header "📋 PREPARING ENVIRONMENT"
if $VERBOSE; then
    php artisan config:clear --ansi
else
    php artisan config:clear --ansi >/dev/null 2>&1
fi

if [ $? -eq 0 ]; then
    print_success "Laravel config cache cleared"
else
    print_warning "Could not clear Laravel config cache"
fi

# 2. Code Style Fixing (if --fix flag is used)
if [ "$FIX_ISSUES" = true ]; then
    print_header "🔧 FIXING CODE STYLE"

    print_info "Running Laravel Pint..."
    if $VERBOSE; then
        ./vendor/bin/pint
    else
        ./vendor/bin/pint >/dev/null 2>&1
    fi

    if [ $? -eq 0 ]; then
        print_success "Laravel Pint completed"
    else
        print_warning "Laravel Pint found issues (this is normal)"
    fi

    print_info "Running PHP_CodeSniffer auto-fixer..."
    if $VERBOSE; then
        ./vendor/bin/phpcbf
    else
        ./vendor/bin/phpcbf >/dev/null 2>&1
    fi

    if [ $? -eq 0 ]; then
        print_success "PHP_CodeSniffer auto-fix completed"
    else
        print_warning "PHP_CodeSniffer auto-fix found issues (this is normal)"
    fi
fi

# 3. Static Analysis with PHPStan
print_header "🔍 STATIC ANALYSIS (PHPStan)"
if $VERBOSE || [ "$QUICK_MODE" = false ]; then
    ./vendor/bin/phpstan analyse --memory-limit=1G
else
    ./vendor/bin/phpstan analyse --memory-limit=1G --quiet
fi

PHPSTAN_EXIT=$?
if [ $PHPSTAN_EXIT -eq 0 ]; then
    print_success "PHPStan analysis passed"
else
    print_error "PHPStan found issues"
    TOTAL_ERRORS=$((TOTAL_ERRORS + 1))
fi

# 4. Code Style Check with PHP_CodeSniffer
print_header "📏 CODE STYLE CHECK (PHP_CodeSniffer)"
if [ "$QUICK_MODE" = true ]; then
    PHPCS_OUTPUT=$(./vendor/bin/phpcs --report=summary 2>&1)
else
    PHPCS_OUTPUT=$(./vendor/bin/phpcs --report=full 2>&1)
fi

PHPCS_EXIT=$?
echo "$PHPCS_OUTPUT"

if [ $PHPCS_EXIT -eq 0 ]; then
    print_success "PHP_CodeSniffer check passed"
elif [ $PHPCS_EXIT -eq 1 ]; then
    print_warning "PHP_CodeSniffer found fixable issues"
    if [ "$FIX_ISSUES" = false ]; then
        print_info "Run with --fix to automatically fix these issues"
    fi
    TOTAL_ERRORS=$((TOTAL_ERRORS + 1))
else
    print_error "PHP_CodeSniffer encountered an error"
    TOTAL_ERRORS=$((TOTAL_ERRORS + 1))
fi

# 5. Laravel Pint Check (if not already fixed)
if [ "$FIX_ISSUES" = false ]; then
    print_header "✨ LARAVEL PINT CHECK"
    PINT_OUTPUT=$(./vendor/bin/pint --test 2>&1)
    PINT_EXIT=$?

    if [ "$QUICK_MODE" = false ] || [ $PINT_EXIT -ne 0 ]; then
        echo "$PINT_OUTPUT"
    fi

    if [ $PINT_EXIT -eq 0 ]; then
        print_success "Laravel Pint check passed"
    else
        print_warning "Laravel Pint found style issues"
        print_info "Run with --fix to automatically fix these issues"
        TOTAL_ERRORS=$((TOTAL_ERRORS + 1))
    fi
fi

# 6. Run Tests
if [ "$RUN_TESTS" = true ]; then
    print_header "🧪 RUNNING TESTS"
    if $VERBOSE; then
        php artisan test
    else
        php artisan test --quiet
    fi

    TESTS_EXIT=$?
    if [ $TESTS_EXIT -eq 0 ]; then
        print_success "All tests passed"
    else
        print_error "Some tests failed"
        TOTAL_ERRORS=$((TOTAL_ERRORS + 1))
    fi
fi

# 7. Summary
print_header "📊 SUMMARY"

if [ $TOTAL_ERRORS -eq 0 ]; then
    print_success "All quality checks passed! 🎉"
    echo -e "\n${GREEN}${BOLD}Your code quality is excellent!${NC}"
else
    print_error "Found issues in $TOTAL_ERRORS check(s)"
    echo -e "\n${YELLOW}${BOLD}Recommendations:${NC}"

    if [ "$FIX_ISSUES" = false ]; then
        echo -e "${YELLOW}• Run ${BOLD}./quality.sh --fix${NC}${YELLOW} to automatically fix style issues${NC}"
    fi

    echo -e "${YELLOW}• Review PHPStan output for potential bugs${NC}"
    echo -e "${YELLOW}• Fix any failing tests${NC}"
    echo -e "${YELLOW}• Consider running ${BOLD}composer quality:fix${NC}${YELLOW} for additional options${NC}"
fi

# Available composer commands info
echo -e "\n${BLUE}${BOLD}Available Composer Commands:${NC}"
echo -e "${BLUE}• composer quality:check  ${NC}- Run all checks without fixing"
echo -e "${BLUE}• composer quality:fix    ${NC}- Run all checks and fix issues"
echo -e "${BLUE}• composer cs:check       ${NC}- Check code style only"
echo -e "${BLUE}• composer cs:fix         ${NC}- Fix code style only"
echo -e "${BLUE}• composer phpstan        ${NC}- Run PHPStan only"
echo -e "${BLUE}• composer test           ${NC}- Run tests only"

echo ""

# Exit with error code if issues were found
if [ $TOTAL_ERRORS -gt 0 ]; then
    exit 1
else
    exit 0
fi
