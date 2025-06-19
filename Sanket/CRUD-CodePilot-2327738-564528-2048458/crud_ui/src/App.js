import React, { useState } from 'react';
import DashBoard from './DashBoard/DashBoard';
import CreateNewItem from './DashBoard/CreateNewItem';
import EditCurrentItem from './DashBoard/EditCurrentItem';
import './App.css';
import { Routes, Route } from 'react-router-dom';

const initialItems = [
  { id: 1, name: 'T-Shirt', sku: 'TSH-001', category: 'Apparel', price: 20, quantity: 15 },
  { id: 2, name: 'Jeans', sku: 'JNS-002', category: 'Apparel', price: 40, quantity: 8 },
  { id: 3, name: 'Sneakers', sku: 'SNK-003', category: 'Footwear', price: 60, quantity: 0 },
  { id: 4, name: 'Hat', sku: 'HAT-004', category: 'Accessories', price: 10, quantity: 12 },
  { id: 5, name: 'Jacket', sku: 'JKT-005', category: 'Apparel', price: 80, quantity: 5 },
  { id: 6, name: 'Socks', sku: 'SCK-006', category: 'Apparel', price: 5, quantity: 30 },
  { id: 7, name: 'Backpack', sku: 'BKP-007', category: 'Accessories', price: 50, quantity: 7 },
  { id: 8, name: 'Belt', sku: 'BLT-008', category: 'Accessories', price: 15, quantity: 20 },
  { id: 9, name: 'Watch', sku: 'WCH-009', category: 'Accessories', price: 120, quantity: 3 },
  { id: 10, name: 'Sunglasses', sku: 'SNG-010', category: 'Accessories', price: 25, quantity: 18 },
  { id: 11, name: 'Boots', sku: 'BTS-011', category: 'Footwear', price: 90, quantity: 9 },
  { id: 12, name: 'Sandals', sku: 'SND-012', category: 'Footwear', price: 30, quantity: 14 },
  { id: 13, name: 'Scarf', sku: 'SCF-013', category: 'Accessories', price: 12, quantity: 11 },
  { id: 14, name: 'Gloves', sku: 'GLV-014', category: 'Accessories', price: 8, quantity: 6 },
  { id: 15, name: 'Cap', sku: 'CAP-015', category: 'Accessories', price: 9, quantity: 13 },
];

function App() {
  const [items, setItems] = useState(initialItems);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DashBoard items={items} setItems={setItems} />} />
        <Route path="/create-new-item" element={<CreateNewItem setItems={setItems} items={items} />} />
        <Route path="/edit-item/:id" element={<EditCurrentItem setItems={setItems} items={items} />} />
      </Routes>
    </div>
  );
}

export default App;
