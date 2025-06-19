# Journal Magic Setup Script
# This script sets up both the client and API components of the Journal Magic application

Write-Host "=== Journal Magic Setup ===" -ForegroundColor Cyan
Write-Host "Setting up your development environment..." -ForegroundColor Cyan
Write-Host 

# Function to execute a command and check for errors
function Execute-Command {
    param (
        [string]$Command,
        [string]$ErrorMessage,
        [string]$SuccessMessage
    )
    
    Write-Host "> $Command" -ForegroundColor DarkGray
    
    try {
        Invoke-Expression $Command
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ $ErrorMessage" -ForegroundColor Red
            return $false
        } else {
            Write-Host "✅ $SuccessMessage" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "❌ $ErrorMessage" -ForegroundColor Red
        Write-Host "Error details: $_" -ForegroundColor DarkRed
        return $false
    }
}

# Setup client application (Angular)
Write-Host "Setting up the Angular client application..." -ForegroundColor Yellow
$setupClientSuccess = $true

# Navigate to client directory
Push-Location "$PSScriptRoot\client"

# Check if Node.js is installed
$nodeVersion = $null
try { $nodeVersion = node -v } catch {}

if ($null -eq $nodeVersion) {
    Write-Host "❌ Node.js is not installed. Please install Node.js version 16 or later." -ForegroundColor Red
    $setupClientSuccess = $false
} else {
    Write-Host "✅ Found Node.js $nodeVersion" -ForegroundColor Green
    
    # Check if Angular CLI is installed globally
    $ngVersion = $null
    try { $ngVersion = ng version --version } catch {}
    
    if ($null -eq $ngVersion) {
        Write-Host "Angular CLI not found. Installing globally..." -ForegroundColor Yellow
        if (-not (Execute-Command -Command "npm install -g @angular/cli" -ErrorMessage "Failed to install Angular CLI." -SuccessMessage "Angular CLI installed successfully.")) {
            $setupClientSuccess = $false
        }
    } else {
        Write-Host "✅ Found Angular CLI" -ForegroundColor Green
    }
    
    # Install client dependencies
    if ($setupClientSuccess -and -not (Execute-Command -Command "npm install" -ErrorMessage "Failed to install client dependencies." -SuccessMessage "Client dependencies installed successfully.")) {
        $setupClientSuccess = $false
    }
}

Pop-Location

# Setup API (.NET Core)
Write-Host "Setting up the .NET API..." -ForegroundColor Yellow
$setupApiSuccess = $true

# Navigate to API directory
Push-Location "$PSScriptRoot\api"

# Check if .NET is installed
$dotnetVersion = $null
try { $dotnetVersion = dotnet --version } catch {}

if ($null -eq $dotnetVersion) {
    Write-Host "❌ .NET SDK is not installed. Please install .NET SDK 6.0 or later." -ForegroundColor Red
    $setupApiSuccess = $false
} else {
    Write-Host "✅ Found .NET SDK $dotnetVersion" -ForegroundColor Green
    
    # Restore packages
    if (-not (Execute-Command -Command "dotnet restore" -ErrorMessage "Failed to restore .NET packages." -SuccessMessage ".NET packages restored successfully.")) {
        $setupApiSuccess = $false
    }
}

Pop-Location

# Summary
Write-Host
Write-Host "=== Setup Summary ===" -ForegroundColor Cyan

if ($setupClientSuccess) {
    Write-Host "✅ Client setup complete" -ForegroundColor Green
} else {
    Write-Host "❌ Client setup incomplete" -ForegroundColor Red
}

if ($setupApiSuccess) {
    Write-Host "✅ API setup complete" -ForegroundColor Green
} else {
    Write-Host "❌ API setup incomplete" -ForegroundColor Red
}

Write-Host
if ($setupClientSuccess -and $setupApiSuccess) {
    Write-Host "✅ Journal Magic is ready!" -ForegroundColor Green
    Write-Host
    Write-Host "To start the application:" -ForegroundColor Yellow
    Write-Host "1. Start the API (in one terminal):" -ForegroundColor White
    Write-Host "   cd $PSScriptRoot\api" -ForegroundColor Gray
    Write-Host "   dotnet run" -ForegroundColor Gray
    Write-Host
    Write-Host "2. Start the Client (in another terminal):" -ForegroundColor White
    Write-Host "   cd $PSScriptRoot\client" -ForegroundColor Gray
    Write-Host "   ng serve" -ForegroundColor Gray
    Write-Host
    Write-Host "3. Access the application at: http://localhost:4200" -ForegroundColor White
} else {
    Write-Host "❌ Setup is incomplete. Please resolve the issues above before running the application." -ForegroundColor Red
}
