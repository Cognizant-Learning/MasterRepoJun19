# Project Apex: The Intelligent Inventory Hub

## Vision
Build a beautiful, fast, and intuitive dashboard that empowers business owners to manage their inventory with zero friction—eliminating messy spreadsheets, lost notes, and lack of visibility.

## MVP Features (Must-Haves)

### 1. Dashboard Header
- Show total unique items
- Show count of items low on stock
- Show count of items out of stock

### 2. Inventory Table
- Display all items in a sortable table
- Columns: Name, SKU, Category, Price, Quantity

### 3. Search & Filter
- Real-time search bar to filter items

### 4. CRUD Operations
- Add new item (form/modal)
- Edit item details (edit button per row)
- Delete item (delete button per row with confirmation)

### 5. Low Stock Highlight
- Visually highlight items if quantity is below threshold (e.g., 10 units)

## Innovative Features (Stretch Goals)

### 1. Data Visualization
- Bar or pie chart showing item quantities by category

### 2. Image Uploads
- Allow users to upload a product image when creating/editing an item

### 3. Bulk Operations
- Implement batch delete using checkboxes on the table

### 4. Activity Log
- Panel showing the last 5-10 actions taken (e.g., "Item 'T-Shirt' created")

## Architecture & Tech Stack

### Frontend
- React.js (SPA)
- Material-UI (MUI) or Ant Design
- React Context or Redux Toolkit
- Formik or React Hook Form
- Axios or Fetch API
- Chart.js or Recharts (for data visualization)
- FilePond or similar (for image uploads)

### Backend
- Node.js with Express.js
- NeDB (in-memory MongoDB-compatible database)
- Multer (for handling image uploads)
- JWT or API key (optional authentication)
- Winston or Morgan (for activity logging)

### Other Tools
- Git & GitHub
- Postman or Insomnia
- VS Code

### Deployment
- Frontend: Vercel, Netlify, or GitHub Pages
- Backend: Render, Railway, or Heroku
- Database: In-memory with NeDB (with optional file persistence)

### Architecture Overview
- React SPA communicates with Express REST API (JSON)
- Express API handles CRUD, image uploads, activity logging, and business logic
- NeDB stores inventory, images (as URLs), and activity logs in memory for fast access
- Data persistence layer configurable to save to disk when needed
- Chart.js/Recharts for frontend data visualization
- Multer for backend image upload handling