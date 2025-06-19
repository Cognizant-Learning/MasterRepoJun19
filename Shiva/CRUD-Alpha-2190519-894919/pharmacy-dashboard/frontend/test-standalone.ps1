# Test Pharmacy Dashboard in Standalone Mock Mode
Write-Host "Testing Pharmacy Dashboard in Standalone Mock Mode..." -ForegroundColor Green

# Set environment variable for standalone mode
$env:TEST_API_MODE = "standalone"

# Run the tests with Jest
npx jest --testMatch "**/standalone-*.test.{js,jsx,ts,tsx}"

# If tests failed, show a message
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tests failed! Check the output above for details." -ForegroundColor Red
    exit $LASTEXITCODE
} else {
    Write-Host "All standalone mode tests passed!" -ForegroundColor Green
    exit 0
}
