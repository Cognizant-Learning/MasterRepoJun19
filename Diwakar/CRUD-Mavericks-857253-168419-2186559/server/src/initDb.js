import db from './config/db.js';

// Sample inventory items
const sampleItems = [
  { id: '1', name: 'Wireless Mouse', sku: 'WM-1001', category: 'Electronics', price: 25.99, quantity: 15 },
  { id: '2', name: 'Bluetooth Keyboard', sku: 'BK-2002', category: 'Electronics', price: 45.5, quantity: 8 },
  { id: '3', name: 'Office Chair', sku: 'OC-3003', category: 'Furniture', price: 120.0, quantity: 0 },
  { id: '4', name: 'Standing Desk', sku: 'SD-4004', category: 'Furniture', price: 350.0, quantity: 3 },
  { id: '5', name: 'Notebook', sku: 'NB-5005', category: 'Stationery', price: 2.5, quantity: 50 },
  { id: '6', name: 'Pen Set', sku: 'PS-6006', category: 'Stationery', price: 5.0, quantity: 10 },
  { id: '7', name: 'Monitor 24"', sku: 'MN-7007', category: 'Electronics', price: 150.0, quantity: 0 },
  { id: '8', name: 'Desk Lamp', sku: 'DL-8008', category: 'Electronics', price: 18.75, quantity: 6 },
  { id: '9', name: 'Filing Cabinet', sku: 'FC-9009', category: 'Furniture', price: 80.0, quantity: 2 },
  { id: '10', name: 'Sticky Notes', sku: 'SN-1010', category: 'Stationery', price: 1.2, quantity: 100 }
];

// First, clear any existing data
try {
  db.prepare('DELETE FROM inventory_items').run();
  console.log('Cleared existing inventory items');

  // Insert sample data
  const insert = db.prepare(`
    INSERT INTO inventory_items (id, name, sku, category, price, quantity)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  sampleItems.forEach(item => {
    insert.run(item.id, item.name, item.sku, item.category, item.price, item.quantity);
  });

  console.log('Successfully added sample inventory items');
} catch (error) {
  console.error('Error adding sample data:', error);
}
