# Run-HeadedTests.ps1
# PowerShell script to run headed Cypress tests

# Function to display available test options
function Show-Menu {
    Clear-Host
    Write-Host "=== Headed Cypress Testing Menu ===" -ForegroundColor Cyan
    Write-Host "1: Run ALL tests in headed mode"
    Write-Host "2: Run Balance tests"
    Write-Host "3: Run Credit tests"
    Write-Host "4: Run Debit tests"
    Write-Host "5: Run API tests"
    Write-Host "6: Run Visual/UI tests"
    Write-Host "7: Run Workflow tests"
    Write-Host "Q: Quit"
    Write-Host "================================="
}

# Function to run npm script
function Run-NpmScript {
    param (
        [string]$ScriptName
    )
    Write-Host "Running $ScriptName..." -ForegroundColor Green
    npm run $ScriptName
}

# Main loop
do {
    Show-Menu
    $selection = Read-Host "Please make a selection"
    
    switch ($selection) {
        '1' {
            Run-NpmScript -ScriptName "cypress:headed"
        }
        '2' {
            Run-NpmScript -ScriptName "test:balance:headed"
        }
        '3' {
            Run-NpmScript -ScriptName "test:credit:headed"
        }
        '4' {
            Run-NpmScript -ScriptName "test:debit:headed"
        }
        '5' {
            Run-NpmScript -ScriptName "test:api:headed"
        }
        '6' {
            Run-NpmScript -ScriptName "test:ui:headed"
        }
        '7' {
            # Add workflow specific test
            Run-NpmScript -ScriptName "cypress:headed -- --spec 'cypress/e2e/workflow.cy.js'"
        }
        'q' {
            return
        }
        default {
            Write-Host "Invalid selection, please try again." -ForegroundColor Red
            Start-Sleep -Seconds 2
        }
    }
    
    if ($selection -ne 'q') {
        Write-Host "Press any key to return to menu..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
} until ($selection -eq 'q')
