@echo off
echo ===== Headed Cypress Testing Menu =====
echo 1: Run ALL tests in headed mode
echo 2: Run Balance tests
echo 3: Run Credit tests
echo 4: Run Debit tests
echo 5: Run API tests
echo 6: Run Visual/UI tests
echo 7: Run Workflow tests
echo Q: Quit
echo =====================================

:MENU
set /p choice="Please make a selection: "

if "%choice%"=="1" goto RUN_ALL
if "%choice%"=="2" goto RUN_BALANCE
if "%choice%"=="3" goto RUN_CREDIT
if "%choice%"=="4" goto RUN_DEBIT
if "%choice%"=="5" goto RUN_API
if "%choice%"=="6" goto RUN_UI
if "%choice%"=="7" goto RUN_WORKFLOW
if /i "%choice%"=="Q" goto END
if /i "%choice%"=="q" goto END

echo Invalid selection, please try again.
goto MENU

:RUN_ALL
echo Running all tests in headed mode...
call npm run test:all:headed
goto CONTINUE

:RUN_BALANCE
echo Running balance tests...
call npm run test:balance:headed
goto CONTINUE

:RUN_CREDIT
echo Running credit tests...
call npm run test:credit:headed
goto CONTINUE

:RUN_DEBIT
echo Running debit tests...
call npm run test:debit:headed
goto CONTINUE

:RUN_API
echo Running API tests...
call npm run test:api:headed
goto CONTINUE

:RUN_UI
echo Running Visual/UI tests...
call npm run test:ui:headed
goto CONTINUE

:RUN_WORKFLOW
echo Running workflow tests...
call npm run test:workflow:headed
goto CONTINUE

:CONTINUE
echo.
echo Test completed. Press any key to return to menu...
pause > nul
cls
echo ===== Headed Cypress Testing Menu =====
echo 1: Run ALL tests in headed mode
echo 2: Run Balance tests
echo 3: Run Credit tests
echo 4: Run Debit tests
echo 5: Run API tests
echo 6: Run Visual/UI tests
echo 7: Run Workflow tests
echo Q: Quit
echo =====================================
goto MENU

:END
echo Exiting test runner.
