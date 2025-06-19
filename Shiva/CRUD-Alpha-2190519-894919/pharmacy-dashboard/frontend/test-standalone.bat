@echo off
echo Testing Pharmacy Dashboard in Standalone Mock Mode...

:: Set environment variable for standalone mode
set TEST_API_MODE=standalone

:: Run the tests with Jest
npx jest --testMatch "**/standalone-*.test.{js,jsx,ts,tsx}"

:: If tests failed, show a message
if %ERRORLEVEL% NEQ 0 (
  echo Tests failed! Check the output above for details.
  exit /b %ERRORLEVEL%
) else (
  echo All standalone mode tests passed!
  exit /b 0
)
