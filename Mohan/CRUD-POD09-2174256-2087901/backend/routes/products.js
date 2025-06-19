const express = require('express');
const { readDB, writeDB } = require('../models/jsondb');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.products || []);
});

// Get a single product by id
router.get('/:id', (req, res) => {
  const db = readDB();
  const product = (db.products || []).find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Create a new product
router.post('/', authMiddleware, (req, res) => {
  const db = readDB();
  const { name, price, description } = req.body;
  const product = {
    id: Date.now().toString(),
    name,
    price,
    description
  };
  db.products = db.products || [];
  db.products.push(product);
  writeDB(db);
  res.status(201).json(product);
});

// Update a product
router.put('/:id', authMiddleware, (req, res) => {
  const db = readDB();
  const { name, price, description } = req.body;
  const productIndex = (db.products || []).findIndex(p => p.id === req.params.id);
  if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });
  db.products[productIndex] = { ...db.products[productIndex], name, price, description };
  writeDB(db);
  res.json(db.products[productIndex]);
});

// Delete a product
router.delete('/:id', authMiddleware, (req, res) => {
  const db = readDB();
  const productIndex = (db.products || []).findIndex(p => p.id === req.params.id);
  if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });
  const deleted = db.products.splice(productIndex, 1);
  writeDB(db);
  res.json({ message: 'Product deleted', product: deleted[0] });
});

module.exports = router;
