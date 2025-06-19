# CRUD Dashboard Requirements

## Core User Story

> As a store manager, I want to see all my items in a central dashboard, be able to add, update, and remove stock instantly, and get quick insights into my inventory's health, so I can make smarter decisions and stop wasting time on manual data entry.

---

## MVP Requirements (Must-Haves)

### 1. Dashboard View

- **Key Stats Header**
  - Display the following:
    - Total Unique Items
    - Items Low on Stock
    - Items Out of Stock

- **Inventory Table**
  - Clean, sortable table displaying all items.
  - **Essential Columns:**
    - Name
    - SKU
    - Category
    - Price
    - Quantity

- **Search & Filter**
  - Single search bar that filters the table in real-time (search by any field).

---

### 2. Core CRUD Functionality

- **Create Item**
  - Simple form or modal to add a new item with all essential fields.

- **Update Item**
  - "Edit" button on each row to modify item details.

- **Delete Item**
  - "Delete" button on each row.
  - Confirmation step before deletion ("Are you sure?").

---

### 3. Low Stock Alert

- Items in the table should be visually highlighted (e.g., yellow or red background) if their quantity falls below a predefined threshold (e.g., 10 units).

---

## Additional Notes

- The application should be a single-page web app (SPA).
- All actions (CRUD, search, sort) should be instant and user-friendly.
- The UI should be clean and intuitive for store managers.
