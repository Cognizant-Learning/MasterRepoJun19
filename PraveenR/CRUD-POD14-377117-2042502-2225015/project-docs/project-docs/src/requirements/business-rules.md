# Business Rules for Project Apex

## Inventory Management
1. **Unique Items**: Each item in the inventory must have a unique SKU.
2. **Stock Levels**: Items must be tracked for quantity, and alerts should be triggered when stock falls below the predefined threshold.
3. **CRUD Operations**: The application must support Create, Read, Update, and Delete operations for inventory items.

## User Interface
1. **Dashboard View**: The dashboard must display key statistics and an inventory table.
2. **Search Functionality**: The search bar must filter items in real-time based on user input.
3. **Visual Alerts**: Items low on stock must be visually highlighted in the inventory table.

## Data Integrity
1. **Confirmation for Deletion**: Users must confirm before an item is deleted from the inventory.
2. **Validation**: All forms must validate input data before submission to ensure data integrity.

## Reporting
1. **Activity Log**: The application must maintain a log of the last 5-10 actions taken by users for auditing purposes.