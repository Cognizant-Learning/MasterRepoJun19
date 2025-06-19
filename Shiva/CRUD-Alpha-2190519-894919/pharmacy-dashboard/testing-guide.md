# Testing the Enhanced Pharmacy Dashboard Features

This guide explains how to test the enhanced notification system and auto-fill features in the Pharmacy Dashboard application.

## Getting Started

For the best testing experience, use the enhanced mock server:

```powershell
cd C:\Users\Administrator\Desktop\Team_Alpha_Workspace\pharmacy-dashboard
node enhanced-mock-server.js
```

Then start the frontend in a separate terminal:

```powershell
cd C:\Users\Administrator\Desktop\Team_Alpha_Workspace\pharmacy-dashboard\frontend
npm start
```

Alternatively, you can use the all-in-one starter batch file:

```
cd C:\Users\Administrator\Desktop\Team_Alpha_Workspace\pharmacy-dashboard
.\start-app.bat
```

## Testing the Enhanced Notification System

The notification system has been enhanced to support multiple notification types:

### 1. Notification Overview

Access the notifications dashboard by clicking the bell icon (🔔) in the header or navigating to the Notifications page. You'll see a tabbed interface with these categories:

- **All**: Shows all notification types combined
- **Out of Stock**: Items with zero quantity
- **Low Stock**: Items with quantity below reorder level
- **Expiring**: Items approaching their expiration dates
- **Price Changes**: Items with significant price changes

### 2. Testing Different Notification Types

#### Testing Low Stock Alerts
1. Navigate to the main inventory list
2. Edit an item (e.g., Aspirin) and set its quantity below the reorder level
3. Save the changes
4. Check the notifications - you should see a Low Stock alert

#### Testing Out of Stock Alerts
1. Edit any item and set its quantity to 0
2. Save the changes
3. Check the notifications - you should see an Out of Stock alert

#### Testing Expiration Alerts
The system provides tiered expiration alerts:
- 90 days before expiry (info severity)
- 60 days before expiry (warning severity)
- 30 days before expiry (danger severity)

#### Testing Price Change Alerts
1. Edit an item and change its price significantly
2. Save the changes
3. Check the notifications - you should see a Price Change alert

## Testing the Auto-Fill Feature

The auto-fill feature automatically replenishes inventory when items are out of stock.

### 1. Configure Auto-Fill Settings

For each inventory item, you can configure:
- Whether auto-fill is enabled
- The quantity to add when auto-filling

To configure an item:
1. Edit the item from the inventory list
2. Find the "Auto-Fill Settings" section
3. Toggle "Enable Auto-Fill" and set the desired quantity
4. Save the changes

### 2. Test Auto-Fill for Individual Items

1. Navigate to the Notifications page
2. Find an "Out of Stock" item in the notifications
3. Click the "Auto Fill" button next to the item
4. The quantity should be updated, and the notification should disappear

### 3. Test Bulk Auto-Fill

1. Navigate to the Notifications page
2. Click the "Auto Fill All" button at the top of the page
3. All eligible items (those that are out of stock and have auto-fill enabled) should be replenished

### 4. Verify Auto-Fill Results

After triggering auto-fill:
1. Check the inventory list to confirm quantities have been updated
2. Verify that the Out of Stock notifications have been removed
3. You should see a success message confirming the auto-fill operation

## Advanced Testing

For more advanced testing scenarios:

1. **Combined Features**: Test how the notification system and auto-fill feature work together
2. **Error Handling**: Test what happens when auto-fill is triggered for items without proper settings
3. **Analytics Impact**: Check how auto-filled inventory affects the analytics reports

## Automated Testing

We've added comprehensive automated tests to ensure the integration between frontend and mock APIs works correctly.

### Running Automated Tests

You can run the automated tests using our test scripts:

```powershell
# Using PowerShell
cd C:\Users\Administrator\Desktop\Team_Alpha_Workspace\pharmacy-dashboard
.\run-tests.ps1

# Using Batch file
run-tests.bat
```

### What's Being Tested

The automated tests include:

1. **Notification System Tests**
   - Verifies all notification types (Low Stock, Out of Stock, Expiry Warning, Price Change) appear correctly
   - Tests that severity levels (warning, danger, info) are displayed properly
   - Validates notification actions like Auto-Fill functionality

2. **Auto-Fill Feature Tests**
   - Tests triggering auto-fill for eligible items
   - Verifies error handling for failed auto-fill attempts
   - Validates auto-fill prevention for items with disabled auto-fill

3. **MSW Mock API Integration Tests**
   - Validates that all API endpoints work correctly
   - Tests CRUD operations (Create, Read, Update, Delete)
   - Verifies notification and auto-fill API endpoints

### Testing Edge Cases

Our tests cover important edge cases:

1. **API Error Handling**
   - Server errors (500 responses)
   - Bad requests (400 responses)
   - Missing items (404 responses)

2. **Auto-Fill Logic**
   - Items at exactly zero quantity
   - Items with auto-fill enabled but zero auto-fill quantity
   - Attempting to auto-fill already stocked items
