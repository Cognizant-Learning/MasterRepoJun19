Write-Host "Running frontend tests for Pharmacy Dashboard..." -ForegroundColor Green

# Navigate to the frontend directory
Set-Location -Path frontend

Write-Host "Installing necessary testing libraries..." -ForegroundColor Cyan
npm install @testing-library/jest-dom @testing-library/react @testing-library/user-event jest msw --save-dev

Write-Host "Running tests..." -ForegroundColor Yellow
npm test

Write-Host "Test execution complete." -ForegroundColor Green
Read-Host "Press Enter to continue..."
