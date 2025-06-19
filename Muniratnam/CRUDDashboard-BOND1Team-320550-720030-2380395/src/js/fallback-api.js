// Fallback API implementation using localStorage
// This can be used if the SQL Server connection fails

(function() {
    // Check if we're in development/demo mode
    const isDevMode = true;
    
    if (isDevMode) {
        // Add some sample data if there's none
        const sampleItems = [
            {
                id: 1,
                name: "Office Chair",
                sku: "FRN-1001",
                category: "Furniture",
                price: 199.99,
                quantity: 15
            },
            {
                id: 2,
                name: "Premium Desk",
                sku: "FRN-2002",
                category: "Furniture",
                price: 349.99,
                quantity: 8
            },
            {
                id: 3,
                name: "Wireless Mouse",
                sku: "ELC-3001",
                category: "Electronics",
                price: 24.99,
                quantity: 30
            },
            {
                id: 4,
                name: "Mechanical Keyboard",
                sku: "ELC-3002",
                category: "Electronics",
                price: 89.99,
                quantity: 5
            },
            {
                id: 5,
                name: "Monitor Stand",
                sku: "ACC-4001",
                category: "Accessories",
                price: 49.99,
                quantity: 0
            }
        ];
        
        if (!localStorage.getItem('inventory') || JSON.parse(localStorage.getItem('inventory')).length === 0) {
            localStorage.setItem('inventory', JSON.stringify(sampleItems));
        }
        
        // Set up fallback API endpoints
        const apiEndpoints = {
            // Get all items
            '/api/items': function(method, body) {
                if (method === 'GET') {
                    return { 
                        success: true, 
                        data: JSON.parse(localStorage.getItem('inventory')) 
                    };
                } else if (method === 'POST') {
                    try {
                        const items = JSON.parse(localStorage.getItem('inventory') || '[]');
                        const newItem = {
                            id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1,
                            name: body.name,
                            sku: body.sku,
                            category: body.category,
                            price: parseFloat(body.price),
                            quantity: parseInt(body.quantity)
                        };
                        items.push(newItem);
                        localStorage.setItem('inventory', JSON.stringify(items));
                        return { success: true, data: newItem };
                    } catch (error) {
                        console.error('Error creating item:', error);
                        return { success: false, error: 'Failed to create item' };
                    }
                }
            },
            
            // Get, update or delete specific item
            '/api/items/': function(method, body, id) {
                try {
                    let items = JSON.parse(localStorage.getItem('inventory') || '[]');
                    const index = items.findIndex(item => item.id == id);
                    
                    if (index === -1) {
                        return { success: false, error: 'Item not found' };
                    }
                    
                    if (method === 'GET') {
                        return { success: true, data: items[index] };
                    } else if (method === 'PUT') {
                        items[index] = {
                            ...items[index],
                            name: body.name,
                            sku: body.sku,
                            category: body.category,
                            price: parseFloat(body.price),
                            quantity: parseInt(body.quantity)
                        };
                        
                        localStorage.setItem('inventory', JSON.stringify(items));
                        return { success: true, data: items[index] };
                    } else if (method === 'DELETE') {
                        const filteredItems = items.filter(item => item.id != id);
                        localStorage.setItem('inventory', JSON.stringify(filteredItems));
                        return { success: true };
                    }
                } catch (error) {
                    console.error('Error handling item operation:', error);
                    return { success: false, error: 'Failed to perform operation' };
                }
            },
            
            // Get dashboard stats
            '/api/stats': function(method) {
                if (method === 'GET') {
                    try {
                        const items = JSON.parse(localStorage.getItem('inventory') || '[]');
                        const totalItems = items.length;
                        const lowStockItems = items.filter(item => item.quantity > 0 && item.quantity < 10).length;
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
            }
        };
        
        // Monkeypatch fetch to use our fallback API
        const originalFetch = window.fetch;
        window.fetch = function(url, options = {}) {
            const method = options.method || 'GET';
            
            // Check if this is an API call we should handle
            if (url.startsWith('/api/')) {
                // Item-specific endpoint
                if (url.startsWith('/api/items/') && url !== '/api/items/') {
                    const id = url.split('/').pop();
                    const body = options.body ? JSON.parse(options.body) : {};
                    const response = apiEndpoints['/api/items/'](method, body, id);
                    
                    return Promise.resolve({
                        ok: response.success,
                        json: () => Promise.resolve(response)
                    });
                }
                
                // General endpoints
                for (const endpoint in apiEndpoints) {
                    if (url === endpoint) {
                        const body = options.body ? JSON.parse(options.body) : {};
                        const response = apiEndpoints[endpoint](method, body);
                        
                        return Promise.resolve({
                            ok: response.success,
                            json: () => Promise.resolve(response)
                        });
                    }
                }
            }
            
            // Pass through to original fetch for all other requests
            return originalFetch(url, options);
        };
        
        console.log('Fallback API loaded - using localStorage for data storage');
    }
})();
