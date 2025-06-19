# Project Requirements: Apex Inventory Hub

## Functional Requirements (MVP)
1. **Dashboard View**
   - Display key stats: Total Unique Items, Items Low on Stock, Items Out of Stock
   - Show all inventory items in a sortable, fixed-width, centered table with columns: Image, Name, SKU, Category, Price, Quantity, Action
   - Table supports sorting by clicking on headers (except Image and Action)
   - Table rows have alternating colors for readability
   - Edit and Delete buttons are always next to each other, horizontally aligned, and the Action column is wide enough for both
   - Table is always centered, fixed width, and does not fluctuate
   - Provide a real-time search and filter bar for the table
2. **CRUD Operations**
   - Create: Add new inventory items via a form or modal, including image upload and preview
   - Read: View all items in the dashboard
   - Update: Edit item details directly from the table, including image preview
   - Delete: Remove items with a confirmation step
3. **Low Stock & Out of Stock Alerts**
   - Visually highlight items with quantity below a set threshold (e.g., 10 units)
   - Low stock rows: light yellow background, dark yellow border
   - Out of stock rows: light red background, dark red border
   - Show notifications for low/out-of-stock items when created/updated

## Technical Requirements
- Single-page web application (SPA) using React
- Responsive and modern UI design (no gradients, solid colors only)
- State management for inventory data (local state or context for MVP)
- Real-time table filtering
- Confirmation dialog for deletions
- Visual cues for low/out-of-stock items
- All components utilize full screen for UI
- Pagination with clear active/inactive button design
- Table and UI remain visually consistent and user-friendly on all screen sizes

## Optional Enhancements (Stretch Goals)
- Data visualization (bar/pie chart of quantities by category)
- Bulk delete (checkbox selection)
- Activity log panel (last 5-10 actions)

## Notes
- Low stock threshold should be configurable (default: 10)
- Consider local storage for persistence in MVP
- Prioritize usability, clarity, and performance
- All notifications use React Toastify for a modern, user-friendly experience
- The Create Item form prevents duplicate product names and notifies the user if a duplicate is attempted
- SKU is auto-generated from the product name and is not editable
- All UI elements and interactions are designed for speed, clarity, and ease of use
