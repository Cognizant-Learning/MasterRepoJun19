# CRUD Dashboard Application

Vibe Hackathon Challenge - Inventory Management Dashboard

## Overview

This is a single-page web application that provides a central dashboard for store managers to manage inventory. The application allows users to view, add, update, and delete inventory items, as well as get quick insights into inventory health.

## Features

- **Dashboard View**: Shows key statistics like Total Unique Items, Items Low on Stock, and Items Out of Stock.
- **Interactive Charts**: Visual representations of inventory by category and stock status.
- **Inventory Table**: A clean, sortable table displaying all items with essential information.
- **Search & Filter**: Real-time filtering of the inventory table.
- **CRUD Functionality**: Create, read, update, and delete inventory items.
- **Low Stock Alerts**: Visual highlighting of items that are low on stock or out of stock.
- **Dark/Light Theme**: Toggle between dark and light modes for better viewing comfort.
- **Multi-language Support**: Interface available in English, Spanish, French, and German.
- **Accessibility Features**: WCAG 2.1 compliant with screen reader support, keyboard navigation, and high-contrast visuals.

## Technical Details

- **Frontend**: HTML, CSS, JavaScript with Bootstrap 5
- **Backend**: Node.js with Express
- **Database**: Microsoft SQL Server (Engine ID: 9409D70B617A56F)

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/CRUDDashboard-BOND1-320550-720030-2380395.git
```

2. Navigate to the project directory:
```
cd CRUDDashboard-BOND1-320550-720030-2380395
```

3. Install dependencies:
```
npm install
```

4. Choose one of the running options below:

### Option 1: Client-side only mode (No SQL Server required)

This mode uses the browser's localStorage to store data, which is perfect for demonstrations or when a database server is not available.

1. Run the built-in HTTP server:
```
start-client-only.bat
```
OR manually with:
```
npx http-server -p 5500 -c-1
```

2. Open your browser and navigate to:
```
http://localhost:5500
```

### Option 2: Full stack mode (Requires SQL Server)

This mode connects to a SQL Server database for data persistence.

1. Set up the database using the SQL script:
```
sqlcmd -S SERVERNAME\SQLEXPRESS -U sa -P YourPassword -i database_setup.sql
```

2. Update the database connection details in server.js if necessary.

3. Start the Node.js server:
```
start-server.bat
```
OR manually with:
```
node server.js
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

**Note:** The application has a built-in fallback mechanism. If the SQL Server connection fails, it will automatically switch to using localStorage.

## Project Structure

- `index.html` - Main HTML file
- `src/css/styles.css` - CSS styles
- `src/js/config.js` - Configuration settings
- `src/js/api.js` - API handling for CRUD operations
- `src/js/app.js` - Main application logic
- `server.js` - Backend server
- `database_setup.sql` - SQL setup script

## Usage

- **View Items**: The dashboard automatically displays all inventory items.
- **Add Item**: Click the "Add New Item" button and fill in the details.
- **Edit Item**: Click the "Edit" button on the item row and update the details.
- **Delete Item**: Click the "Delete" button on the item row and confirm.
- **Search**: Use the search bar to filter items based on any attribute.
- **Sort**: Click on column headers to sort the table.
- **Change Theme**: Use the moon/sun icon to toggle between dark and light mode.
- **Change Language**: Select from the language dropdown to switch the interface language.

## Accessibility Features

The application is designed to be accessible to users with disabilities and complies with WCAG 2.1 standards:

- **Screen Reader Support**: All interactive elements have proper ARIA attributes
- **Keyboard Navigation**: Full keyboard support with visual focus indicators
- **Skip Navigation**: Skip to main content link for keyboard users
- **High Contrast**: Sufficient color contrast for text and interface elements
- **Form Accessibility**: Clear labels, instructions, and error messages
- **Live Regions**: Dynamic content changes are announced to screen readers

For full details of accessibility features, see the [accessibility.md](accessibility.md) file.

### Accessibility Testing

The application includes an accessibility checker script that can be used to identify potential accessibility issues:

1. Open the application in a web browser
2. Open the browser's developer console (F12 or Ctrl+Shift+I)
3. Run the following command:
```javascript
// Load the checker script
const script = document.createElement('script');
script.src = 'src/js/accessibility-checker.js';
document.body.appendChild(script);

// Wait a moment and then run the check
setTimeout(() => checkAccessibility(), 1000);
```

This will perform basic accessibility checks and provide a report in the console.