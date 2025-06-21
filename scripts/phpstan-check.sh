#!/bin/bash

# PHPStan Check Script - Run analysis without baseline to see all errors
# This script uses a separate configuration file that doesn't include the baseline

set -e

CONFIG_FILE="phpstan-no-baseline.neon"

echo "🔍 Running PHPStan without baseline to show all errors..."

# Check if config file exists
if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "❌ Configuration file $CONFIG_FILE not found!"
    exit 1
fi

# Run PHPStan with the no-baseline config
echo "🚀 Running analysis with $CONFIG_FILE..."
if ./vendor/bin/phpstan analyse --configuration="$CONFIG_FILE" --memory-limit=1G; then
    echo "✅ No errors found!"
    EXIT_CODE=0
else
    echo "❌ Errors found (this includes all errors, not just new ones)"
    EXIT_CODE=1
fi

echo "✨ Done!"
exit $EXIT_CODE
