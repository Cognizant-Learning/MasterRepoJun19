@echo off
title Banking Application Starter

:MENU
cls
echo ===== Banking Application Starter =====
echo 1: Start Backend (Spring Boot)
echo 2: Start Frontend (React)
echo 3: Start Both Backend and Frontend
echo 4: Run Headed Cypress Tests
echo 5: Start Both and Run Tests
echo Q: Quit
echo =====================================

set /p choice="Please make a selection: "

if "%choice%"=="1" goto START_BACKEND
if "%choice%"=="2" goto START_FRONTEND
if "%choice%"=="3" goto START_BOTH
if "%choice%"=="4" goto RUN_TESTS
if "%choice%"=="5" goto START_ALL
if /i "%choice%"=="Q" goto END
if /i "%choice%"=="q" goto END

echo Invalid selection, please try again.
timeout /t 2 >nul
goto MENU

:START_BACKEND
echo Starting Spring Boot backend...
set backendPath=d:\Vibe coding\Vibecoding-cobol-code-migration\application\back-end\banking-api

if exist "%backendPath%\target\banking-api-0.0.1-SNAPSHOT.jar" (
    start cmd /k "cd %backendPath% && java -jar target\banking-api-0.0.1-SNAPSHOT.jar"
    echo Backend starting at http://localhost:8080
    echo Wait for it to initialize before running tests.
    timeout /t 5 >nul
) else (
    echo Backend JAR not found. Please build the backend first.
    pause
)
goto MENU

:START_FRONTEND
echo Starting React frontend...
set frontendPath=d:\Vibe coding\Vibecoding-cobol-code-migration\application\front-end\banking-app

start cmd /k "cd %frontendPath% && npm start"
echo Frontend starting at http://localhost:3000
echo Please wait for it to initialize.
timeout /t 5 >nul
goto MENU

:START_BOTH
echo Starting backend and frontend...
set backendPath=d:\Vibe coding\Vibecoding-cobol-code-migration\application\back-end\banking-api
set frontendPath=d:\Vibe coding\Vibecoding-cobol-code-migration\application\front-end\banking-app

if exist "%backendPath%\target\banking-api-0.0.1-SNAPSHOT.jar" (
    start cmd /k "cd %backendPath% && java -jar target\banking-api-0.0.1-SNAPSHOT.jar"
    echo Backend starting at http://localhost:8080
    echo Waiting for backend to initialize...
    timeout /t 10 >nul
    
    start cmd /k "cd %frontendPath% && npm start"
    echo Frontend starting at http://localhost:3000
    echo Full stack has been started.
    timeout /t 5 >nul
) else (
    echo Backend JAR not found. Please build the backend first.
    pause
)
goto MENU

:RUN_TESTS
set frontendPath=d:\Vibe coding\Vibecoding-cobol-code-migration\application\front-end\banking-app
cd /d %frontendPath%
call Run-HeadedTests.bat
goto MENU

:START_ALL
echo Starting backend, frontend, and tests...
set backendPath=d:\Vibe coding\Vibecoding-cobol-code-migration\application\back-end\banking-api
set frontendPath=d:\Vibe coding\Vibecoding-cobol-code-migration\application\front-end\banking-app

if exist "%backendPath%\target\banking-api-0.0.1-SNAPSHOT.jar" (
    start cmd /k "cd %backendPath% && java -jar target\banking-api-0.0.1-SNAPSHOT.jar"
    echo Backend starting at http://localhost:8080
    echo Waiting for backend to initialize...
    timeout /t 10 >nul
    
    start cmd /k "cd %frontendPath% && npm start"
    echo Frontend starting at http://localhost:3000
    echo Waiting for frontend to initialize before starting tests...
    timeout /t 20 >nul
    
    cd /d %frontendPath%
    call Run-HeadedTests.bat
) else (
    echo Backend JAR not found. Please build the backend first.
    pause
)
goto MENU

:END
echo Exiting application starter.
