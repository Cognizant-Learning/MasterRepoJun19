// Comprehensive test to verify MSW mock integration
import { inventoryApi } from '../api/inventoryApi';
import { API_CONFIG } from '../config/api.config';
import '@testing-library/jest-dom';
// Import necessary Jest testing globals
import { describe, test, expect } from '@jest/globals';

// Check if we're using MSW
const isMswEnabled = API_CONFIG.useMswMock;

describe('MSW Mock API Integration', () => {
  // Only run these tests when MSW is enabled
  (isMswEnabled ? describe : describe.skip)('When using MSW mock API', () => {
    test('should fetch inventory items', async () => {
      const response = await inventoryApi.getAllItems();
      expect(response.success).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });
    
    test('should fetch notifications', async () => {
      const response = await inventoryApi.getAllNotifications();
      expect(response.success).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });
    
    test('should fetch low stock items', async () => {
      const response = await inventoryApi.getLowStockItems();
      expect(response.success).toBe(true);
    });
    
    test('should fetch out of stock items', async () => {
      const response = await inventoryApi.getOutOfStockItems();
      expect(response.success).toBe(true);
    });
    
    test('should fetch expiring items', async () => {
      const response = await inventoryApi.getExpiringItems();
      expect(response.success).toBe(true);
    });
    
    test('should fetch price change notifications', async () => {
      const response = await inventoryApi.getPriceChangeItems();
      expect(response.success).toBe(true);
    });
    
    test('should create inventory item', async () => {
      const newItem = {
        name: 'Test Medication',
        description: 'Test description',
        sku: 'TEST123',
        category: 'Test Category',
        subcategory: 'Test Subcategory',
        price: 10.0,
        cost: 5.0,
        quantity: 20,
        reorderLevel: 5,
        autoFillEnabled: true,
        autoFillQuantity: 10,
        storageType: 'Room Temperature',
        isControlledSubstance: false
      };
      
      const response = await inventoryApi.createItem(newItem);
      expect(response.success).toBe(true);
      expect(response.data._id).toBeDefined();
    });
    
    test('should update inventory item', async () => {
      // First get an item
      const getAllResponse = await inventoryApi.getAllItems();
      const firstItem = getAllResponse.data[0];
      
      // Update the item
      const updatedItem = {
        ...firstItem,
        quantity: firstItem.quantity + 10
      };
      
      const updateResponse = await inventoryApi.updateItem(firstItem._id!, updatedItem);
      expect(updateResponse.success).toBe(true);
      expect(updateResponse.data.quantity).toBe(firstItem.quantity + 10);
    });
    
    test('should trigger auto-fill for eligible items', async () => {
      const response = await inventoryApi.triggerAutoFill();
      expect(response.success).toBe(true);
      // At least one of our mock items should be eligible for auto-fill
      expect(Array.isArray(response.data)).toBe(true);
    });
  });
});
