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
5. Create the database and required tables as per backend server.js
6. Add enhanced features including dark/light theme, language conversion, and interactive dashboard based on inventory list
7. Implement accessibility features for the CRUD Dashboard application

---

## Enhanced Features Prompts

### Multi-Language Support Prompt
Implement multi-language support for the dashboard with the following languages: English (default), Spanish, French, and German. Create a language selector dropdown in the header and ensure all user-facing text is properly translated.

### Dark/Light Theme Prompt
Add a theme toggle feature that allows users to switch between light and dark modes. The toggle should be visible in the header, persist the user's preference in localStorage, and apply appropriate styling for better viewing comfort in different lighting conditions.

### Interactive Dashboard Prompt
Enhance the dashboard with interactive charts that provide visual representations of:
1. Inventory distribution by category (pie chart)
2. Stock status overview showing healthy stock, low stock, and out-of-stock items (doughnut chart)

---

## Database Integration Prompts

### SQL Server Integration Prompt
Create a Node.js/Express backend server that integrates with Microsoft SQL Server (Engine ID: 9409D70B617A56F) for data persistence. Implement proper error handling, connection pooling, and API endpoints for CRUD operations.

### Fallback Mechanism Prompt
Implement a fallback mechanism that switches to browser localStorage if the SQL Server connection fails, ensuring the application remains functional even without a database connection.

---

## Accessibility Enhancement Prompts

### Screen Reader Support Prompt
Enhance the application with proper ARIA attributes, ensure form fields have appropriate labels, and add descriptive text for interactive elements to make the dashboard fully accessible to users relying on screen readers.

### Keyboard Navigation Prompt
Implement complete keyboard navigation support throughout the application, including:
- Skip to main content link
- Focus management in modal dialogs
- Enhanced keyboard interaction for tables and forms
- Visible focus indicators for all interactive elements

### Form Accessibility Prompt
Improve form accessibility by:
- Adding clearer labels and descriptions
- Implementing error handling that works with screen readers
- Ensuring validation messages are accessible
- Adding appropriate ARIA attributes to form elements

### Chart Accessibility Prompt
Make dashboard charts accessible by:
- Adding text alternatives for chart data
- Ensuring sufficient color contrast
- Providing keyboard-accessible interactions
- Creating hidden descriptive text for screen readers

### Accessibility Testing Prompt
Create an accessibility checker script that can be used to validate accessibility features and identify potential issues in the application.

---

## Documentation Prompts

### README Update Prompt
Update the README.md file to include comprehensive information about the application's features, installation instructions, usage guidelines, and accessibility features.

### Accessibility Documentation Prompt
Create a dedicated accessibility.md file that documents all accessibility features implemented in the application, including WCAG 2.1 compliance details and testing recommendations.
