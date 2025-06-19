# Start-BankingApp.ps1
# PowerShell script to start both backend and frontend, then run headed tests

# Function to display available options
function Show-Menu {
    Clear-Host
    Write-Host "=== Banking Application Starter ===" -ForegroundColor Cyan
    Write-Host "1: Start Backend (Spring Boot)"
    Write-Host "2: Start Frontend (React)"
    Write-Host "3: Start Both Backend and Frontend"
    Write-Host "4: Run Headed Cypress Tests"
    Write-Host "5: Start Both and Run Tests"
    Write-Host "Q: Quit"
    Write-Host "=================================="
}

# Function to start backend
function Start-Backend {
    Write-Host "Starting Spring Boot backend..." -ForegroundColor Green
    $backendPath = "d:\Vibe coding\Vibecoding-cobol-code-migration\application\back-end\banking-api"
    
    # Check if we have the JAR file
    if (Test-Path "$backendPath\target\banking-api-0.0.1-SNAPSHOT.jar") {
        Start-Process powershell -ArgumentList "-Command cd '$backendPath'; java -jar target\banking-api-0.0.1-SNAPSHOT.jar" -WindowStyle Normal
        Write-Host "Backend starting at http://localhost:8080" -ForegroundColor Green
        return $true
    } else {
        Write-Host "Backend JAR not found. Please build the backend first." -ForegroundColor Red
        return $false
    }
}

# Function to start frontend
function Start-Frontend {
    Write-Host "Starting React frontend..." -ForegroundColor Green
    $frontendPath = "d:\Vibe coding\Vibecoding-cobol-code-migration\application\front-end\banking-app"
    
    Start-Process powershell -ArgumentList "-Command cd '$frontendPath'; npm start" -WindowStyle Normal
    Write-Host "Frontend starting at http://localhost:3000" -ForegroundColor Green
    return $true
}

# Function to run headed tests
function Start-HeadedTests {
    $frontendPath = "d:\Vibe coding\Vibecoding-cobol-code-migration\application\front-end\banking-app"
    & "$frontendPath\Run-HeadedTests.ps1"
}

# Main loop
do {
    Show-Menu
    $selection = Read-Host "Please make a selection"
    
    switch ($selection) {
        '1' {
            $backendStarted = Start-Backend
            if ($backendStarted) {
                Write-Host "Backend has been started. Wait for it to initialize before running tests." -ForegroundColor Yellow
                Start-Sleep -Seconds 5
            }
        }
        '2' {
            $frontendStarted = Start-Frontend
            if ($frontendStarted) {
                Write-Host "Frontend has been started. Please wait for it to initialize." -ForegroundColor Yellow
                Start-Sleep -Seconds 5
            }
        }
        '3' {
            $backendStarted = Start-Backend
            if ($backendStarted) {
                Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
                Start-Sleep -Seconds 10
                
                $frontendStarted = Start-Frontend
                if ($frontendStarted) {
                    Write-Host "Full stack has been started." -ForegroundColor Green
                    Start-Sleep -Seconds 5
                }
            }
        }
        '4' {
            Start-HeadedTests
        }
        '5' {
            $backendStarted = Start-Backend
            if ($backendStarted) {
                Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
                Start-Sleep -Seconds 10
                
                $frontendStarted = Start-Frontend
                if ($frontendStarted) {
                    Write-Host "Full stack has been started." -ForegroundColor Green
                    Write-Host "Waiting for frontend to initialize before starting tests..." -ForegroundColor Yellow
                    Start-Sleep -Seconds 20
                    
                    Start-HeadedTests
                }
            }
        }
        'q' {
            return
        }
        default {
            Write-Host "Invalid selection, please try again." -ForegroundColor Red
            Start-Sleep -Seconds 2
        }
    }
    
    if ($selection -ne 'q' -and $selection -ne '4' -and $selection -ne '5') {
        Write-Host "Press any key to return to menu..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
} until ($selection -eq 'q')
