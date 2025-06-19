import axios from 'axios';
import { API_CONFIG, ApiMode } from '../config/api.config';
import mockApiService from '../mocks/mockApiService';

// Create an axios instance with configuration from API_CONFIG
const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Check if we're using standalone mode
const isStandaloneMock = API_CONFIG.useStandaloneMock;

if (isStandaloneMock) {
  console.info('Using standalone mock API service - no server or MSW required');
}

// Types
export interface PriceHistoryItem {
  price: number;
  date: Date;
}

export interface NotificationItem {
  _id: string;
  name: string;
  sku: string;
  category: string;
  notificationType: string;
  detail: {
    currentValue: any;
    thresholdValue?: any;
    message: string;
    severity: 'info' | 'warning' | 'danger';
    daysToExpiry?: number;
    previousPrice?: number;
    priceChange?: number;
    priceChangePercent?: number;
  };
  createdAt: Date;
}

export interface AutoFillResult {
  itemId: string;
  itemName: string;
  previousQuantity: number;
  newQuantity: number;
  autoFillQuantity: number;
  successful: boolean;
  message: string;
}

export interface InventoryItem {
  _id?: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  subcategory?: string;
  categoryGroup?: string;
  price: number;
  cost: number;
  quantity: number;
  reorderLevel: number;
  autoFillEnabled?: boolean;
  autoFillQuantity?: number;
  priceHistory?: PriceHistoryItem[];
  notificationPreferences?: string[];
  expiryDate?: Date;
  batchNumber?: string;
  manufacturer?: string;
  storageType: string;
  isControlledSubstance: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  error?: string;
}

// Inventory API functions
export const inventoryApi = {
  // Get all inventory items
  getAllItems: async (): Promise<ApiResponse<InventoryItem[]>> => {
    if (isStandaloneMock) {
      return await mockApiService.getAllItems();
    }
    const response = await api.get('/inventory');
    return response.data;
  },

  // Get a single inventory item
  getItem: async (id: string): Promise<ApiResponse<InventoryItem>> => {
    if (isStandaloneMock) {
      return await mockApiService.getItem(id);
    }
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },
  // Create a new inventory item
  createItem: async (item: InventoryItem): Promise<ApiResponse<InventoryItem>> => {
    if (isStandaloneMock) {
      return await mockApiService.createItem(item);
    }
    const response = await api.post('/inventory', item);
    return response.data;
  },

  // Update an inventory item
  updateItem: async (id: string, item: InventoryItem): Promise<ApiResponse<InventoryItem>> => {
    if (isStandaloneMock) {
      return await mockApiService.updateItem(id, item);
    }
    const response = await api.put(`/inventory/${id}`, item);
    return response.data;
  },

  // Delete an inventory item
  deleteItem: async (id: string): Promise<ApiResponse<{}>> => {
    if (isStandaloneMock) {
      return await mockApiService.deleteItem(id);
    }
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },

  // Get analytics by category
  getAnalyticsByCategory: async (): Promise<ApiResponse<any[]>> => {
    if (isStandaloneMock) {
      return await mockApiService.getAnalyticsByCategory();
    }
    const response = await api.get('/inventory/analytics/category');
    return response.data;
  },
  // Get low stock items
  getLowStockItems: async (): Promise<ApiResponse<NotificationItem[]>> => {
    if (isStandaloneMock) {
      return await mockApiService.getLowStockItems();
    }
    const response = await api.get('/inventory/notifications/low-stock');
    return response.data;
  },

  // Get expiring items
  getExpiringItems: async (): Promise<ApiResponse<NotificationItem[]>> => {
    if (isStandaloneMock) {
      return await mockApiService.getExpiringItems();
    }
    const response = await api.get('/inventory/notifications/expiring');
    return response.data;
  },
  // Get categories list
  getCategories: async (): Promise<ApiResponse<string[]>> => {
    if (isStandaloneMock) {
      return await mockApiService.getCategories();
    }
    const response = await api.get('/inventory/categories/list');
    return response.data;
  },
  
  // Get analytics by subcategory
  getAnalyticsBySubcategory: async (): Promise<ApiResponse<any[]>> => {
    if (isStandaloneMock) {
      return await mockApiService.getAnalyticsBySubcategory();
    }
    const response = await api.get('/inventory/analytics/subcategory');
    return response.data;
  },
    // Get complete category structure
  getCategoryStructure: async (): Promise<ApiResponse<{
    categoryGroups: string[],
    subcategories: string[],
    categories: string[],
    categoryToSubcategory: Record<string, string>
  }>> => {
    if (isStandaloneMock) {
      return await mockApiService.getCategoryStructure();
    }
    const response = await api.get('/inventory/categories/structure');
    return response.data;
  },
  
  // Get out of stock items
  getOutOfStockItems: async (): Promise<ApiResponse<NotificationItem[]>> => {
    if (isStandaloneMock) {
      return await mockApiService.getOutOfStockItems();
    }
    const response = await api.get('/inventory/notifications/out-of-stock');
    return response.data;
  },
    // Get price change notifications
  getPriceChangeItems: async (): Promise<ApiResponse<NotificationItem[]>> => {
    if (isStandaloneMock) {
      return await mockApiService.getPriceChangeItems();
    }
    const response = await api.get('/inventory/notifications/price-changes');
    return response.data;
  },
  
  // Get all notifications
  getAllNotifications: async (): Promise<ApiResponse<NotificationItem[]>> => {
    if (isStandaloneMock) {
      return await mockApiService.getAllNotifications();
    }
    const response = await api.get('/inventory/notifications/all');
    return response.data;
  },
  
  // Trigger auto-fill for all eligible items
  triggerAutoFill: async (): Promise<ApiResponse<AutoFillResult[]>> => {
    if (isStandaloneMock) {
      return await mockApiService.triggerAutoFill();
    }
    const response = await api.post('/inventory/auto-fill/trigger');
    return response.data;
  },
  
  // Auto-fill a specific item
  autoFillItem: async (id: string): Promise<ApiResponse<AutoFillResult>> => {
    if (isStandaloneMock) {
      return await mockApiService.autoFillItem(id);
    }
    const response = await api.post(`/inventory/auto-fill/${id}`);
    return response.data;
  },
  // Update auto-fill settings for an item
  updateAutoFillSettings: async (
    id: string, 
    enabled: boolean, 
    quantity?: number
  ): Promise<ApiResponse<InventoryItem>> => {
    if (isStandaloneMock) {
      return await mockApiService.updateAutoFillSettings(id, enabled, quantity);
    }
    
    // Create payload for API request
    const payload: { enabled: boolean; quantity?: number } = { enabled };
    if (quantity !== undefined) {
      payload.quantity = quantity;
    }
    
    const response = await api.put(`/inventory/auto-fill/${id}`, payload);
    return response.data;
  },
  
  // Get API mode information
  getApiInfo: () => {
    return {
      mode: API_CONFIG.currentMode,
      isStandalone: isStandaloneMock,
      baseUrl: API_CONFIG.baseUrl
    };
  }
};

export default api;
