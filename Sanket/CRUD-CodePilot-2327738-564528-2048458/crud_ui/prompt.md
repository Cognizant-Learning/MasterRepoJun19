# Project Apex: The Intelligent Inventory Hub

## The Vision
Every growing business hits a wall: messy spreadsheets, lost notes, and zero visibility into their most valuable asset—their inventory. Our mission is to build a beautiful, fast, and intuitive dashboard that empowers business owners to manage their stock with zero friction.

## Core Mission: Build the MVP

**User Story:**
> "As a store manager, I want to see all my items in a central dashboard, be able to add, update, and remove stock instantly, and get quick insights into my inventory's health, so I can make smarter decisions and stop wasting time on manual data entry."

## MVP Features (Must-Haves)
- **Dashboard View:**
  - Header with key stats: Total Unique Items, Items Low on Stock, Items Out of Stock
  - Inventory Table: Clean, sortable, with columns for Name, SKU, Category, Price, Quantity
  - Real-time search & filter bar
- **Core CRUD Functionality:**
  - Add new item (form or modal)
  - Edit item (per row)
  - Delete item (per row, with confirmation)
- **Low Stock Alert:**
  - Visually highlight items below a threshold (e.g., 10 units)

## Stretch Goals (Innovations)
- Data visualization (bar or pie chart by category)
- Image uploads for products
- Bulk operations (batch delete)
- Activity log (last 5-10 actions)

## Design Notes
- Focus on speed, clarity, and ease of use
- Modern, attractive UI

## Open Questions / To-Do
- Define the low stock threshold (default: 10?)
- Choose charting library for data visualization
- Decide on backend or use local storage for MVP

---

## Prompts and User Stories Used in Development

- When creating a new item, if the product name already exists, show a notification and do not add a duplicate.
- SKU is auto-generated from the product name and is not editable.
- When creating or editing an item, if the quantity is below 10, show a low stock notification for that item.
- When a new item is created, show a notification on the home page with the item name.
- On the first load of the home page, show notifications for all out of stock and low stock items.
- Low stock and out of stock notifications only show for the relevant item when it is created or updated, not for all items every time.
- The dashboard table supports real-time search and filter.
- Each item in the list has Edit and Delete buttons. Edit opens a form to update the item; Delete removes it after confirmation.
- The Create Item form prevents duplicate product names and notifies the user if a duplicate is attempted.
- All notifications use React Toastify for a modern, user-friendly experience.

---

## Prompt: Responsive Design for All Components
- All components should use responsive design for tablet and desktop.
- Media queries are added to CSS for `.dashboard-container`, `.create-item-container`, tables, forms, and buttons to ensure usability and readability on various screen sizes.
- Layout, font size, and padding adjust for screens below 900px (tablet) and 600px (mobile).
