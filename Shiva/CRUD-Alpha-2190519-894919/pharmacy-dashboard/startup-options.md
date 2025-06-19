# Pharmacy Dashboard Startup Options

This document explains the different ways you can start and run the Pharmacy Dashboard application.

## Option 1: PowerShell Script (Recommended)

The easiest way to start the application:

```powershell
.\start-app.ps1
```

This script:
- Starts the enhanced mock server in a separate window
- Opens your browser to http://localhost:3000
- Starts the React frontend application

## Option 2: Batch File

If you prefer using a batch file:

```
.\start-app.bat
```

This works similarly to the PowerShell script.

## Option 3: Manual Startup

If you want more control over the process:

1. **Start the mock server:**
   ```powershell
   node enhanced-mock-server.js
   ```

2. **In a separate terminal, start the frontend:**
   ```powershell
   cd frontend
   npm start
   ```

## Mock Server Options

We provide two different mock server implementations:

1. **Enhanced Mock Server (Recommended):**
   ```powershell
   node enhanced-mock-server.js
   ```
   - Complete implementation of all API endpoints
   - Improved error handling
   - Consistent response formatting
   - Better CORS handling

2. **Legacy Mock Server:**
   ```powershell
   node mock-server.js
   ```
   - Original implementation
   - Basic functionality

## Browser-Based Mock API Option

For advanced users, we also provide a browser-based mock API using Mock Service Worker (MSW):

1. **Install MSW:**
   ```powershell
   cd frontend
   npm install msw --save
   ```

2. **Start only the frontend:**
   ```powershell
   cd frontend
   npm start
   ```

This approach doesn't require running a separate mock server, as all API requests are intercepted directly in the browser.

## Testing the Application

After starting the application using any of the above methods:

1. Open your browser to http://localhost:3000
2. Log in with any username/password
3. Explore the dashboard and its features
4. See the testing-guide.md document for detailed testing instructions

## Troubleshooting

If you encounter any issues:

1. **Port conflicts:** Make sure nothing else is running on ports 3000 (frontend) or 5000 (mock server)
2. **Dependencies:** Ensure you have Node.js installed (v16+ recommended)
3. **Script execution:** If PowerShell scripts fail to run, you may need to adjust your execution policy:
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```
