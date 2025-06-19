import mockData from './mockData.json';

/**
 * Standalone Mock API Service for Pharmacy Dashboard
 * 
 * This service provides mock API functionality without relying on MSW or a separate mock server.
 * It simulates API responses using static JSON data.
 */
class MockApiService {
  mockData;
  delays = {
    short: 300,   // 300ms - quick operations
    medium: 600,  // 600ms - standard operations 
    long: 1000    // 1000ms - complex operations
  };
  
  constructor(data) {
    // Deep clone the mock data to avoid reference issues
    this.mockData = JSON.parse(JSON.stringify(data));
    
    // Convert string dates to Date objects
    this.convertDates();
    console.info('Mock API Service initialized with standalone data');
  }
  
  /**
   * Helper to convert string date representations to Date objects
   */
  convertDates() {
    // Process inventory dates
    this.mockData.inventory.forEach(item => {
      if (item.expiryDate) item.expiryDate = new Date(item.expiryDate);
      if (item.createdAt) item.createdAt = new Date(item.createdAt);
      if (item.updatedAt) item.updatedAt = new Date(item.updatedAt);
      
      // Process price history dates
      if (item.priceHistory) {
        item.priceHistory.forEach(history => {
          if (history.date) history.date = new Date(history.date);
        });
      }
    });
    
    // Process notification dates
    this.mockData.notifications.all.forEach(notification => {
      if (notification.createdAt) notification.createdAt = new Date(notification.createdAt);
      if (notification.detail.currentValue && notification.notificationType.includes('Expiry')) {
        notification.detail.currentValue = new Date(notification.detail.currentValue);
      }
    });
  }
  
  /**
   * Helper to simulate API delay
   * @param {string} type - Type of delay (short, medium, long)
   * @returns {Promise} Promise that resolves after the delay
   */
  delay(type = 'medium') {
    return new Promise(resolve => setTimeout(resolve, this.delays[type]));
  }
  
  /**
   * Helper to create a standard API response
   * @param {boolean} success - Whether the operation was successful
   * @param {any} data - Response data
   * @param {string} error - Error message if any
   * @param {number} count - Count of items if applicable
   * @returns {Object} Standardized API response
   */
  createResponse(success, data, error = null, count = null) {
    const response = { success };
    
    if (success) {
      response.data = data;
      if (count !== null || Array.isArray(data)) {
        response.count = count !== null ? count : (Array.isArray(data) ? data.length : 0);
      }
    } else {
      response.error = error || 'Unknown error';
    }
    
    return response;
  }
  
  /**
   * Get all inventory items
   * @returns {Promise} Promise that resolves with all inventory items
   */
  async getAllItems() {
    await this.delay('medium');
    return this.createResponse(true, this.mockData.inventory);
  }
  
  /**
   * Get a single inventory item by ID
   * @param {string} id - Item ID
   * @returns {Promise} Promise that resolves with the item data
   */
  async getItem(id) {
    await this.delay('short');
    const item = this.mockData.inventory.find(item => item._id === id);
    
    if (!item) {
      return this.createResponse(false, null, 'Item not found');
    }
    
    return this.createResponse(true, item);
  }
  
