# Advanced Pharmacy Dashboard Starter Script
# This PowerShell script provides options to start the pharmacy dashboard in different modes

# Clear the console for a clean output
Clear-Host

# Display header
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "        Pharmacy Dashboard - Advanced Starter" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

# Current script directory
$scriptPath = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition
$rootPath = $scriptPath
$frontendPath = Join-Path -Path $rootPath -ChildPath "frontend"
$backendPath = Join-Path -Path $rootPath -ChildPath "backend"

# Function to start the mock server
function Start-MockServer {
    param (
        [string]$ServerType = "Enhanced"
    )
    
    $serverScript = if ($ServerType -eq "Enhanced") { "enhanced-mock-server.js" } else { "mock-server.js" }
    Write-Host "Starting $ServerType Mock Server..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath'; node $serverScript"
    
    Write-Host "Waiting for the mock server to initialize..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
}

# Function to update API config mode
function Update-ApiConfigMode {
    param (
        [string]$Mode
    )
    
    $configFilePath = Join-Path -Path $frontendPath -ChildPath "src\config\api.config.ts"
    
    if (Test-Path $configFilePath) {
        $content = Get-Content $configFilePath -Raw
        
        # Update the API_MODE line based on the selected mode
        if ($Mode -eq "MSW") {
            $content = $content -replace "export const API_MODE: ApiMode = ApiMode\.[A-Z_]+;", "export const API_MODE: ApiMode = ApiMode.MSW_MOCK;"
        }
        elseif ($Mode -eq "Node") {
            $content = $content -replace "export const API_MODE: ApiMode = ApiMode\.[A-Z_]+;", "export const API_MODE: ApiMode = ApiMode.NODE_MOCK;"
        }
        elseif ($Mode -eq "Real") {
            $content = $content -replace "export const API_MODE: ApiMode = ApiMode\.[A-Z_]+;", "export const API_MODE: ApiMode = ApiMode.REAL;"
        }
        
        # Write the updated content back to the file
        Set-Content -Path $configFilePath -Value $content
        
        Write-Host "API mode updated to: $Mode" -ForegroundColor Green
    }
    else {
        Write-Host "API config file not found at: $configFilePath" -ForegroundColor Red
    }
}

# Function to start the frontend
function Start-Frontend {
    Write-Host "Starting the frontend application..." -ForegroundColor Green
    Set-Location -Path $frontendPath
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm start"
    
    # Open the browser
    Write-Host "Opening the frontend application in your browser..." -ForegroundColor Green
    Start-Process "http://localhost:3000"
}

# Display menu options
Write-Host "Please select a startup mode:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Full Mock Server + Frontend (Recommended)" -ForegroundColor White
Write-Host "   Uses the enhanced Node.js mock server + React frontend" -ForegroundColor Gray
Write-Host ""
Write-Host "2. In-Browser Mock Only (MSW)" -ForegroundColor White
Write-Host "   Uses only the frontend with MSW browser mocking" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Original Mock Server + Frontend" -ForegroundColor White
Write-Host "   Uses the original Node.js mock server + React frontend" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Real Backend + Frontend (Requires MongoDB)" -ForegroundColor White
Write-Host "   Starts the backend and frontend for a real deployment" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Run Health Check" -ForegroundColor White
Write-Host "   Check if all components are running correctly" -ForegroundColor Gray
Write-Host ""

# Get user input
$selection = Read-Host "Enter your selection (1-5)"

switch ($selection) {
    "1" {
        # Update config to use Node mock
        Update-ApiConfigMode -Mode "Node"
        
        # Start enhanced mock server
        Start-MockServer -ServerType "Enhanced"
        
        # Start frontend
        Start-Frontend
    }
    "2" {
        # Update config to use MSW mock
        Update-ApiConfigMode -Mode "MSW"
        
        # Start frontend only
        Start-Frontend
    }
    "3" {
        # Update config to use Node mock
        Update-ApiConfigMode -Mode "Node"
        
        # Start original mock server
        Start-MockServer -ServerType "Original"
        
        # Start frontend
        Start-Frontend
    }
    "4" {
        # Update config to use real backend
        Update-ApiConfigMode -Mode "Real"
        
        # Start backend
        Write-Host "Starting the real backend server..." -ForegroundColor Green
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run dev"
        
        # Wait for backend to initialize
        Write-Host "Waiting for the backend server to initialize..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        
        # Start frontend
        Start-Frontend
    }    "5" {
        # Run health check script
        Write-Host "Running health check..." -ForegroundColor Green
        & "$rootPath\check-health.ps1"
    }
    default {
        Write-Host "Invalid selection. Please run the script again and select a valid option (1-5)." -ForegroundColor Red
    }
}
