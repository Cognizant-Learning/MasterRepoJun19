@echo off
echo Starting the Intelligent Inventory Hub Server
cd server

echo Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
  echo Failed to install dependencies. Retrying with --no-optional flag...
  call npm install --no-optional
)

echo Starting server...
call npx ts-node src/index.ts