  /**
   * Create a new inventory item
   * @param {Object} item - Item data
   * @returns {Promise} Promise that resolves with the created item
   */
  async createItem(item) {
    await this.delay('long');
    
    // Generate ID and dates
    const newItem = {
      ...item,
      _id: (this.mockData.inventory.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.mockData.inventory.push(newItem);
    
    // Check if this item should generate notifications
    this.checkAndCreateNotifications(newItem);
    
    return this.createResponse(true, newItem);
  }
  
  /**
   * Update an inventory item
   * @param {string} id - Item ID
   * @param {Object} updatedData - Updated item data
   * @returns {Promise} Promise that resolves with the updated item
   */
  async updateItem(id, updatedData) {
    await this.delay('medium');
    
    const index = this.mockData.inventory.findIndex(item => item._id === id);
    
    if (index === -1) {
      return this.createResponse(false, null, 'Item not found');
    }
    
    const oldItem = this.mockData.inventory[index];
    
    // Check for price changes to update price history
    if (updatedData.price !== undefined && updatedData.price !== oldItem.price) {
      if (!updatedData.priceHistory) {
        updatedData.priceHistory = oldItem.priceHistory || [];
      }
      
      updatedData.priceHistory.push({
        price: updatedData.price,
        date: new Date()
      });
      
      // Create price change notification
      this.createPriceChangeNotification(oldItem, updatedData.price);
    }
    
    // Update the item
    const updatedItem = {
      ...oldItem,
      ...updatedData,
      updatedAt: new Date()
    };
    
    this.mockData.inventory[index] = updatedItem;
    
    // Check if this update should generate or remove notifications
    this.checkAndUpdateNotifications(oldItem, updatedItem);
    
    return this.createResponse(true, updatedItem);
  }
  
  /**
   * Delete an inventory item
   * @param {string} id - Item ID
   * @returns {Promise} Promise that resolves with success status
   */
  async deleteItem(id) {
    await this.delay('medium');
    
    const index = this.mockData.inventory.findIndex(item => item._id === id);
    
    if (index === -1) {
      return this.createResponse(false, null, 'Item not found');
    }
    
    // Remove the item
    this.mockData.inventory.splice(index, 1);
    
    // Remove any notifications for this item
    this.mockData.notifications.all = this.mockData.notifications.all.filter(
      notification => notification._id !== id
    );
    
    return this.createResponse(true, {});
  }
  
  /**
   * Get inventory analytics by category
   * @returns {Promise} Promise that resolves with category analytics
   */
  async getAnalyticsByCategory() {
    await this.delay('long');
    return this.createResponse(true, this.mockData.analytics.category);
  }
  
  /**
   * Get inventory analytics by subcategory
   * @returns {Promise} Promise that resolves with subcategory analytics
   */
  async getAnalyticsBySubcategory() {
    await this.delay('long');
    // In this mock, we're using the same data for category and subcategory
    return this.createResponse(true, this.mockData.analytics.category);
  }
  
  /**
   * Get list of categories
   * @returns {Promise} Promise that resolves with categories
   */
  async getCategories() {
    await this.delay('short');
    return this.createResponse(true, this.mockData.categoryStructure.categories);
  }
  
  /**
   * Get complete category structure
   * @returns {Promise} Promise that resolves with category structure
   */
  async getCategoryStructure() {
    await this.delay('medium');
    return this.createResponse(true, this.mockData.categoryStructure);
  }
  
  /**
   * Get all notifications
   * @returns {Promise} Promise that resolves with all notifications
   */
  async getAllNotifications() {
    await this.delay('medium');
    return this.createResponse(true, this.mockData.notifications.all);
  }
  
  /**
   * Get low stock notifications
   * @returns {Promise} Promise that resolves with low stock notifications
   */
  async getLowStockItems() {
    await this.delay('short');
    const lowStockItems = this.mockData.notifications.all.filter(
      notification => notification.notificationType === 'Low Stock'
    );
    return this.createResponse(true, lowStockItems);
  }
  
  /**
   * Get out of stock notifications
   * @returns {Promise} Promise that resolves with out of stock notifications
   */
  async getOutOfStockItems() {
    await this.delay('short');
    const outOfStockItems = this.mockData.notifications.all.filter(
      notification => notification.notificationType === 'Out of Stock'
    );
    return this.createResponse(true, outOfStockItems);
  }
  
  /**
   * Get expiring items notifications
   * @returns {Promise} Promise that resolves with expiring items notifications
   */
  async getExpiringItems() {
    await this.delay('short');
    const expiringItems = this.mockData.notifications.all.filter(
      notification => notification.notificationType.includes('Expiry')
    );
    return this.createResponse(true, expiringItems);
  }
  
  /**
   * Get price change notifications
   * @returns {Promise} Promise that resolves with price change notifications
   */
  async getPriceChangeItems() {
    await this.delay('short');
    const priceChangeItems = this.mockData.notifications.all.filter(
      notification => notification.notificationType === 'Price Change'
    );
    return this.createResponse(true, priceChangeItems);
  }
  
  /**
   * Trigger auto-fill for all eligible items
   * @returns {Promise} Promise that resolves with auto-fill results
   */
  async triggerAutoFill() {
    await this.delay('long');
    
    const eligibleItems = this.mockData.inventory.filter(
      item => item.quantity === 0 && item.autoFillEnabled && item.autoFillQuantity > 0
    );
    
    const results = [];
    
    for (const item of eligibleItems) {
      // Auto-fill the item
      const index = this.mockData.inventory.findIndex(i => i._id === item._id);
      
      if (index !== -1) {
        const result = {
          itemId: item._id,
          itemName: item.name,
          previousQuantity: 0,
          newQuantity: item.autoFillQuantity,
          autoFillQuantity: item.autoFillQuantity,
          successful: true,
          message: `Successfully auto-filled ${item.autoFillQuantity} units of ${item.name}`
        };
        
        // Update inventory quantity
        this.mockData.inventory[index].quantity = item.autoFillQuantity;
        
        // Remove out of stock notification
        this.mockData.notifications.all = this.mockData.notifications.all.filter(
          notification => !(notification._id === item._id && notification.notificationType === 'Out of Stock')
        );
        
        // Check if this should create a low stock notification
        if (item.autoFillQuantity < item.reorderLevel) {
          this.createLowStockNotification(this.mockData.inventory[index]);
        }
        
        results.push(result);
      }
    }
    
    return this.createResponse(true, results);
  }
  
  /**
   * Auto-fill a specific item
   * @param {string} id - Item ID
   * @returns {Promise} Promise that resolves with auto-fill result for the item
   */
  async autoFillItem(id) {
    await this.delay('medium');
    
    const index = this.mockData.inventory.findIndex(item => item._id === id);
    
    if (index === -1) {
      return this.createResponse(false, null, 'Item not found');
    }
    
    const item = this.mockData.inventory[index];
    
    if (!item.autoFillEnabled) {
      return this.createResponse(false, null, 'Auto-fill is not enabled for this item');
    }
    
    if (!item.autoFillQuantity || item.autoFillQuantity <= 0) {
      return this.createResponse(false, null, 'Auto-fill quantity is not set or is invalid');
    }
    
    const previousQuantity = item.quantity;
    
    // Update the quantity
    this.mockData.inventory[index].quantity = item.autoFillQuantity;
    
    // Remove out of stock notification if applicable
    if (previousQuantity === 0) {
      this.mockData.notifications.all = this.mockData.notifications.all.filter(
        notification => !(notification._id === id && notification.notificationType === 'Out of Stock')
      );
    }
    
    // Add low stock notification if applicable
    if (item.autoFillQuantity < item.reorderLevel) {
      this.createLowStockNotification(this.mockData.inventory[index]);
    }
    
    const result = {
      itemId: item._id,
      itemName: item.name,
      previousQuantity: previousQuantity,
      newQuantity: item.autoFillQuantity,
      autoFillQuantity: item.autoFillQuantity,
      successful: true,
      message: `Successfully auto-filled ${item.autoFillQuantity} units of ${item.name}`
    };
    
    return this.createResponse(true, result);
  }
  
  /**
   * Update auto-fill settings for an item
   * @param {string} id - Item ID
   * @param {boolean} enabled - Whether auto-fill is enabled
   * @param {number} quantity - Auto-fill quantity
   * @returns {Promise} Promise that resolves with the updated item
   */
  async updateAutoFillSettings(id, enabled, quantity) {
    await this.delay('short');
    
    const index = this.mockData.inventory.findIndex(item => item._id === id);
    
    if (index === -1) {
      return this.createResponse(false, null, 'Item not found');
    }
    
    // Update auto-fill settings
    const updatedItem = {
      ...this.mockData.inventory[index],
      autoFillEnabled: enabled,
      autoFillQuantity: quantity !== undefined ? quantity : this.mockData.inventory[index].autoFillQuantity,
      updatedAt: new Date()
    };
    
    this.mockData.inventory[index] = updatedItem;
    
    return this.createResponse(true, updatedItem);
  }
  
  /**
   * Helper to check and create notifications for an item
   * @param {Object} item - Item to check
   */
  checkAndCreateNotifications(item) {
    // Check for low stock
    if (item.quantity > 0 && item.quantity < item.reorderLevel) {
      this.createLowStockNotification(item);
    }
    
    // Check for out of stock
    if (item.quantity === 0) {
      this.createOutOfStockNotification(item);
    }
    
    // Check for expiry
    if (item.expiryDate) {
      const today = new Date();
      const expiryDate = new Date(item.expiryDate);
      const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysToExpiry <= 30) {
        this.createExpiryNotification(item, daysToExpiry);
      }
    }
  }
  
  /**
   * Helper to check and update notifications after an item update
   * @param {Object} oldItem - Previous item state
   * @param {Object} newItem - New item state
   */
  checkAndUpdateNotifications(oldItem, newItem) {
    // Check for new low stock condition
    if (
      newItem.quantity > 0 && 
      newItem.quantity < newItem.reorderLevel && 
      (oldItem.quantity >= oldItem.reorderLevel || oldItem.quantity === 0)
    ) {
      this.createLowStockNotification(newItem);
    }
    
    // Check for resolved low stock condition
    if (
      (newItem.quantity >= newItem.reorderLevel || newItem.quantity === 0) && 
      oldItem.quantity > 0 && 
      oldItem.quantity < oldItem.reorderLevel
    ) {
      this.removeLowStockNotification(newItem._id);
    }
    
    // Check for new out of stock condition
    if (newItem.quantity === 0 && oldItem.quantity > 0) {
      this.createOutOfStockNotification(newItem);
      this.removeLowStockNotification(newItem._id);
    }
    
    // Check for resolved out of stock condition
    if (newItem.quantity > 0 && oldItem.quantity === 0) {
      this.removeOutOfStockNotification(newItem._id);
      
      // Check if it's now in low stock state
      if (newItem.quantity < newItem.reorderLevel) {
        this.createLowStockNotification(newItem);
      }
    }
    
    // Check for expiry date changes
    if (newItem.expiryDate && (!oldItem.expiryDate || newItem.expiryDate !== oldItem.expiryDate)) {
      const today = new Date();
      const expiryDate = new Date(newItem.expiryDate);
      const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysToExpiry <= 30) {
        this.createExpiryNotification(newItem, daysToExpiry);
      }
    }
  }
  
