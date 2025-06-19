@echo off
echo Starting CRUD Dashboard Node.js server...
echo.
echo This will attempt to connect to SQL Server and start the API.
echo If connection fails, the application will still work using local storage.
echo.
echo Open http://localhost:3000 in your browser after the server starts.
echo.
echo Press Ctrl+C to stop the server.
echo.

node server.js
