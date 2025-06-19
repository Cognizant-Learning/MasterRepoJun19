# Project Requirements: Apex Inventory Hub

## Functional Requirements (MVP)
1. **Dashboard View**
   - Display key stats: Total Unique Items, Items Low on Stock, Items Out of Stock
   - Show all inventory items in a sortable table with columns: Name, SKU, Category, Price, Quantity
   - Provide a real-time search and filter bar for the table
2. **CRUD Operations**
   - Create: Add new inventory items via a form or modal
   - Read: View all items in the dashboard
   - Update: Edit item details directly from the table
   - Delete: Remove items with a confirmation step
3. **Low Stock Alert**
   - Visually highlight items with quantity below a set threshold (e.g., 10 units)

## Technical Requirements
- Single-page web application (SPA) using React
- Responsive and modern UI design
- State management for inventory data (local state or context for MVP)
- Real-time table filtering
- Confirmation dialog for deletions
- Visual cues for low/out-of-stock items

## Optional Enhancements (Stretch Goals)
- Data visualization (bar/pie chart of quantities by category)
- Product image upload support
- Bulk delete (checkbox selection)
- Activity log panel (last 5-10 actions)

## Notes
- Low stock threshold should be configurable
- Consider local storage for persistence in MVP
- Prioritize usability and performance
