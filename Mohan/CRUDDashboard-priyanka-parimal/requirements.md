# Project Apex: Requirements Document

## 1. Overview
Project Apex is an intelligent inventory management dashboard designed for business owners and store managers. The application aims to replace manual spreadsheets and fragmented notes with a fast, intuitive, and visually appealing single-page web application (SPA).

## 2. Core User Story
"As a store manager, I want to see all my items in a central dashboard, be able to add, update, and remove stock instantly, and get quick insights into my inventory's health, so I can make smarter decisions and stop wasting time on manual data entry."

## 3. Functional Requirements

### 3.1 Dashboard View
- **Key Stats Header:**
  - Display total unique items in inventory.
  - Show count of items low on stock (below threshold, e.g., 10 units).
  - Show count of items out of stock (quantity = 0).
- **Inventory Table:**
  - Present all inventory items in a sortable, filterable table.
  - Columns: Name, SKU, Category, Price, Quantity.
  - Table must support sorting by any column.
- **Search & Filter:**
  - Provide a single search bar to filter items in real-time by any field (name, SKU, category, etc.).

### 3.2 CRUD Operations
- **Create Item:**
  - Form or modal to add a new item with all essential fields.
  - Validation for required fields and data types.
- **Update Item:**
  - Edit button on each row to modify item details.
  - Form/modal pre-filled with current item data.
- **Delete Item:**
  - Delete button on each row.
  - Confirmation dialog before deletion.

### 3.3 Low Stock Alert
- Visually highlight items in the table if their quantity is below a predefined threshold (e.g., yellow or red background for quantity < 10).

## 4. Non-Functional Requirements
- **Performance:**
  - Real-time updates to the table and stats upon CRUD actions.
- **Usability:**
  - Clean, modern, and responsive UI.
  - Accessible design for all users.
- **Reliability:**
  - Data integrity for all CRUD operations.
- **Scalability:**
  - Support for growing inventory sizes without performance degradation.

## 5. Stretch Goals (Optional Enhancements)
- **Data Visualization:**
  - Bar or pie chart showing item quantities by category.
- **Image Uploads:**
  - Allow users to upload and display product images during create/edit.
- **Bulk Operations:**
  - Batch delete using checkboxes in the table.
- **Activity Log:**
  - Panel showing the last 5–10 actions (e.g., item created, updated, deleted).

## 6. Technical Specifications
- **Frontend:**
  - Single-page application (SPA) framework (e.g., React, Vue, Angular).
  - State management for inventory data (e.g., Redux, Context API).
  - Responsive design (CSS framework or custom styles).
- **Backend (if applicable):**
  - RESTful API for CRUD operations.
  - Database for persistent storage (e.g., MongoDB, PostgreSQL).
- **Testing:**
  - Unit and integration tests for core components and logic.
- **Deployment:**
  - Cloud or on-premises deployment options.

## 7. Acceptance Criteria
- All MVP features are implemented and function as described.
- UI is intuitive and responsive across devices.
- All CRUD operations work reliably with proper validation and feedback.
- Low stock highlighting and key stats update in real-time.
- Stretch goals are implemented if time and resources allow.
