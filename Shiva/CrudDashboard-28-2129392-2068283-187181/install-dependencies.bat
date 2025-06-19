@echo off
echo Installing dependencies for Intelligent Inventory Hub
call npm install

echo Installing client dependencies
cd client
call npm install
cd ..

echo Installing server dependencies
cd server
call npm install
cd ..

echo All dependencies installed successfully!
