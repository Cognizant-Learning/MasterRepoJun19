@echo off
echo Starting Intelligent Inventory Hub (both client and server)

echo Starting server in a new window...
start cmd /k start-server.bat

echo Starting client in a new window...
start cmd /k start-client.bat

echo Both client and server should be starting up in separate windows.
echo Frontend will be available at http://localhost:3000
echo Backend API will be available at http://localhost:5000
