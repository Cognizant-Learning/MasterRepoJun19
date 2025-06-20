# Project Apex: Requirements Document

## 1. Overview
Project Apex is an intelligent inventory management dashboard designed for small and growing businesses. The application will be a single-page web app (SPA) built with ASP.NET Core MVC, providing a fast, intuitive, and visually appealing interface for managing inventory.

## 2. Core User Story
As a store manager, I want to see all my items in a central dashboard, be able to add, update, and remove stock instantly, and get quick insights into my inventory's health, so I can make smarter decisions and stop wasting time on manual data entry.

## 3. Functional Requirements

### 3.1 Dashboard View
- **Key Stats Header:**
  - Total Unique Items
  - Items Low on Stock (below threshold)
  - Items Out of Stock
- **Inventory Table:**
  - Clean, sortable table displaying all items
  - Essential columns: Name, SKU, Category, Price, Quantity
  - Real-time search and filter bar (filters table as user types)

### 3.2 CRUD Operations
- **Create Item:**
  - Form or modal to add a new item (fields: Name, SKU, Category, Price, Quantity)
- **Update Item:**
  - Edit button on each row to modify item details
- **Delete Item:**
  - Delete button on each row with confirmation prompt

### 3.3 Low Stock Alert
- Items with quantity below a configurable threshold (default: 10 units) are visually highlighted (e.g., yellow or red background)

## 4. Stretch Goals (Optional Enhancements)
- **Data Visualization:** Bar or pie chart showing item quantities by category
- **Image Uploads:** Allow product image upload during create/edit
- **Bulk Operations:** Batch delete using checkboxes in the table
- **Activity Log:** Panel showing last 5-10 actions (e.g., item created/edited/deleted)

## 5. Technical Specifications
- **Framework:** ASP.NET Core MVC (latest LTS)
- **Database:** SQL Server (connection via SQL authentication)
- **ORM:** Entity Framework Core
- **Frontend:** Razor Views, Bootstrap (or similar CSS framework)
- **Authentication:** Not required for MVP
- **Configuration:**
  - Inventory threshold value stored in appsettings.json
  - Connection string for SQL Server in appsettings.json
- **Deployment:** Ready for local development and production deployment

## 6. Non-Functional Requirements
- **Performance:** Fast page loads and real-time table filtering
- **Usability:** Clean, modern UI with intuitive navigation
- **Accessibility:** Basic accessibility best practices
- **Responsiveness:** Mobile-friendly layout

## 7. Deliverables
- Complete source code with clear structure
- Database schema (migrations or scripts)
- Setup instructions (README)
- requirements.md (this document)

---
This requirements document serves as the foundational blueprint for Project Apex and should guide all design and development decisions.