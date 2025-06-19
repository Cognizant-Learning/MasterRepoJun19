@echo off
echo Starting CRUD Dashboard in client-side only mode...
echo.
echo This mode uses the browser's localStorage for data storage.
echo No database connection is required.
echo.
echo Open http://localhost:5500 in your browser after the server starts.
echo.
echo Press Ctrl+C to stop the server.
echo.

:: Use a simple HTTP server to serve the files
npx http-server -p 5500 -c-1