  /**
   * Create a low stock notification
   * @param {Object} item - Item with low stock
   */
  createLowStockNotification(item) {
    // Remove existing low stock notification if any
    this.mockData.notifications.all = this.mockData.notifications.all.filter(
      notification => !(notification._id === item._id && notification.notificationType === 'Low Stock')
    );
    
    // Add new notification
    this.mockData.notifications.all.push({
      _id: item._id,
      name: item.name,
      sku: item.sku,
      category: item.category,
      notificationType: 'Low Stock',
      detail: {
        currentValue: item.quantity,
        thresholdValue: item.reorderLevel,
        message: `Low stock: ${item.quantity} items remaining (below reorder level of ${item.reorderLevel})`,
        severity: 'warning'
      },
      createdAt: new Date()
    });
  }
  
  /**
   * Remove a low stock notification
   * @param {string} id - Item ID
   */
  removeLowStockNotification(id) {
    this.mockData.notifications.all = this.mockData.notifications.all.filter(
      notification => !(notification._id === id && notification.notificationType === 'Low Stock')
    );
  }
  
  /**
   * Create an out of stock notification
   * @param {Object} item - Item that is out of stock
   */
  createOutOfStockNotification(item) {
    // Remove existing out of stock notification if any
    this.mockData.notifications.all = this.mockData.notifications.all.filter(
      notification => !(notification._id === item._id && notification.notificationType === 'Out of Stock')
    );
    
    // Add new notification
    this.mockData.notifications.all.push({
      _id: item._id,
      name: item.name,
      sku: item.sku,
      category: item.category,
      notificationType: 'Out of Stock',
      detail: {
        currentValue: 0,
        message: `Out of stock: ${item.name} needs immediate attention`,
        severity: 'danger'
      },
      createdAt: new Date()
    });
  }
  
