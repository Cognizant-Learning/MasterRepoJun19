// Mock API handlers using MSW (Mock Service Worker)
import { rest } from 'msw';

// Sample data - same as in mock-server.js but with more complete data
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
      quantity: 15,
      reorderLevel: 20,
      autoFillEnabled: true,
      autoFillQuantity: 50,
      expiryDate: new Date('2025-12-31'),
      batchNumber: 'B12345',
      manufacturer: 'Bayer',
      storageType: 'Room Temperature',
      isControlledSubstance: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priceHistory: [
        { price: 5.50, date: new Date('2025-01-01') },
        { price: 5.75, date: new Date('2025-03-15') },
        { price: 5.99, date: new Date('2025-06-01') }
      ],
      notificationPreferences: ['LOW_STOCK', 'EXPIRY_30_DAYS']
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
      updatedAt: new Date(),
      priceHistory: [
        { price: 10.99, date: new Date('2025-01-01') },
        { price: 12.99, date: new Date('2025-05-01') }
      ],
      notificationPreferences: ['OUT_OF_STOCK', 'EXPIRY_60_DAYS']
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
      updatedAt: new Date(),
      priceHistory: [
        { price: 40.99, date: new Date('2025-01-01') },
        { price: 42.99, date: new Date('2025-03-01') },
        { price: 45.99, date: new Date('2025-05-15') }
      ],
      notificationPreferences: ['LOW_STOCK', 'EXPIRY_30_DAYS', 'PRICE_CHANGE']
    },
    {
      _id: '4',
      name: 'Ibuprofen',
      description: 'Anti-inflammatory pain reliever',
      sku: 'IBU200',
      category: 'Pain Relievers',
      subcategory: 'Over-the-Counter (OTC) Medications',
      categoryGroup: 'Core Medication',
      price: 4.99,
      cost: 1.50,
      quantity: 200,
      reorderLevel: 50,
      autoFillEnabled: false,
      autoFillQuantity: 0,
      expiryDate: new Date('2026-02-28'),
      batchNumber: 'IB2345',
      manufacturer: 'Generic Health',
      storageType: 'Room Temperature',
      isControlledSubstance: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priceHistory: [
        { price: 4.99, date: new Date('2025-01-01') }
      ],
      notificationPreferences: []
    },
    {
      _id: '5',
      name: 'Metformin',
      description: 'Diabetes medication',
      sku: 'MET500',
      category: 'Antidiabetics',
      subcategory: 'Prescription Medications',
      categoryGroup: 'Core Medication',
      price: 8.99,
      cost: 3.00,
      quantity: 3,
      reorderLevel: 5,
      autoFillEnabled: true,
      autoFillQuantity: 20,
      expiryDate: new Date('2025-06-30'),
      batchNumber: 'MT7890',
      manufacturer: 'Generic Pharma',
      storageType: 'Room Temperature',
      isControlledSubstance: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priceHistory: [
        { price: 7.99, date: new Date('2025-01-01') },
        { price: 8.99, date: new Date('2025-04-15') }
      ],
      notificationPreferences: ['LOW_STOCK', 'EXPIRY_30_DAYS']
    },
    {
      _id: '6',
      name: 'Oxycodone',
      description: 'Pain reliever opioid',
      sku: 'OXY5',
      category: 'Pain Management',
      subcategory: 'Controlled Substances',
      categoryGroup: 'Core Medication',
      price: 35.99,
      cost: 15.00,
      quantity: 50,
      reorderLevel: 20,
      autoFillEnabled: false,
      autoFillQuantity: 0,
      expiryDate: new Date('2026-01-15'),
      batchNumber: 'OX1234',
      manufacturer: 'Pharma Inc',
      storageType: 'Locked Cabinet',
      isControlledSubstance: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      priceHistory: [
        { price: 32.99, date: new Date('2025-01-01') },
        { price: 35.99, date: new Date('2025-05-01') }
      ],
      notificationPreferences: ['LOW_STOCK']
    }
  ],
  notifications: {
    lowStock: [
      {
        _id: '1',
        name: 'Aspirin',
        sku: 'ASP100',
        category: 'Pain Relievers',
        notificationType: 'Low Stock',
        detail: {
          currentValue: 15,
          thresholdValue: 20,
          message: 'Stock is below reorder level: 15 of 20',
          severity: 'warning'
        },
        createdAt: new Date()
      },
      {
        _id: '5',
        name: 'Metformin',
        sku: 'MET500',
        category: 'Antidiabetics',
        notificationType: 'Low Stock',
        detail: {
          currentValue: 3,
          thresholdValue: 5,
          message: 'Stock is critically low: 3 of 5',
          severity: 'danger'
        },
        createdAt: new Date()
      }
    ],
    outOfStock: [
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
      }
    ],
    expiring: [
      {
        _id: '3',
        name: 'Insulin',
        sku: 'INS100',
        category: 'Antidiabetics',
        notificationType: 'Expiry 30 Days',
        detail: {
          currentValue: new Date('2025-07-01'),
          message: 'Expires in 12 days',
          severity: 'danger',
          daysToExpiry: 12
        },
        createdAt: new Date()
      },
      {
        _id: '5',
        name: 'Metformin',
        sku: 'MET500',
        category: 'Antidiabetics',
        notificationType: 'Expiry 30 Days',
        detail: {
          currentValue: new Date('2025-06-30'),
          message: 'Expires in 11 days',
          severity: 'danger',
          daysToExpiry: 11
        },
        createdAt: new Date()
      }
    ],
    priceChange: [
      {
        _id: '3',
        name: 'Insulin',
        sku: 'INS100',
        category: 'Antidiabetics',
        notificationType: 'Price Change',
        detail: {
          currentValue: 45.99,
          previousPrice: 42.99,
          priceChange: 3.00,
          priceChangePercent: 6.98,
          message: 'Price increased by 6.98% ($3.00)',
          severity: 'warning'
        },
        createdAt: new Date()
      }
    ]
  },
  categories: [
    'Pain Relievers',
    'Antibiotics',
    'Antidiabetics',
    'Pain Management',
    'Cardiovascular',
    'Respiratory',
    'Gastrointestinal'
  ],
  subcategories: [
    'Over-the-Counter (OTC) Medications',
    'Prescription Medications',
    'Medical Supplies',
    'Vitamins and Supplements',
    'Personal Care Products',
    'Controlled Substances',
    'Inventory Attributes'
  ],
  categoryGroups: [
    'Core Medication',
    'Additional',
    'Administrative'
  ],
  categoryStructure: {
    categoryGroups: [
      'Core Medication',
      'Additional',
      'Administrative'
    ],
    subcategories: [
      'Over-the-Counter (OTC) Medications',
      'Prescription Medications',
      'Medical Supplies',
      'Vitamins and Supplements',
      'Personal Care Products',
      'Controlled Substances',
      'Inventory Attributes'
    ],
    categories: [
      'Pain Relievers',
      'Antibiotics',
      'Antidiabetics',
      'Pain Management',
      'Cardiovascular',
      'Respiratory',
      'Gastrointestinal'
    ],
    categoryToSubcategory: {
      'Pain Relievers': 'Over-the-Counter (OTC) Medications',
      'Antibiotics': 'Prescription Medications',
      'Antidiabetics': 'Prescription Medications',
      'Pain Management': 'Prescription Medications',
      'Cardiovascular': 'Prescription Medications',
      'Respiratory': 'Prescription Medications',
      'Gastrointestinal': 'Over-the-Counter (OTC) Medications'
    }
  },
  analytics: {
    category: [
      { _id: 'Pain Relievers', count: 2, totalValue: 1197, averagePrice: 5.49 },
      { _id: 'Antibiotics', count: 1, totalValue: 0, averagePrice: 12.99 },
      { _id: 'Antidiabetics', count: 2, totalValue: 274.93, averagePrice: 27.49 },
      { _id: 'Pain Management', count: 1, totalValue: 1799.5, averagePrice: 35.99 }
    ],
    subcategory: [
      { _id: 'Over-the-Counter (OTC) Medications', count: 2, totalValue: 1197, averagePrice: 5.49 },
      { _id: 'Prescription Medications', count: 3, totalValue: 274.93, averagePrice: 22.49 },
      { _id: 'Controlled Substances', count: 1, totalValue: 1799.5, averagePrice: 35.99 }
    ]
  }
};

