import InventoryItem, { IInventoryItem } from '../models/inventoryItem';

export interface AutoFillResult {
  itemId: string;
  itemName: string;
  previousQuantity: number;
  newQuantity: number;
  autoFillQuantity: number;
  successful: boolean;
  message: string;
}

/**
 * Auto-fill service manages the automatic replenishment of inventory items
 */
class AutoFillService {
  /**
   * Checks and auto-fills items that are out of stock
   * @returns Promise with results of auto-fill operations
   */
  public async checkAndAutoFillItems(): Promise<AutoFillResult[]> {
    try {
      // Find items that are out of stock and have auto-fill enabled
      const outOfStockItems = await InventoryItem.find({
        quantity: 0,
        autoFillEnabled: true
      });
      
      const results: AutoFillResult[] = [];
      
      // Process each item for auto-fill
      for (const item of outOfStockItems) {
        try {
          const result = await this.autoFillItem(item._id);
          results.push(result);
        } catch (error) {
          console.error(`Error auto-filling item ${item._id}:`, error);
          results.push({
            itemId: item._id.toString(),
            itemName: item.name,
            previousQuantity: item.quantity,
            newQuantity: item.quantity,
            autoFillQuantity: item.autoFillQuantity,
            successful: false,
            message: `Failed to auto-fill: ${error instanceof Error ? error.message : 'Unknown error'}`
          });
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error in checkAndAutoFillItems:', error);
      throw error;
    }
  }
  
  /**
   * Auto-fills a specific inventory item
   * @param itemId The ID of the item to auto-fill
   * @returns Promise with the result of the auto-fill operation
   */
  public async autoFillItem(itemId: string): Promise<AutoFillResult> {
    try {
      // Find the item to auto-fill
      const item = await InventoryItem.findById(itemId);
      
      if (!item) {
        throw new Error(`Item not found with ID: ${itemId}`);
      }
      
      if (!item.autoFillEnabled) {
        throw new Error(`Auto-fill is not enabled for item: ${item.name}`);
      }
      
      const previousQuantity = item.quantity;
      
      // Update the item quantity with the auto-fill quantity
      item.quantity += item.autoFillQuantity;
      
      // Save the updated item
      await item.save();
      
      return {
        itemId: item._id.toString(),
        itemName: item.name,
        previousQuantity,
        newQuantity: item.quantity,
        autoFillQuantity: item.autoFillQuantity,
        successful: true,
        message: `Successfully auto-filled ${item.autoFillQuantity} units of ${item.name}`
      };
    } catch (error) {
      console.error(`Error in autoFillItem for ${itemId}:`, error);
      throw error;
    }
  }
  
  /**
   * Toggle auto-fill setting for an item
   * @param itemId The ID of the item
   * @param enabled Whether auto-fill should be enabled
   * @param quantity Optional quantity to set for auto-fill
   * @returns Promise with the updated item
   */
  public async setAutoFillSetting(
    itemId: string,
    enabled: boolean,
    quantity?: number
  ): Promise<IInventoryItem> {
    try {
      const item = await InventoryItem.findById(itemId);
      
      if (!item) {
        throw new Error(`Item not found with ID: ${itemId}`);
      }
      
      item.autoFillEnabled = enabled;
      
      if (quantity !== undefined) {
        item.autoFillQuantity = quantity;
      }
      
      await item.save();
      return item;
    } catch (error) {
      console.error(`Error in setAutoFillSetting for ${itemId}:`, error);
      throw error;
    }
  }
}

export const autoFillService = new AutoFillService();
export default autoFillService;
