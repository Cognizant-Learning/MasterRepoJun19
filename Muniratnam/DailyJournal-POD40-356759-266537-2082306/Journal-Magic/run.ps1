# Journal Magic Run Script
# This script starts both the client and API components of the Journal Magic application

Write-Host "=== Journal Magic Launcher ===" -ForegroundColor Cyan
Write-Host "Starting the Journal Magic application..." -ForegroundColor Cyan
Write-Host 

# Function to check if a port is in use
function Test-PortInUse {
    param (
        [int]$Port
    )
    
    $connections = netstat -aon | findstr ":$Port"
    return $connections.Length -gt 0
}

# Function to verify key dependencies
function Verify-Setup {
    $errors = @()
    
    # Check if the app has been set up
    if (-not (Test-Path -Path "$PSScriptRoot\client\node_modules")) {
        $errors += "Client dependencies not found. Run ./setup.ps1 first to install all dependencies."
    }
    
    # Check if dotnet is available
    try { dotnet --version | Out-Null } catch {
        $errors += ".NET SDK is not available. Make sure it's installed and in your PATH."
    }
    
    # Check if Angular CLI is available
    try { 
        Push-Location $PSScriptRoot\client
        ng version --version | Out-Null
        Pop-Location
    } catch {
        $errors += "Angular CLI is not available. Make sure it's installed globally or in the project."
    }
    
    # Check if ports are already in use
    if (Test-PortInUse -Port 5000) { $errors += "Port 5000 is already in use. The API server needs this port." }
    if (Test-PortInUse -Port 5001) { $errors += "Port 5001 is already in use. The API server needs this port." }
    if (Test-PortInUse -Port 4200) { $errors += "Port 4200 is already in use. The Angular server needs this port." }
    
    return $errors
}

# Verify setup before proceeding
$setupErrors = Verify-Setup
if ($setupErrors.Count -gt 0) {
    Write-Host "❌ Cannot start the application due to the following issues:" -ForegroundColor Red
    foreach ($error in $setupErrors) {
        Write-Host "  - $error" -ForegroundColor Red
    }
    Write-Host
    Write-Host "Please resolve these issues and try again." -ForegroundColor Yellow
    exit 1
}

# Function to handle errors
function Write-ErrorDetail {
    param (
        [string]$Message,
        $ErrorObject
    )
    Write-Host "❌ $Message" -ForegroundColor Red
    if ($ErrorObject) {
        Write-Host "   Error details: $ErrorObject" -ForegroundColor DarkRed
    }
}

# Start API process in background
Write-Host "Starting API server..." -ForegroundColor Yellow
try {
    $apiProcess = Start-Process -FilePath "dotnet" -ArgumentList "run", "--project", "$PSScriptRoot\api" -PassThru -NoNewWindow
    if (-not $apiProcess -or $apiProcess.HasExited) {
        Write-ErrorDetail -Message "Failed to start API server."
        exit 1
    }
    Write-Host "✅ API server started (Process ID: $($apiProcess.Id))" -ForegroundColor Green
} catch {
    Write-ErrorDetail -Message "Failed to start API server." -ErrorObject $_
    exit 1
}

# Wait for API to initialize
Write-Host "Waiting for API to initialize..." -ForegroundColor Yellow
$apiReady = $false
$attempts = 0
$maxAttempts = 10

while (-not $apiReady -and $attempts -lt $maxAttempts) {
    Start-Sleep -Seconds 2
    $attempts++
    
    try {
        $result = Invoke-WebRequest -Uri "https://localhost:5001/swagger/index.html" -UseBasicParsing -ErrorAction SilentlyContinue
        if ($result.StatusCode -eq 200) {
            $apiReady = $true
        }
    } catch {
        # Continue waiting
    }
    
    Write-Host "." -NoNewline -ForegroundColor DarkGray
}
Write-Host

if ($apiReady) {
    Write-Host "✅ API server is ready at https://localhost:5001" -ForegroundColor Green
} else {
    Write-Host "⚠️ API server might not be fully initialized, but we'll continue anyway." -ForegroundColor Yellow
}

# Start Angular dev server
Write-Host "Starting Angular development server..." -ForegroundColor Yellow
try {
    Push-Location "$PSScriptRoot\client"
    
    # Start Angular server in this process
    $ngProcess = Start-Process -FilePath "cmd" -ArgumentList "/c", "ng", "serve", "--open" -PassThru -NoNewWindow
    if (-not $ngProcess -or $ngProcess.HasExited) {
        Write-ErrorDetail -Message "Failed to start Angular server."
        Stop-Process -Id $apiProcess.Id -Force -ErrorAction SilentlyContinue
        exit 1
    }
    
    Write-Host "✅ Angular development server started (Process ID: $($ngProcess.Id))" -ForegroundColor Green
    Write-Host "✅ Journal Magic application is now running!" -ForegroundColor Green
    Write-Host
    Write-Host "API URL: https://localhost:5001" -ForegroundColor Cyan
    Write-Host "Client URL: http://localhost:4200" -ForegroundColor Cyan
    Write-Host
    Write-Host "Press Ctrl+C to stop all servers when done." -ForegroundColor DarkYellow
    
    # Keep the script running until user presses Ctrl+C
    while (-not $apiProcess.HasExited -and -not $ngProcess.HasExited) {
        Start-Sleep -Seconds 1
    }
} catch {
    Write-ErrorDetail -Message "Failed to start Angular server." -ErrorObject $_
} finally {
    Pop-Location
    
    # Clean up processes
    if ($apiProcess -and -not $apiProcess.HasExited) {
        Write-Host "Stopping API server..." -ForegroundColor Yellow
        try {
            Stop-Process -Id $apiProcess.Id -Force -ErrorAction SilentlyContinue
            Write-Host "✅ API server stopped" -ForegroundColor Green
        } catch {
            Write-ErrorDetail -Message "Failed to stop API server. You may need to kill it manually." -ErrorObject $_
        }
    }
    
    if ($ngProcess -and -not $ngProcess.HasExited) {
        Write-Host "Stopping Angular server..." -ForegroundColor Yellow
        try {
            Stop-Process -Id $ngProcess.Id -Force -ErrorAction SilentlyContinue
            Write-Host "✅ Angular server stopped" -ForegroundColor Green
        } catch {
            Write-ErrorDetail -Message "Failed to stop Angular server. You may need to kill it manually." -ErrorObject $_
        }
    }
}