// Calculate all notifications for easier access
mockData.notifications.all = [
  ...mockData.notifications.lowStock,
  ...mockData.notifications.outOfStock,
  ...mockData.notifications.expiring,
  ...mockData.notifications.priceChange
];

export const handlers = [
  // Get all inventory items
  rest.get('/api/inventory', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        count: mockData.inventory.length,
        data: mockData.inventory
      })
    );
  }),

  // Get a single inventory item
  rest.get('/api/inventory/:id', (req, res, ctx) => {
    const { id } = req.params;
    const item = mockData.inventory.find(item => item._id === id);
    
    if (!item) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          error: 'Item not found'
        })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: item
      })
    );
  }),

  // Create a new inventory item
  rest.post('/api/inventory', (req, res, ctx) => {
    const newItem = {
      ...req.body,
      _id: String(mockData.inventory.length + 1),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockData.inventory.push(newItem);
    
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: newItem
      })
    );
  }),

  // Update an inventory item
  rest.put('/api/inventory/:id', (req, res, ctx) => {
    const { id } = req.params;
    const index = mockData.inventory.findIndex(item => item._id === id);
    
    if (index === -1) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          error: 'Item not found'
        })
      );
    }
    
    const updatedItem = {
      ...mockData.inventory[index],
      ...req.body,
      updatedAt: new Date()
    };
    
    mockData.inventory[index] = updatedItem;
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: updatedItem
      })
    );
  }),

  // Delete an inventory item
  rest.delete('/api/inventory/:id', (req, res, ctx) => {
    const { id } = req.params;
    const index = mockData.inventory.findIndex(item => item._id === id);
    
    if (index === -1) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          error: 'Item not found'
        })
      );
    }
    
    mockData.inventory.splice(index, 1);
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {}
      })
    );
  }),

  // Get analytics by category
  rest.get('/api/inventory/analytics/category', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: mockData.analytics.category
      })
    );
  }),

  // Get analytics by subcategory
  rest.get('/api/inventory/analytics/subcategory', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: mockData.analytics.subcategory
      })
    );
  }),

  // Get categories list
  rest.get('/api/inventory/categories/list', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: mockData.categories
      })
    );
  }),

  // Get category structure
  rest.get('/api/inventory/categories/structure', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: mockData.categoryStructure
      })
    );
  }),

  // Get low stock notifications
  rest.get('/api/inventory/notifications/low-stock', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        count: mockData.notifications.lowStock.length,
        data: mockData.notifications.lowStock
      })
    );
  }),

  // Get out of stock notifications
  rest.get('/api/inventory/notifications/out-of-stock', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        count: mockData.notifications.outOfStock.length,
        data: mockData.notifications.outOfStock
      })
    );
  }),

  // Get expiring notifications
  rest.get('/api/inventory/notifications/expiring', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        count: mockData.notifications.expiring.length,
        data: mockData.notifications.expiring
      })
    );
  }),

  // Get price change notifications
  rest.get('/api/inventory/notifications/price-changes', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        count: mockData.notifications.priceChange.length,
        data: mockData.notifications.priceChange
      })
    );
  }),

  // Get all notifications
  rest.get('/api/inventory/notifications/all', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        count: mockData.notifications.all.length,
        data: mockData.notifications.all
      })
    );
  }),

  // Trigger auto-fill for all eligible items
  rest.post('/api/inventory/auto-fill/trigger', (req, res, ctx) => {
    const eligibleItems = mockData.inventory.filter(item => 
      item.quantity === 0 && item.autoFillEnabled && item.autoFillQuantity > 0
    );
    
    const results = eligibleItems.map(item => {
      // Update the item quantity
      const index = mockData.inventory.findIndex(i => i._id === item._id);
      if (index !== -1) {
        mockData.inventory[index].quantity = item.autoFillQuantity;
      }
      
      // Remove from out of stock notifications
      const notificationIndex = mockData.notifications.outOfStock.findIndex(n => n._id === item._id);
      if (notificationIndex !== -1) {
        mockData.notifications.outOfStock.splice(notificationIndex, 1);
        // Also remove from all notifications
        const allIndex = mockData.notifications.all.findIndex(n => 
          n._id === item._id && n.notificationType === 'Out of Stock'
        );
        if (allIndex !== -1) {
          mockData.notifications.all.splice(allIndex, 1);
        }
      }
      
      return {
        itemId: item._id,
        itemName: item.name,
        previousQuantity: 0,
        newQuantity: item.autoFillQuantity,
        autoFillQuantity: item.autoFillQuantity,
        successful: true,
        message: `Successfully auto-filled ${item.autoFillQuantity} units of ${item.name}`
      };
    });
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        count: results.length,
        data: results
      })
    );
  }),

  // Auto-fill a specific item
  rest.post('/api/inventory/auto-fill/:id', (req, res, ctx) => {
    const { id } = req.params;
    const item = mockData.inventory.find(item => item._id === id);
    
    if (!item) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          error: 'Item not found'
        })
      );
    }
    
    if (!item.autoFillEnabled || !item.autoFillQuantity) {
      return res(
        ctx.status(400),
        ctx.json({
          success: false,
          error: 'Auto-fill is not enabled for this item'
        })
      );
    }
    
    const previousQuantity = item.quantity;
    
    // Update the item quantity
    const index = mockData.inventory.findIndex(i => i._id === id);
    if (index !== -1) {
      mockData.inventory[index].quantity = item.autoFillQuantity;
    }
    
    // Remove from out of stock notifications if applicable
    if (previousQuantity === 0) {
      const notificationIndex = mockData.notifications.outOfStock.findIndex(n => n._id === id);
      if (notificationIndex !== -1) {
        mockData.notifications.outOfStock.splice(notificationIndex, 1);
        // Also remove from all notifications
        const allIndex = mockData.notifications.all.findIndex(n => 
          n._id === id && n.notificationType === 'Out of Stock'
        );
        if (allIndex !== -1) {
          mockData.notifications.all.splice(allIndex, 1);
        }
      }
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          itemId: id,
          itemName: item.name,
          previousQuantity,
          newQuantity: item.autoFillQuantity,
          autoFillQuantity: item.autoFillQuantity,
          successful: true,
          message: `Successfully auto-filled ${item.autoFillQuantity} units of ${item.name}`
        }
      })
    );
  }),

  // Update auto-fill settings for an item
  rest.put('/api/inventory/auto-fill/:id', (req, res, ctx) => {
    const { id } = req.params;
    const { enabled, quantity } = req.body;
    
    const index = mockData.inventory.findIndex(item => item._id === id);
    
    if (index === -1) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          error: 'Item not found'
        })
      );
    }
    
    mockData.inventory[index].autoFillEnabled = enabled;
    if (quantity !== undefined) {
      mockData.inventory[index].autoFillQuantity = quantity;
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: mockData.inventory[index]
      })
    );
  })
];
