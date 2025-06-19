# Pharmacy Dashboard - Standalone Mode

This document explains how to run the pharmacy inventory management dashboard in standalone mode, which has **no dependency on any backend API**.

## About Standalone Mode

Standalone mode is designed for:
- Frontend development without backend dependencies
- Testing UI components in isolation 
- Demonstrating application functionality without setting up a server
- QA testing of frontend features

## How to Start in Standalone Mode

### Option 1: Using the npm script (Recommended)

```bash
# From the frontend directory
npm run start:standalone
```

This will:
1. Create an `api-mode.js` file that configures the app to use standalone mode
2. Start the React application with the standalone mock API service

### Option 2: Using batch file (Windows)

```bash
# From the frontend directory
./start-standalone.bat
```

### Option 3: Using PowerShell script (Windows)

```bash
# From the frontend directory
./start-standalone.ps1
```

## How Standalone Mode Works

The standalone mode:

1. Uses local mock data from `src/mocks/mockData.json`
2. Simulates all API calls through `mockApiService.js`
3. Provides full CRUD operations on the client-side
4. Simulates network delays for a realistic experience
5. Persists changes in memory during the session

## Features Available in Standalone Mode

- Complete inventory management with CRUD operations
- Notification system
- Analytics dashboard with mock data
- Auto-fill suggestions
- Category management
- User preferences

## Limitations

- Data is not persisted between sessions (refreshing the page resets to initial mock data)
- Some advanced features might have limited functionality

## Customizing Mock Data

You can modify the mock data by editing:

```
src/mocks/mockData.json
```

Be sure to match the existing data structure to ensure compatibility with the mock API service.

## Testing the Standalone Implementation

You can test that the standalone mode is working correctly by:

1. Looking for the "STANDALONE MODE" indicator in the UI header
2. Verifying CRUD operations work without error messages
3. Checking that notifications appear and can be managed
4. Validating that analytics charts render correctly

## Switching Back to Other Modes

To switch back to using the real backend or other mock modes, simply use the regular start command:

```bash
npm start
```
