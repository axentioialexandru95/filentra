#!/bin/bash

# GitHub Workflows Validation Script
# This script validates that all GitHub workflows are properly configured

set -e

echo "🔍 Validating GitHub Workflows..."

WORKFLOWS_DIR=".github/workflows"
REQUIRED_WORKFLOWS=("lint.yml" "tests.yml" "phpstan.yml" "code-quality.yml")
VALIDATION_ERRORS=0

# Check if workflows directory exists
if [[ ! -d "$WORKFLOWS_DIR" ]]; then
    echo "❌ Workflows directory not found: $WORKFLOWS_DIR"
    exit 1
fi

echo "📁 Found workflows directory: $WORKFLOWS_DIR"

# Check for required workflow files
echo "📋 Checking required workflow files..."
for workflow in "${REQUIRED_WORKFLOWS[@]}"; do
    if [[ -f "$WORKFLOWS_DIR/$workflow" ]]; then
        echo "✅ $workflow exists"
    else
        echo "❌ $workflow is missing"
        ((VALIDATION_ERRORS++))
    fi
done

# Validate PHPStan configuration
echo "🔧 Validating PHPStan configuration..."
if [[ -f "phpstan.neon" ]]; then
    echo "✅ phpstan.neon exists"

    # Check if Larastan is included
    if grep -q "larastan/larastan/extension.neon" phpstan.neon; then
        echo "✅ Larastan extension is configured"
    else
        echo "⚠️  Larastan extension might not be configured"
        ((VALIDATION_ERRORS++))
    fi

    # Check if baseline is included
    if grep -q "phpstan-baseline.neon" phpstan.neon; then
        echo "✅ Baseline is configured"
    else
        echo "⚠️  Baseline might not be configured"
    fi
else
    echo "❌ phpstan.neon is missing"
    ((VALIDATION_ERRORS++))
fi

# Check if PHPStan baseline exists
if [[ -f "phpstan-baseline.neon" ]]; then
    echo "✅ PHPStan baseline exists"
else
    echo "⚠️  PHPStan baseline not found (this is OK for new projects)"
fi

# Check if alternative config exists
if [[ -f "phpstan-no-baseline.neon" ]]; then
    echo "✅ Alternative PHPStan config exists"
else
    echo "⚠️  Alternative PHPStan config not found"
fi

# Validate composer scripts
echo "🎼 Validating Composer scripts..."
if [[ -f "composer.json" ]]; then
    if grep -q '"phpstan"' composer.json; then
        echo "✅ PHPStan composer script exists"
    else
        echo "❌ PHPStan composer script is missing"
        ((VALIDATION_ERRORS++))
    fi

    if grep -q '"phpstan:baseline"' composer.json; then
        echo "✅ PHPStan baseline composer script exists"
    else
        echo "❌ PHPStan baseline composer script is missing"
        ((VALIDATION_ERRORS++))
    fi

    if grep -q '"phpstan:check"' composer.json; then
        echo "✅ PHPStan check composer script exists"
    else
        echo "❌ PHPStan check composer script is missing"
        ((VALIDATION_ERRORS++))
    fi
else
    echo "❌ composer.json not found"
    ((VALIDATION_ERRORS++))
fi

# Validate package.json scripts
echo "📦 Validating NPM scripts..."
if [[ -f "package.json" ]]; then
    if grep -q '"types"' package.json; then
        echo "✅ TypeScript check script exists"
    else
        echo "❌ TypeScript check script is missing"
        ((VALIDATION_ERRORS++))
    fi

    if grep -q '"lint"' package.json; then
        echo "✅ Linting script exists"
    else
        echo "❌ Linting script is missing"
        ((VALIDATION_ERRORS++))
    fi
else
    echo "❌ package.json not found"
    ((VALIDATION_ERRORS++))
fi

# Check for required dependencies
echo "🔍 Checking required dependencies..."
if grep -q '"phpstan/phpstan"' composer.json; then
    echo "✅ PHPStan is installed"
else
    echo "❌ PHPStan is not installed"
    ((VALIDATION_ERRORS++))
fi

if grep -q '"larastan/larastan"' composer.json; then
    echo "✅ Larastan is installed"
else
    echo "❌ Larastan is not installed"
    ((VALIDATION_ERRORS++))
fi

# Validate workflow syntax (basic check)
echo "🔧 Validating workflow syntax..."
for workflow_file in "$WORKFLOWS_DIR"/*.yml; do
    if [[ -f "$workflow_file" ]]; then
        workflow_name=$(basename "$workflow_file")
        if grep -q "name:" "$workflow_file" && grep -q "on:" "$workflow_file" && grep -q "jobs:" "$workflow_file"; then
            echo "✅ $workflow_name has valid basic structure"
        else
            echo "❌ $workflow_name has invalid structure"
            ((VALIDATION_ERRORS++))
        fi
    fi
done

# Check for PHPStan in workflows
echo "🔍 Checking PHPStan integration in workflows..."
phpstan_found=false
for workflow_file in "$WORKFLOWS_DIR"/*.yml; do
    if [[ -f "$workflow_file" ]]; then
        if grep -q "phpstan\|PHPStan" "$workflow_file"; then
            workflow_name=$(basename "$workflow_file")
            echo "✅ PHPStan found in $workflow_name"
            phpstan_found=true
        fi
    fi
done

if [[ "$phpstan_found" == false ]]; then
    echo "❌ PHPStan not found in any workflow"
    ((VALIDATION_ERRORS++))
fi

# Final validation result
echo ""
echo "📊 Validation Summary:"
echo "====================="

if [[ $VALIDATION_ERRORS -eq 0 ]]; then
    echo "🎉 All validations passed! GitHub workflows are properly configured."
    echo ""
    echo "✅ PHPStan static analysis is integrated"
    echo "✅ All required workflows are present"
    echo "✅ Dependencies are correctly installed"
    echo "✅ Composer scripts are configured"
    echo ""
    echo "Your CI/CD pipeline is ready to catch code quality issues!"
    exit 0
else
    echo "❌ Found $VALIDATION_ERRORS validation error(s)"
    echo ""
    echo "Please fix the issues above before proceeding."
    echo "Run this script again after making corrections."
    exit 1
fi
