@echo off
echo Starting mock server...
start cmd /k "cd /d %~dp0 && node mock-server.js"

echo Starting frontend application...
timeout /t 3
start cmd /k "cd /d %~dp0\frontend && npm start"
