# Journal Magic Troubleshooting Guide

If you encounter issues running the Journal Magic application, follow these steps to diagnose and resolve them.

## Common Issues and Solutions

### 1. Network Errors (ERR_TIMED_OUT, ERR_CONNECTION_REFUSED)

These errors typically occur when:
- The API server isn't running
- A port is already in use
- Firewall is blocking connections

**Solution:**

1. **Check if ports are free:**
   ```powershell
   # Check if ports 5000, 5001, and 4200 are free
   netstat -ano | findstr ":5000"
   netstat -ano | findstr ":5001"
   netstat -ano | findstr ":4200"
   ```
   If these commands return results, kill the processes using those ports:
   ```powershell
   taskkill /PID [ProcessID] /F
   ```

2. **Verify your firewall:**
   - Temporarily disable your firewall to check if it's causing the issue
   - Add exceptions for the Journal Magic application in your firewall settings

### 2. Application Won't Start

**Solution:**

1. **Start components manually:**

   a. Start the API:
   ```powershell
   cd "d:\VibeCoding-Daily-Journal-Mood-Analyzer-main\Journal-Magic\api"
   dotnet run
   ```

   b. In a separate terminal, start the Angular client:
   ```powershell
   cd "d:\VibeCoding-Daily-Journal-Mood-Analyzer-main\Journal-Magic\client"
   ng serve --open
   ```

2. **Verify prerequisites:**
   ```powershell
   # Check .NET version
   dotnet --version
   
   # Check Node.js version
   node -v
   
   # Check Angular CLI version
   ng version
   ```

### 3. Certificate Issues

If you see certificate warnings in the browser:

**Solution:**

1. **Trust development certificates:**
   ```powershell
   dotnet dev-certs https --trust
   ```

2. **For advanced certificate issues:**
   ```powershell
   # Clean and regenerate development certificates
   dotnet dev-certs https --clean
   dotnet dev-certs https --trust
   ```

### 4. Angular-specific Issues

**Solution:**

1. **Clear Angular cache:**
   ```powershell
   cd "d:\VibeCoding-Daily-Journal-Mood-Analyzer-main\Journal-Magic\client"
   npm cache clean --force
   ```

2. **Reinstall node_modules:**
   ```powershell
   cd "d:\VibeCoding-Daily-Journal-Mood-Analyzer-main\Journal-Magic\client"
   rm -r -fo node_modules
   npm install
   ```

### 5. .NET-specific Issues

**Solution:**

1. **Clean and rebuild:**
   ```powershell
   cd "d:\VibeCoding-Daily-Journal-Mood-Analyzer-main\Journal-Magic\api"
   dotnet clean
   dotnet build
   ```

## Reporting Issues

If you continue experiencing problems, collect the following information:
- Screenshots of any error messages
- Terminal output from both API and client applications
- Your operating system and version
- Versions of .NET SDK, Node.js, and Angular CLI

## Quick Start (Manual Method)

If the run script isn't working, use this manual approach:

1. **Terminal 1 - Start API:**
   ```powershell
   cd "d:\VibeCoding-Daily-Journal-Mood-Analyzer-main\Journal-Magic\api"
   dotnet run
   ```

2. **Terminal 2 - Start Client:**
   ```powershell
   cd "d:\VibeCoding-Daily-Journal-Mood-Analyzer-main\Journal-Magic\client"
   ng serve --open
   ```

3. **Access the application:**
   - API will be available at: https://localhost:5001
   - Client will be available at: http://localhost:4200
