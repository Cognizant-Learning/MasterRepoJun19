@echo off
echo ===================================================
echo Pharmacy Dashboard - Mock Server and Frontend Starter
echo ===================================================
echo.
echo This script will:
echo 1. Start the enhanced mock server with improved error handling
echo 2. Open the frontend application in your browser
echo.
echo Starting Enhanced Mock Server...
start cmd /k "cd /d %~dp0 && node enhanced-mock-server.js"
echo.
echo Waiting for the mock server to initialize...
timeout /t 3 /nobreak > nul
echo.
echo Opening the frontend application...
start http://localhost:3000
cd frontend
npm start
