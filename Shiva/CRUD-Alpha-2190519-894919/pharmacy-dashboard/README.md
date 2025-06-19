# Pharmacy Inventory Management Dashboard

A comprehensive pharmacy inventory management system with CRUD operations, analytics, and notifications.

## Running the Application

### Quick Start: Using Standalone Mode (No Server Required)

The easiest way to run the application is using the standalone mock mode:

1. **Start the Frontend Application in Standalone Mode:**
   ```powershell
   cd C:\Users\Administrator\Desktop\Team_Alpha_Workspace\pharmacy-dashboard\frontend
   npm run start:standalone
   ```

2. **Access the Application:**
   Your browser should automatically open to `http://localhost:3000`
   
3. **What is Standalone Mode?**
   - Completely self-contained - no backend or server required
   - Uses in-memory mock data with full CRUD functionality
   - Simulates all API endpoints and features
   - Great for development, demos, and testing
   
   For more details, see [STANDALONE-MODE-README.md](frontend/STANDALONE-MODE-README.md)

### Alternative: Using the Node.js Mock Server

You can also run the application with the Node.js mock server:

1. **Start the Enhanced Mock Server:**
   ```powershell
   cd C:\Users\Administrator\Desktop\Team_Alpha_Workspace\pharmacy-dashboard
   node enhanced-mock-server.js
   ```
   You should see: "Enhanced mock server running at http://localhost:5000"
   
   Note: We provide two mock server implementations:
   - `enhanced-mock-server.js` (recommended): Includes better error handling and complete API implementation
   - `mock-server.js` (legacy): Original mock server implementation

2. **Start the Frontend Application (in a new terminal window):**
   ```powershell
   cd C:\Users\Administrator\Desktop\Team_Alpha_Workspace\pharmacy-dashboard\frontend
   npm start
   ```

3. **Access the Application:**
   Your browser should automatically open to `http://localhost:3000`

### One-Click Startup (PowerShell)

For convenience, we provide PowerShell scripts that handle both the mock server and frontend startup:

**Basic Starter:**
```powershell
cd C:\Users\Administrator\Desktop\Team_Alpha_Workspace\pharmacy-dashboard
.\start-app.ps1
```

This will:
- Start the enhanced mock server in a new window
- Open your browser to the frontend application
- Start the frontend server

**Advanced Starter (Recommended):**
```powershell
cd C:\Users\Administrator\Desktop\Team_Alpha_Workspace\pharmacy-dashboard
.\start-advanced.ps1
```

The advanced starter provides a menu with multiple options:
1. Enhanced Mock Server + Frontend (recommended)
2. In-Browser Mock API Only (MSW)
3. Original Mock Server + Frontend
4. Real Backend + Frontend (requires MongoDB)

### Alternative: Using the In-Browser Mock API

For a more advanced setup, you can use the Mock Service Worker (MSW) approach:

1. **Install MSW Dependencies:**
   ```powershell
   cd C:\Users\Administrator\Desktop\Team_Alpha_Workspace\pharmacy-dashboard\frontend
   npm install msw --save
   ```

2. **Start the Frontend:**
   ```powershell
   npm start
   ```

3. **For more details:**
   See `frontend/MOCK-API-README.md` for complete information

### Using the Full Backend (Requires MongoDB)

1. **Start the Mock Server:**
   ```bash
   cd pharmacy-dashboard
   node mock-server.js
   ```
   This will start the mock server on port 5000.

2. **Start the Frontend Application:**
   Open a new terminal window and run:
   ```bash
   cd pharmacy-dashboard/frontend
   npm start
   ```
   This will start the React application on port 3000.

3. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000`

### Using the Full Backend (Requires MongoDB)

1. **Start MongoDB:**
   Make sure your MongoDB instance is running.

2. **Start the Backend:**
   ```bash
   cd pharmacy-dashboard/backend
   npm run dev
   ```
   This will start the backend server on port 5000.

3. **Start the Frontend:**
   Open a new terminal window and run:
   ```bash
   cd pharmacy-dashboard/frontend
   npm start
   ```

## Features

### Inventory Management
- Add new pharmacy items to inventory
- Update existing pharmacy items in inventory 
- Read existing pharmacy items in inventory
- Delete existing pharmacy items from inventory

### Analytics
- View inventory data by category
- Track total value, average prices, and quantities
- Visualize data through charts and graphs

### Notifications
- Low stock alerts: Notify when items fall below predefined thresholds
- Out of stock alerts: Immediate notifications when items are completely depleted
- Expiration alerts: Tiered notifications (30/60/90 days before expiration)
- Price change alerts: Notify when supplier prices change significantly

### Auto-Fill Feature
- Automatically replenish items when they're out of stock
- Configurable auto-fill quantity
- Enable/disable auto-fill for specific items

## Testing the Enhanced Features

### Testing Notifications
1. Click on the Bell icon in the header to view all notifications
2. Use the notification tabs to filter by notification type:
   - Out of Stock
   - Low Stock
   - Expiring Items
   - Price Changes

### Testing Auto-Fill
1. Go to the Notifications page and find an "Out of Stock" item
2. Click the "Auto Fill" button next to the item to trigger auto-fill
3. Or use the "Auto Fill All" button to replenish all eligible items at once

### Configuring Auto-Fill Settings
1. Edit any item in the inventory
2. Toggle "Enable Auto-Fill" checkbox
3. Set the "Auto-Fill Quantity" value
4. Save the changes
- Price change alerts: Notify when supplier prices change significantly
- Real-time notification badge in the navigation header with consolidated count
- Detailed notification breakdown with severity indicators

### Auto-Fill Functionality
- Configure items for automatic replenishment when out of stock
- Set custom auto-fill quantities for each inventory item
- Trigger auto-fill manually or have the system handle it automatically
- View detailed auto-fill history and results

## Technical Stack

### Backend
- Node.js with Express
- TypeScript
- MongoDB for database
- RESTful API architecture

### Frontend
- React with TypeScript 
- Bootstrap for responsive design
- Chart.js for data visualization
- React Router for navigation

## Project Setup

### Prerequisites
- Node.js (v14 or later)
- MongoDB instance

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd pharmacy-dashboard/backend
   ```
   
2. Install dependencies:
   ```
   npm install
   ```
   
3. Create a `.env` file with your MongoDB connection string:
   ```
   MONGO_URI=mongodb://localhost:27017/pharmacy-dashboard
   PORT=5000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd pharmacy-dashboard/frontend
   ```
   
2. Install dependencies:
   ```
   npm install
   ```
   
3. Start the development server:
   ```
   npm start
   ```

## API Endpoints

### Inventory Items
- `GET /api/inventory` - Get all items
- `GET /api/inventory/:id` - Get a specific item
- `POST /api/inventory` - Create a new item
- `PUT /api/inventory/:id` - Update an item
- `DELETE /api/inventory/:id` - Delete an item

### Analytics
- `GET /api/inventory/analytics/category` - Get analytics by category

### Notifications
- `GET /api/inventory/notifications/low-stock` - Get low stock items
- `GET /api/inventory/notifications/expiring` - Get expiring items

## Testing the Application

### Automated Testing

We've implemented comprehensive automated tests to verify the integration between frontend components and mock APIs. To run the tests:

```powershell
# Using PowerShell
cd C:\Users\Administrator\Desktop\Team_Alpha_Workspace\pharmacy-dashboard
.\run-tests.ps1

# Using Batch file
run-tests.bat
```

The tests cover:
- Notification system functionality
- Auto-fill feature behavior
- Error handling
- API integration
- Edge cases

For detailed testing instructions, see the [Testing Guide](./testing-guide.md).

## Authentication (Future Enhancement)
- User authentication and role-based access control
- Admin vs. Staff roles with different permissions

## Developed By
Team Alpha
