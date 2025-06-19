import InventoryItem, { NotificationType, IInventoryItem } from '../models/inventoryItem';

export interface NotificationItem {
  _id: string;
  name: string;
  sku: string;
  category: string;
  notificationType: NotificationType;
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

/**
 * Service to handle different types of inventory notifications
 */
class NotificationService {
  /**
   * Get all notifications across different types
   * @returns Promise with all notification items
   */
  public async getAllNotifications(): Promise<NotificationItem[]> {
    try {
      const [lowStockItems, outOfStockItems, expiringItems, priceChangeItems] = await Promise.all([
        this.getLowStockItems(),
        this.getOutOfStockItems(),
        this.getExpiringItems(),
        this.getPriceChangeItems()
      ]);
      
      return [...lowStockItems, ...outOfStockItems, ...expiringItems, ...priceChangeItems];
    } catch (error) {
      console.error('Error getting all notifications:', error);
      throw error;
    }
  }
  
  /**
   * Get items with low stock (quantity <= reorderLevel but > 0)
   * @returns Promise with low stock notification items
   */
  public async getLowStockItems(): Promise<NotificationItem[]> {
    try {
      const items = await InventoryItem.find({
        $expr: {
          $and: [
            { $lte: ["$quantity", "$reorderLevel"] },
            { $gt: ["$quantity", 0] }
          ]
        },
        notificationPreferences: NotificationType.LOW_STOCK
      });      return items.map((item: any) => ({
        _id: item._id.toString(),
        name: item.name,
        sku: item.sku,
        category: item.category,
        notificationType: NotificationType.LOW_STOCK,
        detail: {
          currentValue: item.quantity,
          thresholdValue: item.reorderLevel,
          message: `Low stock: ${item.quantity} items remaining (below reorder level of ${item.reorderLevel})`,
          severity: 'warning'
        },
        createdAt: new Date()
      }));
    } catch (error) {
      console.error('Error getting low stock items:', error);
      throw error;
    }
  }
  
  /**
   * Get items that are out of stock (quantity = 0)
   * @returns Promise with out of stock notification items
   */
  public async getOutOfStockItems(): Promise<NotificationItem[]> {
    try {
      const items = await InventoryItem.find({
        quantity: 0,
        notificationPreferences: NotificationType.OUT_OF_STOCK
      });
      
      return items.map(item => ({
        _id: item._id.toString(),
        name: item.name,
        sku: item.sku,
        category: item.category,
        notificationType: NotificationType.OUT_OF_STOCK,
        detail: {
          currentValue: 0,
          message: `Out of stock: ${item.name} needs immediate attention`,
          severity: 'danger'
        },
        createdAt: new Date()
      }));
    } catch (error) {
      console.error('Error getting out of stock items:', error);
      throw error;
    }
  }
  
