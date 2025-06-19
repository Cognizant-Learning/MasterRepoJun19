# Start the Pharmacy Dashboard in Standalone Mode
Write-Host "Starting Pharmacy Dashboard in Standalone Mode (No server required)..." -ForegroundColor Green

# Navigate to frontend directory and run the standalone script
Push-Location frontend
npm run start:standalone
Pop-Location
