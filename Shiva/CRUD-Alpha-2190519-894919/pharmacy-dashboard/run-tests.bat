@echo off
echo Running frontend tests for Pharmacy Dashboard...

cd frontend
echo Installing necessary testing libraries...
npm install @testing-library/jest-dom @testing-library/react @testing-library/user-event jest msw --save-dev

echo Running tests...
npm test

echo Test execution complete.
pause