  /**
   * Remove an out of stock notification
   * @param {string} id - Item ID
   */
  removeOutOfStockNotification(id) {
    this.mockData.notifications.all = this.mockData.notifications.all.filter(
      notification => !(notification._id === id && notification.notificationType === 'Out of Stock')
    );
  }
  
  /**
   * Create an expiry notification
   * @param {Object} item - Item that is expiring
   * @param {number} daysToExpiry - Days until expiry
   */
  createExpiryNotification(item, daysToExpiry) {
    // Remove existing expiry notifications for this item
    this.mockData.notifications.all = this.mockData.notifications.all.filter(
      notification => !(notification._id === item._id && notification.notificationType.includes('Expiry'))
    );
    
    let notificationType = 'Expiry Warning';
    let severity = 'info';
    
    if (daysToExpiry <= 30) {
      if (daysToExpiry <= 3) {
        notificationType = `Expiry Warning (${daysToExpiry} Days)`;
        severity = 'danger';
      } else if (daysToExpiry <= 10) {
        notificationType = `Expiry Warning (${daysToExpiry} Days)`;
        severity = 'warning';
      } else {
        notificationType = `Expiry Warning (${daysToExpiry} Days)`;
        severity = 'info';
      }
      
      // Add new notification
      this.mockData.notifications.all.push({
        _id: item._id,
        name: item.name,
        sku: item.sku,
        category: item.category,
        notificationType: notificationType,
        detail: {
          currentValue: item.expiryDate,
          message: daysToExpiry <= 3
            ? `Critical expiry: ${item.name} expires in ${daysToExpiry} days`
            : `Expiring soon: ${daysToExpiry} days remaining before expiry`,
          severity: severity,
          daysToExpiry: daysToExpiry
        },
        createdAt: new Date()
      });
    }
  }
  
