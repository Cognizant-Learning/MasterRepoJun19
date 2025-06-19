# Mock API Setup for Pharmacy Dashboard Frontend

This setup allows you to run the frontend application without any dependency on the backend server. We've implemented two different approaches to choose from:

## Option 1: Using the Built-in Mock Service Worker (MSW)

This setup uses MSW to intercept API calls directly in the browser.

### Installation Steps:

1. Install MSW:
   ```bash
   cd pharmacy-dashboard/frontend
   npm install msw --save
   ```

2. Start the frontend application:
   ```bash
   npm start
   ```

### How It Works

1. **Mock Service Worker (MSW)** - Intercepts API requests in the browser
2. **Handlers** - Define routes and responses for each API endpoint
3. **Mock Data** - Provides test data for inventory, notifications, etc.

## Option 2: Using the Node.js Mock Server (Alternative)

If you prefer a more traditional approach, you can use the included Node.js mock server.

### Running the Node.js Mock Server:

1. Open a terminal window:
   ```bash
   cd pharmacy-dashboard
   node mock-server.js
   ```

2. In a separate terminal, start the frontend:
   ```bash
   cd pharmacy-dashboard/frontend
   npm start
   ```

## Features Available for Testing

### Inventory Management
- View inventory items
- Add new items
- Edit existing items
- Delete items

### Enhanced Notification System
- Low Stock Alerts: Items with quantity below reorder level
- Out of Stock Alerts: Items with zero quantity
- Expiration Alerts: Items nearing expiration (30/60/90 day notifications)
- Price Change Alerts: Items with recent price changes

### Auto-Fill Feature
- Automatically replenish out-of-stock items
- Configure auto-fill settings per item
- Trigger auto-fill manually for specific items

## How to Use

1. Start the React application:
   ```bash
   cd frontend
   npm start
   ```

2. The MSW will automatically start and intercept all API calls.

3. No backend or mock server is needed - everything runs in the browser!

## Modifying Mock Data

If you need to modify the mock data or response behavior:

1. Edit `src/mocks/handlers.js` to change the mock data or response logic
2. The changes will be immediately reflected in the application

## Benefits

- **Completely offline development** - No need for backend or internet connection
- **Consistent test data** - Always have the same data for testing
- **Fast development** - No API latency or backend issues to slow you down
- **Realistic testing** - Simulates actual API behavior including errors

The mock setup provides all endpoints needed for the pharmacy dashboard including the enhanced notification system and auto-fill features.
