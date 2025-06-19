# Pharmacy Dashboard Starter
# This PowerShell script starts both the mock server and the frontend application

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "Pharmacy Dashboard - PowerShell Starter" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will:" -ForegroundColor Yellow
Write-Host "1. Start the enhanced mock server with improved error handling" -ForegroundColor Yellow
Write-Host "2. Open the frontend application in your browser" -ForegroundColor Yellow
Write-Host ""

# Current script directory
$scriptPath = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition
$rootPath = $scriptPath
$frontendPath = Join-Path -Path $rootPath -ChildPath "frontend"

# Start the enhanced mock server in a new PowerShell window
Write-Host "Starting Enhanced Mock Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath'; node enhanced-mock-server.js"

# Wait for the server to initialize
Write-Host "Waiting for the mock server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Open the frontend application in the default browser
Write-Host "Opening the frontend application..." -ForegroundColor Green
Start-Process "http://localhost:3000"

# Start the frontend application
Write-Host "Starting the frontend application..." -ForegroundColor Green
Set-Location -Path $frontendPath
npm start