  /**
   * Create a price change notification
   * @param {Object} item - Item with price change
   * @param {number} newPrice - New price
   */
  createPriceChangeNotification(item, newPrice) {
    const oldPrice = item.price;
    const priceDiff = newPrice - oldPrice;
    const percentChange = (priceDiff / oldPrice) * 100;
    
    // Only notify for significant changes (e.g., >5%)
    if (Math.abs(percentChange) >= 5) {
      // Remove existing price change notification if any
      this.mockData.notifications.all = this.mockData.notifications.all.filter(
        notification => !(notification._id === item._id && notification.notificationType === 'Price Change')
      );
      
      const message = priceDiff > 0
        ? `Price increased by ${percentChange.toFixed(2)}% (from $${oldPrice.toFixed(2)} to $${newPrice.toFixed(2)})`
        : `Price decreased by ${Math.abs(percentChange).toFixed(2)}% (from $${oldPrice.toFixed(2)} to $${newPrice.toFixed(2)})`;
      
      // Add new notification
      this.mockData.notifications.all.push({
        _id: item._id,
        name: item.name,
        sku: item.sku,
        category: item.category,
        notificationType: 'Price Change',
        detail: {
          currentValue: newPrice,
          previousPrice: oldPrice,
          priceChange: priceDiff,
          priceChangePercent: percentChange,
          message: message,
          severity: 'info'
        },
        createdAt: new Date()
      });
    }
  }
}

// Create and export the mock API service instance
const mockApiService = new MockApiService(mockData);

export default mockApiService;
