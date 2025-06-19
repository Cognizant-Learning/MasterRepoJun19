# Prompts Used for CRUD Dashboard

## User Story Prompt

As a store manager, I want to see all my items in a central dashboard, be able to add, update, and remove stock instantly, and get quick insights into my inventory's health, so I can make smarter decisions and stop wasting time on manual data entry.

---

## MVP Requirements Prompt

1. The Dashboard View:
   - Key Stats: A header showing Total Unique Items, Items Low on Stock, and Items Out of Stock.
   - The Inventory Table: A clean, sortable table displaying all items.
   - Essential Columns: Name, SKU, Category, Price, Quantity.
   - Search & Filter: A single search bar that can filter the table in real-time.
2. Core CRUD Functionality:
   - Create Item: A simple form (or modal) to add a new item with the essential fields.
   - Update Item: An "Edit" button on each row that allows modification of an item's details.
   - Delete Item: A "Delete" button on each row with a confirmation step (Are you sure?).
3. The "Low Stock" Alert:
   - Items in the table should be visually highlighted (e.g., a yellow or red background) if their quantity falls below a predefined threshold (e.g., 10 units).

---

## Additional Instructions

- The application should be a single-page web app (SPA).
- All actions (CRUD, search, sort) should be instant and user-friendly.
- The UI should be clean and intuitive for store managers.

---

## Development Prompts

1. Create requirements.md file using the instructions.md file with the prompts
2. Create prompt.md to capture all the prompts used
3. Create the application as per requirements.md make use of local sql connection with database engine 9409D70B617A56F wherever applicable
4. Run npm install
