# Health check script for Pharmacy Dashboard
# This script checks if all components are running properly

$ErrorActionPreference = "Stop"

# Display colors for output
$Red = [ConsoleColor]::Red
$Green = [ConsoleColor]::Green
$Yellow = [ConsoleColor]::Yellow
$Cyan = [ConsoleColor]::Cyan

function Test-ApiEndpoint {
    param(
        [string]$Name,
        [string]$Url
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ $Name is available at $Url" -ForegroundColor $Green
            return $true
        } else {
            Write-Host "✗ $Name responded with status code $($response.StatusCode)" -ForegroundColor $Red
            return $false
        }
    } catch {
        Write-Host "✗ $Name is not available at $Url" -ForegroundColor $Red
        return $false
    }
}

function Test-ApplicationHealth {
    # Header
    Write-Host "`n===== Pharmacy Dashboard Health Check =====" -ForegroundColor $Cyan
    
    # Check frontend
    Write-Host "`nChecking Frontend Application..." -ForegroundColor $Yellow
    $frontendStatus = Test-ApiEndpoint -Name "Frontend" -Url "http://localhost:3000"
    
    # Check mock server
    Write-Host "`nChecking API Endpoints..." -ForegroundColor $Yellow
    $mockServerStatus = Test-ApiEndpoint -Name "Mock Server" -Url "http://localhost:5000/api/inventory"
    
    # Check for MSW worker
    $mockSwWorker = Test-Path -Path ".\frontend\public\mockServiceWorker.js"
    if ($mockSwWorker) {
        Write-Host "✓ MSW Service Worker is available" -ForegroundColor $Green
    } else {
        Write-Host "✗ MSW Service Worker file is missing" -ForegroundColor $Red
    }
    
    # Summary
    Write-Host "`n===== Health Check Summary =====" -ForegroundColor $Cyan
    
    if ($frontendStatus -and $mockServerStatus) {
        Write-Host "✓ All systems are running properly!" -ForegroundColor $Green
        Write-Host "  - Frontend: OK" -ForegroundColor $Green
        Write-Host "  - Mock API: OK" -ForegroundColor $Green
    } else {
        Write-Host "✗ There are issues with one or more components:" -ForegroundColor $Red
        Write-Host "  - Frontend: $($frontendStatus ? 'OK' : 'Not Available')" -ForegroundColor $(if ($frontendStatus) { $Green } else { $Red })
        Write-Host "  - Mock API: $($mockServerStatus ? 'OK' : 'Not Available')" -ForegroundColor $(if ($mockServerStatus) { $Green } else { $Red })
        
        # Provide troubleshooting advice
        Write-Host "`nTroubleshooting Advice:" -ForegroundColor $Yellow
        if (-not $frontendStatus) {
            Write-Host "  - To start the frontend: cd frontend && npm start" -ForegroundColor $Yellow
        }
        if (-not $mockServerStatus) {
            Write-Host "  - To start the mock API server: node enhanced-mock-server.js" -ForegroundColor $Yellow
        }
        Write-Host "  - Or use the quick start script: .\start-advanced.ps1" -ForegroundColor $Yellow
    }
}

# Run the health check
Test-ApplicationHealth
