# Test Runner Script for Journal Magic
# This script runs both API and frontend tests

Write-Host "=== Journal Magic Test Runner ===" -ForegroundColor Cyan
Write-Host "Running all test suites..." -ForegroundColor Cyan
Write-Host 

# Declare a variable to track test success
$allTestsPassed = $true

# Function to run tests and track success
function Run-Tests {
    param (
        [string]$TestType,
        [string]$Command,
        [string]$WorkingDirectory
    )

    Write-Host "Running $TestType tests..." -ForegroundColor Yellow
    
    Push-Location $WorkingDirectory
    
    try {
        Invoke-Expression $Command
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ $TestType tests failed" -ForegroundColor Red
            $script:allTestsPassed = $false
        } else {
            Write-Host "✅ $TestType tests completed successfully" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ Error running $TestType tests: $_" -ForegroundColor Red
        $script:allTestsPassed = $false
    } finally {
        Pop-Location
    }
    
    Write-Host
}

# 1. Run API tests (backend)
$apiTestPath = Join-Path $PSScriptRoot "..\testing\api"
Run-Tests -TestType "API" -Command "dotnet test" -WorkingDirectory $apiTestPath

# 2. Run Angular tests (frontend)
$clientPath = Join-Path $PSScriptRoot "..\client"
Run-Tests -TestType "Frontend" -Command "ng test --watch=false" -WorkingDirectory $clientPath

# 3. Run Selenium automation tests
$automationTestPath = Join-Path $PSScriptRoot "..\testing\automation"
Run-Tests -TestType "Automation" -Command "dotnet test" -WorkingDirectory $automationTestPath

# Show final status
Write-Host "=== Test Results Summary ===" -ForegroundColor Cyan
if ($allTestsPassed) {
    Write-Host "✅ All tests passed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Some tests failed. Check the logs above for details." -ForegroundColor Red
    exit 1
}
