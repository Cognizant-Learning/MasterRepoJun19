import { Request, Response } from 'express';
import InventoryItem, { IInventoryItem, Category, StorageType } from '../models/inventoryItem';

// Get all inventory items
export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await InventoryItem.find();
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single inventory item
export const getItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    
    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create a new inventory item
export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await InventoryItem.create(req.body);
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error: any) {
    if (error.code === 11000) { // Duplicate key error
      res.status(400).json({
        success: false,
        error: 'Item with this SKU already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

// Update an inventory item
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete an inventory item
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await InventoryItem.findByIdAndDelete(req.params.id);
    
    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get analytics data by category
export const getAnalyticsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get basic category analytics
    const categoryData = await InventoryItem.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
          avgPrice: { $avg: "$price" },
          totalCost: { $sum: { $multiply: ["$cost", "$quantity"] } },
          totalQuantity: { $sum: "$quantity" },
          lowStockItems: { 
            $sum: { 
              $cond: [{ $lte: ["$quantity", "$reorderLevel"] }, 1, 0] 
            } 
          },
          outOfStockItems: { 
            $sum: { 
              $cond: [{ $eq: ["$quantity", 0] }, 1, 0] 
            } 
          }
        }
      },
      { 
        $addFields: {
          // Calculate profit margin
          profitMargin: { 
            $multiply: [
              { $divide: [{ $subtract: ["$totalValue", "$totalCost"] }, "$totalValue"] },
              100
            ] 
          }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);
      // Enhance with mock data for the hackathon demo
    const enhancedCategoryData = categoryData.map((category: any) => {
      return {
        ...category,
        // Mock inventory turnover rate (higher is better)
        turnoverRate: Math.random() * 10 + 1,
        // Mock stockout frequency percentage
        stockoutFrequency: (category.outOfStockItems / Math.max(category.count, 1)) * 100,
        // Mock expiry rate percentage
        expiryRate: Math.random() * 15,
        // Mock seasonal demand patterns over 12 months
        seasonalDemand: Array.from({ length: 12 }, () => Math.random() * 100 + 50)
      };
    });
    
    res.status(200).json({
      success: true,
      count: enhancedCategoryData.length,
      data: enhancedCategoryData
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get low stock items (for notifications)
export const getLowStockItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const notificationService = (await import('../services/notificationService')).default;
    const lowStockItems = await notificationService.getLowStockItems();
    
    res.status(200).json({
      success: true,
      count: lowStockItems.length,
      data: lowStockItems
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get out of stock items (for notifications)
export const getOutOfStockItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const notificationService = (await import('../services/notificationService')).default;
    const outOfStockItems = await notificationService.getOutOfStockItems();
    
    res.status(200).json({
      success: true,
      count: outOfStockItems.length,
      data: outOfStockItems
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get expiring items (for notifications)
export const getExpiringItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const notificationService = (await import('../services/notificationService')).default;
    const expiringItems = await notificationService.getExpiringItems();
    
    res.status(200).json({
      success: true,
      count: expiringItems.length,
      data: expiringItems
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get price change notifications
export const getPriceChangeItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const notificationService = (await import('../services/notificationService')).default;
    const priceChangeItems = await notificationService.getPriceChangeItems();
    
    res.status(200).json({
      success: true,
      count: priceChangeItems.length,
      data: priceChangeItems
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all notifications combined
export const getAllNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const notificationService = (await import('../services/notificationService')).default;
    const notifications = await notificationService.getAllNotifications();
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get categories list
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      data: Object.values(Category)
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Execute auto-fill for out of stock items
export const triggerAutoFill = async (req: Request, res: Response): Promise<void> => {
  try {
    const autoFillService = (await import('../services/autoFillService')).default;
    const results = await autoFillService.checkAndAutoFillItems();
    
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Auto-fill a specific item
export const autoFillItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const autoFillService = (await import('../services/autoFillService')).default;
    const result = await autoFillService.autoFillItem(id);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update auto-fill settings for an item
export const updateAutoFillSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { enabled, quantity } = req.body;
    const autoFillService = (await import('../services/autoFillService')).default;
    
    const updatedItem = await autoFillService.setAutoFillSetting(id, enabled, quantity);
    
    res.status(200).json({
      success: true,
      data: updatedItem
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get analytics by category group and subcategory
export const getAnalyticsBySubcategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await InventoryItem.find();
    
    // Group items by subcategory
    const subcategoryGroups: Record<string, IInventoryItem[]> = {};
    items.forEach((item: IInventoryItem) => {
      const subcategory = item.subcategory;
      if (!subcategoryGroups[subcategory as string]) {
        subcategoryGroups[subcategory as string] = [];
      }
      subcategoryGroups[subcategory as string].push(item);
    });
    // Calculate analytics for each subcategory
    const subcategoryAnalytics = Object.entries(subcategoryGroups).map(([subcategory, items]) => {
      const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalCost = items.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      const avgPrice = items.reduce((sum, item) => sum + item.price, 0) / items.length;
      const lowStockItems = items.filter(item => item.quantity <= item.reorderLevel).length;
      const outOfStockItems = items.filter(item => item.quantity === 0).length;
      const categoryGroup = items[0].categoryGroup;
      
      // Calculate same metrics that we have in getAnalyticsByCategory
      return {
        _id: subcategory,
        count: items.length,
        totalValue,
        avgPrice,
        totalCost,
        totalQuantity,
        lowStockItems,
        outOfStockItems,
        profitMargin: ((totalValue - totalCost) / totalValue) * 100,
        categoryGroup,
        // Add mock data similar to category analytics
        turnoverRate: Math.random() * 10 + 1,
        stockoutFrequency: (outOfStockItems / Math.max(items.length, 1)) * 100,
        expiryRate: Math.random() * 15,
        seasonalDemand: Array.from({ length: 12 }, () => Math.random() * 100 + 50)
      };
    });
    
    res.status(200).json({
      success: true,
      count: subcategoryAnalytics.length,
      data: subcategoryAnalytics
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get category structure including groups, subcategories and categories
export const getCategoryStructure = async (req: Request, res: Response): Promise<void> => {
  try {
    const { CategoryGroup, Subcategory, Category, CATEGORY_SUBCATEGORY_MAP } = await import('../models/inventoryItem');
    
    // Create a structure with category groups, subcategories and categories
    const structure = {
      categoryGroups: Object.values(CategoryGroup),
      subcategories: Object.values(Subcategory),
      categories: Object.values(Category),
      categoryToSubcategory: CATEGORY_SUBCATEGORY_MAP
    };
    
    res.status(200).json({
      success: true,
      data: structure
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
