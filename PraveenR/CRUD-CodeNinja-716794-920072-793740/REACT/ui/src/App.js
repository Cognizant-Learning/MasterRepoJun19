import React, { useState } from 'react';
import './App.css';
import Dashboard from './Dashboard';
import InventoryList from './InventoryList';
import InventoryForm from './InventoryForm';
import './Dashboard.css';

function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item A', quantity: 10 },
    { id: 2, name: 'Item B', quantity: 2 },
    { id: 3, name: 'Item C', quantity: 0 },
  ]);
  const [editingItem, setEditingItem] = useState(null);

  const lowStockThreshold = 5;
  const lowStockItems = items.filter(item => item.quantity > 0 && item.quantity < lowStockThreshold);
  const outOfStockItems = items.filter(item => item.quantity === 0);

  const handleAddOrUpdate = async (item) => {
    // If item.id is not present in the list, treat as Add
    const exists = items.find(i => i.id === item.id);
    if (!exists) {
      // Add to remote DB
      try {
        const response = await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        if (!response.ok) throw new Error('Failed to add item');
        const savedItem = await response.json();
        setItems(prev => [...prev, savedItem]);
      } catch (err) {
        alert('Error adding item: ' + err.message);
      }
    } else {
      // Local update for edit
      setItems(prev => prev.map(i => (i.id === item.id ? item : i)));
    }
    setEditingItem(null);
  };

  const handleEdit = (item) => setEditingItem(item);
  const handleDelete = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const handleCancel = () => setEditingItem(null);

  return (
    <div className="App">
      <h1 className="app-header">Inventory Management Tool</h1>
      <Dashboard
        totalItems={items.length}
        lowStockItems={lowStockItems}
        outOfStockItems={outOfStockItems}
      />
      <InventoryForm
        onSubmit={handleAddOrUpdate}
        editingItem={editingItem}
        onCancel={handleCancel}
      />
      <InventoryList
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
