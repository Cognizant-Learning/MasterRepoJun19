import React, { useEffect, useState } from 'react';

const API_URL = '/api/inventory';

function InventoryApp() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, outOfStock: 0 });
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', sku: '', category: '', price: '', quantity: '' });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchItems = async () => {
    const res = await fetch(API_URL);
    setItems(await res.json());
  };
  const fetchStats = async () => {
    const res = await fetch(API_URL + '/stats');
    setStats(await res.json());
  };
  useEffect(() => {
    fetchItems();
    fetchStats();
  }, []);

  const openForm = (item = null) => {
    setEditing(item);
    setForm(item || { name: '', sku: '', category: '', price: '', quantity: '' });
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', sku: '', category: '', price: '', quantity: '' });
  };
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${API_URL}/${editing.id}` : API_URL;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) })
    });
    closeForm();
    fetchItems();
    fetchStats();
  };
  const handleDelete = async id => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setDeleteId(null);
    fetchItems();
    fetchStats();
  };
  const filtered = items.filter(item =>
    Object.values(item).some(val => String(val).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
      <h1>Inventory Dashboard</h1>
      <div style={{ display: 'flex', gap: 32, marginBottom: 16, fontSize: 18 }}>
        <div>Total Items: <b>{stats.total}</b></div>
        <div style={{ color: '#b58900' }}>Low Stock: <b>{stats.lowStock}</b></div>
        <div style={{ color: '#dc3545' }}>Out of Stock: <b>{stats.outOfStock}</b></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, marginRight: 16 }} />
        <button onClick={() => openForm()} style={{ background: '#1b6ec2', color: '#fff', border: 0, borderRadius: 4, padding: '8px 16px' }}>Add Item</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th>Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(item => (
            <tr key={item.id} style={{ background: item.quantity === 0 ? '#ffeaea' : item.quantity < 10 ? '#fffbe6' : undefined }}>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td>{item.category}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>
                <button onClick={() => openForm(item)} style={{ background: '#ffc107', color: '#222', border: 0, borderRadius: 4, marginRight: 8, padding: '4px 12px' }}>Edit</button>
                <button onClick={() => setDeleteId(item.id)} style={{ background: '#dc3545', color: '#fff', border: 0, borderRadius: 4, padding: '4px 12px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 8, minWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
            <h2>{editing ? 'Edit Item' : 'Add Item'}</h2>
            <form onSubmit={handleSubmit}>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Name" style={{ width: '100%', marginBottom: 8 }} />
              <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" style={{ width: '100%', marginBottom: 8 }} />
              <input name="category" value={form.category} onChange={handleChange} placeholder="Category" style={{ width: '100%', marginBottom: 8 }} />
              <input name="price" value={form.price} onChange={handleChange} placeholder="Price" style={{ width: '100%', marginBottom: 8 }} />
              <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" style={{ width: '100%', marginBottom: 8 }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button type="submit" style={{ background: '#1b6ec2', color: '#fff', border: 0, borderRadius: 4, padding: '8px 16px' }}>Save</button>
                <button type="button" onClick={closeForm} style={{ background: '#6c757d', color: '#fff', border: 0, borderRadius: 4, padding: '8px 16px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 8, minWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this item?</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => handleDelete(deleteId)} style={{ background: '#dc3545', color: '#fff', border: 0, borderRadius: 4, padding: '8px 16px' }}>Delete</button>
              <button onClick={() => setDeleteId(null)} style={{ background: '#6c757d', color: '#fff', border: 0, borderRadius: 4, padding: '8px 16px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryApp;