  /**
   * Get items that are expiring within different time periods
   * @returns Promise with expiring items notification items
   */
  public async getExpiringItems(): Promise<NotificationItem[]> {
    try {
      const now = new Date();
      
      // Calculate dates for 30, 60, and 90 days from now
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);
      
      const sixtyDaysFromNow = new Date();
      sixtyDaysFromNow.setDate(now.getDate() + 60);
      
      const ninetyDaysFromNow = new Date();
      ninetyDaysFromNow.setDate(now.getDate() + 90);
      
      // Get items expiring within 30 days
      const expiring30Days = await InventoryItem.find({
        expiryDate: { 
          $exists: true, 
          $ne: null,
          $lte: thirtyDaysFromNow,
          $gt: now
        },
        notificationPreferences: NotificationType.EXPIRY_30_DAYS
      }).sort({ expiryDate: 1 });
      
      // Get items expiring within 60 days
      const expiring60Days = await InventoryItem.find({
        expiryDate: { 
          $exists: true, 
          $ne: null,
          $lte: sixtyDaysFromNow,
          $gt: thirtyDaysFromNow
        },
        notificationPreferences: NotificationType.EXPIRY_60_DAYS
      }).sort({ expiryDate: 1 });
      
      // Get items expiring within 90 days
      const expiring90Days = await InventoryItem.find({
        expiryDate: { 
          $exists: true, 
          $ne: null,
          $lte: ninetyDaysFromNow,
          $gt: sixtyDaysFromNow
        },
        notificationPreferences: NotificationType.EXPIRY_90_DAYS
      }).sort({ expiryDate: 1 });
        // Create notification items for items expiring within 30 days
      const expiring30DaysNotifications = expiring30Days.map((item: any) => {
        const daysToExpiry = Math.ceil((item.expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        return {
          _id: item._id.toString(),
          name: item.name,
          sku: item.sku,
          category: item.category,
          notificationType: NotificationType.EXPIRY_30_DAYS,
          detail: {
            currentValue: item.expiryDate,
            message: `Expiring soon: ${item.name} expires in ${daysToExpiry} day${daysToExpiry !== 1 ? 's' : ''}`,
            severity: 'danger',
            daysToExpiry
          },
          createdAt: new Date()
        };
      });
        // Create notification items for items expiring within 60 days
      const expiring60DaysNotifications = expiring60Days.map((item: any) => {
        const daysToExpiry = Math.ceil((item.expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        return {
          _id: item._id.toString(),
          name: item.name,
          sku: item.sku,
          category: item.category,
          notificationType: NotificationType.EXPIRY_60_DAYS,
          detail: {
            currentValue: item.expiryDate,
            message: `Expiring soon: ${item.name} expires in ${daysToExpiry} day${daysToExpiry !== 1 ? 's' : ''}`,
            severity: 'warning',
            daysToExpiry
          },
          createdAt: new Date()
        };
      });
        // Create notification items for items expiring within 90 days
      const expiring90DaysNotifications = expiring90Days.map((item: any) => {
        const daysToExpiry = Math.ceil((item.expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        return {
          _id: item._id.toString(),
          name: item.name,
          sku: item.sku,
          category: item.category,
          notificationType: NotificationType.EXPIRY_90_DAYS,
          detail: {
            currentValue: item.expiryDate,
            message: `Expiring: ${item.name} expires in ${daysToExpiry} day${daysToExpiry !== 1 ? 's' : ''}`,
            severity: 'info',
            daysToExpiry
          },
          createdAt: new Date()
        };
      });
      
      return [...expiring30DaysNotifications, ...expiring60DaysNotifications, ...expiring90DaysNotifications];
    } catch (error) {
      console.error('Error getting expiring items:', error);
      throw error;
    }
  }
  
  /**
   * Get items with recent price changes
   * @returns Promise with price change notification items
   */
  public async getPriceChangeItems(): Promise<NotificationItem[]> {
    try {
      // Get all items with price history
      const items = await InventoryItem.find({
        priceHistory: { $exists: true, $ne: [] },
        notificationPreferences: NotificationType.PRICE_CHANGE
      });
      
      const priceChangeItems: NotificationItem[] = [];
        // Check each item for significant price changes
      items.forEach((item: any) => {
        if (item.priceHistory && item.priceHistory.length > 1) {
          // Sort price history by date descending
          const sortedHistory = [...item.priceHistory].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          
          // Check if the most recent price change is within the last 7 days
          const latestChange = sortedHistory[0];
          const previousPrice = sortedHistory[1].price;
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
          if (new Date(latestChange.date) >= sevenDaysAgo) {
            // Calculate price change percentage
            const currentPrice = latestChange.price;
            const priceChange = currentPrice - previousPrice;
            const priceChangePercent = (priceChange / previousPrice) * 100;
            
            // Only include significant price changes (more than 5%)
            if (Math.abs(priceChangePercent) >= 5) {
              priceChangeItems.push({
                _id: item._id.toString(),
                name: item.name,
                sku: item.sku,
                category: item.category,
                notificationType: NotificationType.PRICE_CHANGE,
                detail: {
                  currentValue: currentPrice,
                  previousPrice,
                  priceChange,
                  priceChangePercent,
                  message: `Price ${priceChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(priceChangePercent).toFixed(2)}%`,
                  severity: priceChange > 0 ? 'warning' : 'info'
                },
                createdAt: new Date(latestChange.date)
              });
            }
          }
        }
      });
      
      return priceChangeItems;
    } catch (error) {
      console.error('Error getting price change items:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
