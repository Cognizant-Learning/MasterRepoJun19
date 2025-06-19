import express from 'express';
import {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getAnalyticsByCategory,
  getAnalyticsBySubcategory,
  getCategoryStructure,
  getLowStockItems,
  getOutOfStockItems,
  getExpiringItems,
  getPriceChangeItems,
  getAllNotifications,
  getCategories,
  triggerAutoFill,
  autoFillItem,
  updateAutoFillSettings
} from '../controllers/inventoryController';

const router = express.Router();

// CRUD Routes
router.get('/', getAllItems);
router.get('/:id', getItem);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

// Analytics Routes
router.get('/analytics/category', getAnalyticsByCategory);
router.get('/analytics/subcategory', getAnalyticsBySubcategory);
router.get('/categories/list', getCategories);
router.get('/categories/structure', getCategoryStructure);

// Notification Routes
router.get('/notifications/all', getAllNotifications);
router.get('/notifications/low-stock', getLowStockItems);
router.get('/notifications/out-of-stock', getOutOfStockItems);
router.get('/notifications/expiring', getExpiringItems);
router.get('/notifications/price-changes', getPriceChangeItems);

// Auto-fill Routes
router.post('/auto-fill/trigger', triggerAutoFill);
router.post('/auto-fill/:id', autoFillItem);
router.put('/auto-fill/:id', updateAutoFillSettings);

export default router;
