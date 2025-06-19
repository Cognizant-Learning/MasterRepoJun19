import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Get all inventory items
router.get('/', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM inventory_items ORDER BY name ASC').all();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
});

// Create a new inventory item
router.post('/', (req, res) => {
  try {
    const { id, name, sku, category, price, quantity } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO inventory_items (id, name, sku, category, price, quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, name, sku, category, price, quantity);
    res.status(201).json({ id, name, sku, category, price, quantity });
  } catch (error) {
    console.error(error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'SKU must be unique' });
    } else {
      res.status(500).json({ error: 'Failed to create inventory item' });
    }
  }
});

// Update an inventory item
router.put('/:id', (req, res) => {
  try {
    const { name, sku, category, price, quantity } = req.body;
    const { id } = req.params;
    
    const stmt = db.prepare(`
      UPDATE inventory_items 
      SET name = ?, sku = ?, category = ?, price = ?, quantity = ?
      WHERE id = ?
    `);
    
    const result = stmt.run(name, sku, category, price, quantity, id);
    
    if (result.changes === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json({ id, name, sku, category, price, quantity });
    }
  } catch (error) {
    console.error(error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'SKU must be unique' });
    } else {
      res.status(500).json({ error: 'Failed to update inventory item' });
    }
  }
});

// Delete an inventory item
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM inventory_items WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json({ message: 'Item deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

export default router;
