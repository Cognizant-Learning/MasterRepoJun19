// Simple mock server for testing the pharmacy dashboard
const http = require('http');

// CORS headers to allow the frontend to connect
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Content-Type': 'application/json'
};

// Helper function to send standardized API responses
function sendJsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, corsHeaders);
  res.end(JSON.stringify(data));
}

// Sample data
const mockData = {
  inventory: [
    {
      _id: '1',
      name: 'Aspirin',
      description: 'Pain reliever',
      sku: 'ASP100',
      category: 'Pain Relievers',
      subcategory: 'Over-the-Counter (OTC) Medications',
      categoryGroup: 'Core Medication',
      price: 5.99,
      cost: 2.50,
      quantity: 100,
      reorderLevel: 20,
      autoFillEnabled: true,
      autoFillQuantity: 50,
      expiryDate: new Date('2025-12-31'),
      batchNumber: 'B12345',
      manufacturer: 'Bayer',
      storageType: 'Room Temperature',
      isControlledSubstance: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '2',
      name: 'Amoxicillin',
      description: 'Antibiotic',
      sku: 'AMX500',
      category: 'Antibiotics',
      subcategory: 'Prescription Medications',
      categoryGroup: 'Core Medication',
      price: 12.99,
      cost: 5.00,
      quantity: 0,
      reorderLevel: 10,
      autoFillEnabled: true,
      autoFillQuantity: 30,
      expiryDate: new Date('2025-08-15'),
      batchNumber: 'AB5678',
      manufacturer: 'Generic Pharma',
      storageType: 'Room Temperature',
      isControlledSubstance: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '3',
      name: 'Insulin',
      description: 'Diabetes medication',
      sku: 'INS100',
      category: 'Antidiabetics',
      subcategory: 'Prescription Medications',
      categoryGroup: 'Core Medication',
      price: 45.99,
      cost: 20.00,
      quantity: 5,
      reorderLevel: 10,
      autoFillEnabled: true,
      autoFillQuantity: 15,
      expiryDate: new Date('2025-07-01'),
      batchNumber: 'IN9012',
      manufacturer: 'Novo Nordisk',
      storageType: 'Refrigerated',
      isControlledSubstance: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  
  notifications: {
    all: [
      {
        _id: '2',
        name: 'Amoxicillin',
        sku: 'AMX500',
        category: 'Antibiotics',
        notificationType: 'Out of Stock',
        detail: {
          currentValue: 0,
          message: 'Out of stock: Amoxicillin needs immediate attention',
          severity: 'danger'
        },
        createdAt: new Date()
      },
      {
        _id: '3',
        name: 'Insulin',
        sku: 'INS100',
        category: 'Antidiabetics',
        notificationType: 'Low Stock',
        detail: {
          currentValue: 5,
          thresholdValue: 10,
          message: 'Low stock: 5 items remaining (below reorder level of 10)',
          severity: 'warning'
        },
        createdAt: new Date()
      }
    ]
  },
  
  analytics: {
    category: [
      {
        _id: 'Pain Relievers',
        count: 10,
        totalValue: 599.00,
        avgPrice: 5.99,
        totalQuantity: 100,
        profitMargin: 58.26,
        turnoverRate: 5.2,
        stockoutFrequency: 0,
        expiryRate: 2.5,
        group: 'Core Medication',
        subcategory: 'Over-the-Counter (OTC) Medications'
      },
      {
        _id: 'Antibiotics',
        count: 5,
        totalValue: 0,
        avgPrice: 12.99,
        totalQuantity: 0,
        profitMargin: 61.51,
        turnoverRate: 7.8,
        stockoutFrequency: 100,
        expiryRate: 5.2,
        group: 'Core Medication',
        subcategory: 'Prescription Medications'
      },
      {
        _id: 'Antidiabetics',
        count: 8,
        totalValue: 229.95,
        avgPrice: 45.99,
        totalQuantity: 5,
        profitMargin: 56.51,
        turnoverRate: 8.9,
        stockoutFrequency: 0,
        expiryRate: 3.5,
        group: 'Core Medication',
        subcategory: 'Prescription Medications'
      }
    ]
  }
};

// Create a server
const server = http.createServer((req, res) => {  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  res.setHeader('Content-Type', 'application/json');
    // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end();
    return;
  }
  
  // Set content type to JSON
  res.setHeader('Content-Type', 'application/json');
  
  // Parse the URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  
  console.log(`Request: ${req.method} ${pathname}`);
  
  // Route handling
  if (pathname === '/api/inventory' && req.method === 'GET') {
    // Get all inventory items
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: mockData.inventory.length, data: mockData.inventory }));
  } else if (pathname.match(/^\/api\/inventory\/\w+$/) && req.method === 'GET') {
    // Get a specific inventory item
    const id = pathname.split('/').pop();
    const item = mockData.inventory.find(item => item._id === id);
    
    if (item) {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: item }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ success: false, error: 'Item not found' }));
    }
  } else if (pathname === '/api/inventory/analytics/category' && req.method === 'GET') {
    // Get analytics by category
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: mockData.analytics.category.length, data: mockData.analytics.category }));
  } else if (pathname === '/api/inventory/analytics/subcategory' && req.method === 'GET') {
    // Get analytics by subcategory
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: mockData.analytics.category.length, data: mockData.analytics.category }));
  } else if (pathname === '/api/inventory/notifications/all' && req.method === 'GET') {
    // Get all notifications
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: mockData.notifications.all.length, data: mockData.notifications.all }));
  } else if (pathname === '/api/inventory/notifications/low-stock' && req.method === 'GET') {
    // Get low stock notifications
    const lowStockItems = mockData.notifications.all.filter(item => item.notificationType === 'Low Stock');
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: lowStockItems.length, data: lowStockItems }));
  } else if (pathname === '/api/inventory/notifications/out-of-stock' && req.method === 'GET') {
    // Get out of stock notifications
    const outOfStockItems = mockData.notifications.all.filter(item => item.notificationType === 'Out of Stock');
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: outOfStockItems.length, data: outOfStockItems }));
  } else if (pathname === '/api/inventory/notifications/expiring' && req.method === 'GET') {
    // Get expiring notifications
    const expiringItems = mockData.notifications.all.filter(item => 
      item.notificationType.includes('Expiry'));
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: expiringItems.length, data: expiringItems }));
  } else if (pathname === '/api/inventory/notifications/price-changes' && req.method === 'GET') {
    // Get price change notifications
    const priceChangeItems = mockData.notifications.all.filter(item => item.notificationType === 'Price Change');
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: priceChangeItems.length, data: priceChangeItems }));
  } else if (pathname === '/api/inventory/auto-fill/trigger' && req.method === 'POST') {
    // Trigger auto-fill for all eligible items
    const results = mockData.inventory
      .filter(item => item.quantity === 0 && item.autoFillEnabled)
      .map(item => ({
        itemId: item._id,
        itemName: item.name,
        previousQuantity: 0,
        newQuantity: item.autoFillQuantity,
        autoFillQuantity: item.autoFillQuantity,
        successful: true,
        message: `Successfully auto-filled ${item.autoFillQuantity} units of ${item.name}`
      }));
    
    // Update the quantities in our mock data
    results.forEach(result => {
      const item = mockData.inventory.find(i => i._id === result.itemId);
      if (item) item.quantity = result.autoFillQuantity;
    });
    
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: results.length, data: results }));
  } else {
    // Route not found
    res.writeHead(404);
    res.end(JSON.stringify({ success: false, error: 'Not Found' }));
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});
