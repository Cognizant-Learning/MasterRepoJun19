// Backend server for CRUD Dashboard (for demonstration purposes)
// In a real implementation, you would need to install these packages with npm:
// npm install express cors mssql

const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Database configuration
const dbConfig = {
    // Use the SQLEXPRESS instance that was found
    server: 'UATDOTNET\\SQLEXPRESS',
    database: 'inventory',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    authentication: {
        type: 'default',
        options: {
            userName: 'sa', // Replace with actual username
            password: 'pass@word1'  // Replace with actual password
        }
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Connect to database
async function connectToDatabase() {
    try {
        await sql.connect(dbConfig);
        console.log('Connected to SQL Server successfully');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
}

// API Routes

// Get all items
app.get('/api/items', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM inventory_items`;
        res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch inventory items' });
    }
});

// Create a new item
app.post('/api/items', async (req, res) => {
    try {
        const { name, sku, category, price, quantity } = req.body;
        
        const result = await sql.query`
            INSERT INTO inventory_items (name, sku, category, price, quantity)
            OUTPUT inserted.*
            VALUES (${name}, ${sku}, ${category}, ${price}, ${quantity})
        `;
        
        res.json({ success: true, data: result.recordset[0] });
    } catch (err) {
        console.error('Error creating item:', err);
        res.status(500).json({ success: false, error: 'Failed to create item' });
    }
});

// Update an item
app.put('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sku, category, price, quantity } = req.body;
        
        const result = await sql.query`
            UPDATE inventory_items
            SET name = ${name}, sku = ${sku}, category = ${category},
                price = ${price}, quantity = ${quantity}
            OUTPUT inserted.*
            WHERE id = ${id}
        `;
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        
        res.json({ success: true, data: result.recordset[0] });
    } catch (err) {
        console.error('Error updating item:', err);
        res.status(500).json({ success: false, error: 'Failed to update item' });
    }
});

// Delete an item
app.delete('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await sql.query`
            DELETE FROM inventory_items
            OUTPUT deleted.*
            WHERE id = ${id}
        `;
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ success: false, error: 'Failed to delete item' });
    }
});

// Get dashboard stats
app.get('/api/stats', async (req, res) => {
    try {
        const totalResult = await sql.query`SELECT COUNT(*) AS totalItems FROM inventory_items`;
        const lowStockResult = await sql.query`
            SELECT COUNT(*) AS lowStockItems 
            FROM inventory_items 
            WHERE quantity > 0 AND quantity < 10
        `;
        const outOfStockResult = await sql.query`
            SELECT COUNT(*) AS outOfStockItems 
            FROM inventory_items 
            WHERE quantity = 0
        `;
        
        res.json({
            success: true,
            data: {
                totalItems: totalResult.recordset[0].totalItems,
                lowStockItems: lowStockResult.recordset[0].lowStockItems,
                outOfStockItems: outOfStockResult.recordset[0].outOfStockItems
            }
        });
    } catch (err) {
        console.error('Error calculating stats:', err);
        res.status(500).json({ success: false, error: 'Failed to calculate inventory stats' });
    }
});

// Setup database and start server
async function initializeServer() {
    try {
        // Connect to the database
        await connectToDatabase();
          // Create the inventory table if it doesn't exist
        await sql.query`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='inventory_items' AND xtype='U')
            CREATE TABLE inventory_items (
                id INT IDENTITY(1,1) PRIMARY KEY,
                name NVARCHAR(255) NOT NULL,
                sku NVARCHAR(50) NOT NULL UNIQUE,
                category NVARCHAR(100) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                quantity INT NOT NULL
            )
        `;
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Server initialization error:', err);
        process.exit(1);
    }
}

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize the server
initializeServer();
