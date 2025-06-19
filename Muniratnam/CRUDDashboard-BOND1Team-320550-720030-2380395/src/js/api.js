// API handling for inventory CRUD operations

class InventoryAPI {
    constructor() {
        this.dbEngine = CONFIG.DB_ENGINE;
        this.apiUrl = CONFIG.API_URL;
        this.useServerApi = true;
        
        // Test the API connection
        this.testConnection();
        
        // For development/demo purposes, we'll use localStorage
        // In a real application, this would connect to an actual database
        if (!localStorage.getItem('inventory')) {
            localStorage.setItem('inventory', JSON.stringify([]));
        }
    }
    
    // Test if we can connect to the server API
    async testConnection() {
        try {
            const response = await fetch(`${this.apiUrl}/stats`, { 
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!response.ok) {
                console.warn('Server API not available, using localStorage fallback');
                this.useServerApi = false;
            }
        } catch (error) {
            console.warn('Server API not available, using localStorage fallback:', error);
            this.useServerApi = false;
        }
    }
    
    // Helper method to generate a unique ID
    #generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
      // Get all inventory items
    async getAllItems() {
        try {
            if (this.useServerApi) {
                try {
                    const response = await fetch(`${this.apiUrl}/items`, { 
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        return result;
                    } else {
                        // If server request fails, fall back to localStorage
                        console.warn('Server API request failed, using localStorage fallback');
                        this.useServerApi = false;
                    }
                } catch (error) {
                    console.warn('Server API request failed, using localStorage fallback:', error);
                    this.useServerApi = false;
                }
            }
            
            // Fallback to localStorage
            const items = JSON.parse(localStorage.getItem('inventory') || '[]');
            return { success: true, data: items };
        } catch (error) {
            console.error('Error fetching inventory items:', error);
            return { success: false, error: 'Failed to fetch inventory items' };
        }
    }
    
    // Create a new item
    async createItem(item) {
        try {
            const items = JSON.parse(localStorage.getItem('inventory') || '[]');
            const newItem = {
                id: this.#generateId(),
                name: item.name,
                sku: item.sku,
                category: item.category,
                price: parseFloat(item.price),
                quantity: parseInt(item.quantity)
            };
            items.push(newItem);
            localStorage.setItem('inventory', JSON.stringify(items));
            return { success: true, data: newItem };
        } catch (error) {
            console.error('Error creating item:', error);
            return { success: false, error: 'Failed to create item' };
        }
    }
    
    // Update an existing item
    async updateItem(id, updatedItem) {
        try {
            let items = JSON.parse(localStorage.getItem('inventory') || '[]');
            const index = items.findIndex(item => item.id === id);
            
            if (index === -1) {
                return { success: false, error: 'Item not found' };
            }
            
            items[index] = {
                ...items[index],
                ...updatedItem
            };
            
            localStorage.setItem('inventory', JSON.stringify(items));
            return { success: true, data: items[index] };
        } catch (error) {
            console.error('Error updating item:', error);
            return { success: false, error: 'Failed to update item' };
        }
    }
    
    // Delete an item
    async deleteItem(id) {
        try {
            let items = JSON.parse(localStorage.getItem('inventory') || '[]');
            const filteredItems = items.filter(item => item.id !== id);
            
            if (filteredItems.length === items.length) {
                return { success: false, error: 'Item not found' };
            }
            
            localStorage.setItem('inventory', JSON.stringify(filteredItems));
            return { success: true };
        } catch (error) {
            console.error('Error deleting item:', error);
            return { success: false, error: 'Failed to delete item' };
        }
    }
    
    // Get dashboard stats
    async getStats() {
        try {
            const items = JSON.parse(localStorage.getItem('inventory') || '[]');
            const totalItems = items.length;
            const lowStockItems = items.filter(item => item.quantity > 0 && item.quantity < CONFIG.LOW_STOCK_THRESHOLD).length;
            const outOfStockItems = items.filter(item => item.quantity === 0).length;
            
            return {
                success: true,
                data: {
                    totalItems,
                    lowStockItems,
                    outOfStockItems
                }
            };
        } catch (error) {
            console.error('Error calculating stats:', error);
            return { success: false, error: 'Failed to calculate inventory stats' };
        }
    }
    
    // In a real implementation, this would interact with a SQL Server using the specified engine
    // Example of how you might implement a SQL connection in a Node.js backend:
    /*
    async #connectToDatabase() {
        // This is a placeholder for the actual connection code
        const sql = require('mssql');
        const config = {
            server: 'localhost',
            database: 'inventory',
            options: {
                encrypt: true,
                trustServerCertificate: true,
                instanceName: this.dbEngine
            },
            authentication: {
                type: 'default',
                options: {
                    userName: 'username',
                    password: 'password'
                }
            }
        };
        
        try {
            await sql.connect(config);
            return sql;
        } catch (err) {
            console.error('Database connection error:', err);
            throw err;
        }
    }
    */
}
