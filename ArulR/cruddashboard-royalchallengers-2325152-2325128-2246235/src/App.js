import React, { useState } from 'react';
import AuthPage from './LoginPage';
import './App.css';

function Dashboard({ onLogout }) {
  // Sample inventory data
  const [items, setItems] = useState([
    { id: 1, name: 'T-Shirt', sku: 'TS001', category: 'Clothing', price: 20, quantity: 8 },
    { id: 2, name: 'Jeans', sku: 'JN002', category: 'Clothing', price: 40, quantity: 15 },
    { id: 3, name: 'Sneakers', sku: 'SN003', category: 'Footwear', price: 60, quantity: 5 },
    { id: 4, name: 'Hat', sku: 'HT004', category: 'Accessories', price: 10, quantity: 0 },
    { id: 5, name: 'Jacket', sku: 'JK005', category: 'Clothing', price: 80, quantity: 12 },
    { id: 6, name: 'Socks', sku: 'SK006', category: 'Clothing', price: 5, quantity: 30 },
    { id: 7, name: 'Backpack', sku: 'BP007', category: 'Accessories', price: 35, quantity: 7 },
    { id: 8, name: 'Watch', sku: 'WT008', category: 'Accessories', price: 120, quantity: 3 },
    { id: 9, name: 'Sandals', sku: 'SD009', category: 'Footwear', price: 25, quantity: 18 },
    { id: 10, name: 'Belt', sku: 'BL010', category: 'Accessories', price: 15, quantity: 9 },
    { id: 11, name: 'Scarf', sku: 'SC011', category: 'Accessories', price: 12, quantity: 14 },
    { id: 12, name: 'Gloves', sku: 'GL012', category: 'Accessories', price: 18, quantity: 6 },
    { id: 13, name: 'Boots', sku: 'BT013', category: 'Footwear', price: 90, quantity: 2 },
    { id: 14, name: 'Shorts', sku: 'SH014', category: 'Clothing', price: 22, quantity: 20 },
    { id: 15, name: 'Sunglasses', sku: 'SG015', category: 'Accessories', price: 50, quantity: 11 },
  ]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', sku: '', category: '', price: '', quantity: '' });
  const [editId, setEditId] = useState(null);

  // Key stats
  const totalUnique = items.length;
  const lowStock = items.filter(i => i.quantity > 0 && i.quantity < 10).length;
  const outOfStock = items.filter(i => i.quantity === 0).length;

  // Filtered items
  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.sku.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  // Handle form changes
  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update item
  const handleFormSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.sku || !form.category || !form.price || !form.quantity) return;
    if (editId) {
      setItems(items.map(i => i.id === editId ? { ...form, id: editId, price: Number(form.price), quantity: Number(form.quantity) } : i));
    } else {
      setItems([
        ...items,
        { ...form, id: Date.now(), price: Number(form.price), quantity: Number(form.quantity) }
      ]);
    }
    setForm({ name: '', sku: '', category: '', price: '', quantity: '' });
    setShowForm(false);
    setEditId(null);
  };

  // Edit item
  const handleEdit = item => {
    setForm(item);
    setShowForm(true);
    setEditId(item.id);
  };

  // Delete item
  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  return (
    <div style={{ padding: 32, background: '#f5f6fa', minHeight: '100vh' }}>
      {/* Professional, clean header (no icon) */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        padding: '32px 40px',
        position: 'relative',
        border: '1px solid #e3e6f0'
      }}>
        <h1 style={{ color: '#222', fontSize: 36, fontWeight: 800, letterSpacing: 1, margin: 0, fontFamily: 'Segoe UI, Arial, sans-serif' }}>
          Inventory Dashboard
        </h1>
        <button onClick={onLogout} style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 600, fontSize: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
          Logout
        </button>
      </header>
      {/* Key Stats */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minWidth: 180, color: '#2563eb', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{totalUnique}</div>
          <div style={{ opacity: 0.85, fontWeight: 500 }}>Total Unique Items</div>
        </div>
        <div style={{ background: '#f0f9ff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minWidth: 180, color: '#b45309', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{lowStock}</div>
          <div style={{ opacity: 0.85, fontWeight: 500 }}>Items Low on Stock</div>
        </div>
        <div style={{ background: '#fef2f2', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minWidth: 180, color: '#b91c1c', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{outOfStock}</div>
          <div style={{ opacity: 0.85, fontWeight: 500 }}>Items Out of Stock</div>
        </div>
      </div>
      {/* Search & Add */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by name, SKU, or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 12, borderRadius: 8, border: '1px solid #d1d5db', width: 320, fontSize: 16, background: '#fff' }}
        />
        <button onClick={() => { setShowForm(true); setForm({ name: '', sku: '', category: '', price: '', quantity: '' }); setEditId(null); }} style={{ background: 'linear-gradient(90deg, #007bff 0%, #00c6ff 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px rgba(0,123,255,0.10)', cursor: 'pointer' }}>+ Add Item</button>
      </div>
      {/* Inventory Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflowX: 'auto', margin: '0 auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Segoe UI, Arial, sans-serif', fontSize: 16 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: 16, textAlign: 'left', fontWeight: 700, color: '#60a5fa', letterSpacing: 0.5 }}>Name</th>
              <th style={{ padding: 16, textAlign: 'left', fontWeight: 700, color: '#60a5fa', letterSpacing: 0.5 }}>SKU</th>
              <th style={{ padding: 16, textAlign: 'left', fontWeight: 700, color: '#60a5fa', letterSpacing: 0.5 }}>Category</th>
              <th style={{ padding: 16, textAlign: 'left', fontWeight: 700, color: '#60a5fa', letterSpacing: 0.5 }}>Price</th>
              <th style={{ padding: 16, textAlign: 'left', fontWeight: 700, color: '#60a5fa', letterSpacing: 0.5 }}>Quantity</th>
              <th style={{ padding: 16, textAlign: 'left', fontWeight: 700, color: '#60a5fa', letterSpacing: 0.5 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} style={{ background: item.quantity === 0 ? '#fef2f2' : item.quantity < 10 ? '#f0f9ff' : '#f8fafc', transition: 'background 0.3s' }}>
                <td style={{ padding: 16 }}>{item.name}</td>
                <td style={{ padding: 16 }}>{item.sku}</td>
                <td style={{ padding: 16 }}>{item.category}</td>
                <td style={{ padding: 16 }}>${item.price}</td>
                <td style={{ padding: 16 }}>{item.quantity}</td>
                <td style={{ padding: 16 }}>
                  <button onClick={() => handleEdit(item)} style={{ marginRight: 8, background: '#bae6fd', color: '#2563eb', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ background: '#fca5a5', color: '#b91c1c', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}>Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#888' }}>No items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Add/Edit Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <form onSubmit={handleFormSubmit} style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 340, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <h2 style={{ marginBottom: 24, color: '#007bff', fontWeight: 700 }}>{editId ? 'Edit Item' : 'Add Item'}</h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 500 }}>Name</label>
              <input name="name" value={form.name} onChange={handleFormChange} style={{ width: '100%', padding: 10, marginTop: 4, borderRadius: 6, border: '1px solid #d1d5db', fontSize: 15 }} required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 500 }}>SKU</label>
              <input name="sku" value={form.sku} onChange={handleFormChange} style={{ width: '100%', padding: 10, marginTop: 4, borderRadius: 6, border: '1px solid #d1d5db', fontSize: 15 }} required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 500 }}>Category</label>
              <input name="category" value={form.category} onChange={handleFormChange} style={{ width: '100%', padding: 10, marginTop: 4, borderRadius: 6, border: '1px solid #d1d5db', fontSize: 15 }} required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 500 }}>Price</label>
              <input name="price" type="number" value={form.price} onChange={handleFormChange} style={{ width: '100%', padding: 10, marginTop: 4, borderRadius: 6, border: '1px solid #d1d5db', fontSize: 15 }} required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 500 }}>Quantity</label>
              <input name="quantity" type="number" value={form.quantity} onChange={handleFormChange} style={{ width: '100%', padding: 10, marginTop: 4, borderRadius: 6, border: '1px solid #d1d5db', fontSize: 15 }} required />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} style={{ background: '#ccc', color: '#222', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>{editId ? 'Update' : 'Add'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return <AuthPage onLoginSuccess={handleLoginSuccess} />;
}

export default App;
