import { mockApiService } from '../mocks/mockApiService';

// Set window.API_MODE to standalone for tests
window.API_MODE = 'standalone';

describe('Standalone Mock API Service', () => {
  test('should initialize correctly', () => {
    expect(mockApiService).toBeDefined();
    expect(typeof mockApiService.getAllItems).toBe('function');
  });

  test('should return inventory items', async () => {
    const result = await mockApiService.getAllItems();
    expect(result).toBeDefined();
    expect(Array.isArray(result.data)).toBeTruthy();
    expect(result.data.length).toBeGreaterThan(0);
  });

  test('should get item by ID', async () => {
    // First get all items
    const allItems = await mockApiService.getAllItems();
    const firstItem = allItems.data[0];
    
    // Then get a specific item by ID
    const result = await mockApiService.getItem(firstItem._id);
    
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data._id).toBe(firstItem._id);
  });

  test('should create a new item', async () => {
    const newItem = {
      name: 'Test Medicine',
      description: 'A test medicine',
      category: 'Antibiotics',
      quantity: 100,
      price: 9.99,
      supplier: 'Test Supplier',
      expiryDate: new Date(2025, 11, 31),
      batchNumber: 'TEST-BATCH-001',
      location: 'Shelf A-1',
      reorderLevel: 20,
      dosageForm: 'Tablet',
      strength: '500mg'
    };
    
    const result = await mockApiService.createItem(newItem);
    
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data._id).toBeDefined();
    expect(result.data.name).toBe(newItem.name);
    
    // Verify the item was added to the list
    const allItems = await mockApiService.getAllItems();
    const foundItem = allItems.data.find(item => item.name === newItem.name);
    expect(foundItem).toBeDefined();
  });
  
  test('should update an item', async () => {
    // First get all items
    const allItems = await mockApiService.getAllItems();
    const itemToUpdate = allItems.data[0];
    
    const updatedData = {
      ...itemToUpdate,
      name: `${itemToUpdate.name} (Updated)`,
      quantity: itemToUpdate.quantity + 10
    };
    
    const result = await mockApiService.updateItem(itemToUpdate._id, updatedData);
    
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data._id).toBe(itemToUpdate._id);
    expect(result.data.name).toBe(updatedData.name);
    expect(result.data.quantity).toBe(updatedData.quantity);
  });
  
  test('should delete an item', async () => {
    // First get all items
    const allItems = await mockApiService.getAllItems();
    const itemToDelete = allItems.data[0];
    const initialCount = allItems.data.length;
    
    await mockApiService.deleteItem(itemToDelete._id);
    
    // Verify the item was removed
    const updatedItems = await mockApiService.getAllItems();
    expect(updatedItems.data.length).toBe(initialCount - 1);
    
    // Verify the specific item is gone
    const deletedItem = updatedItems.data.find(item => item._id === itemToDelete._id);
    expect(deletedItem).toBeUndefined();
  });
  
  test('should get notifications', async () => {
    const result = await mockApiService.getNotifications();
    
    expect(result).toBeDefined();
    expect(Array.isArray(result.data)).toBeTruthy();
  });
  
  test('should get analytics data', async () => {
    const result = await mockApiService.getAnalyticsData();
    
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data.category).toBeDefined();
  });
});
