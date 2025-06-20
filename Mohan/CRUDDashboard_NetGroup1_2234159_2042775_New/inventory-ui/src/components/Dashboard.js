import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col, Form, Spinner } from 'react-bootstrap';
import StatsHeader from './StatsHeader';
import InventoryTable from './InventoryTable';
import ItemForm from './ItemForm';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api/items';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [darkMode, setDarkMode] = useState(false);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const fetchItems = async (searchTerm = '') => {
    setLoading(true);
    try {
      let url = API_URL;
      if (searchTerm) url += `?search=${encodeURIComponent(searchTerm)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch items');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setItems([]);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setStats({ total: 0, lowStock: 0, outOfStock: 0 });
    }
  };

  useEffect(() => {
    fetchItems();
    fetchStats();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchItems(search);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSave = async (item) => {
    try {
      const method = item.id ? 'PUT' : 'POST';
      const url = item.id ? `${API_URL}/${item.id}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!res.ok) throw new Error('Failed to save item');
      setShowForm(false);
      setEditingItem(null);
      await fetchItems(search);
      await fetchStats();
      toast.success(item.id ? 'Item updated successfully!' : 'Item added successfully!');
    } catch (err) {
      toast.error('Failed to save item. Please check your input and try again.');
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Delete item '${item.name}'?`)) {
      try {
        const res = await fetch(`${API_URL}/${item.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete item');
        setLastDeleted(item);
        await fetchItems(search);
        await fetchStats();
        toast.success(<span>Item deleted! <Button variant="link" size="sm" onClick={undoDelete}>Undo</Button></span>, {autoClose: 5000});
      } catch (err) {
        toast.error('Failed to delete item.');
      }
    }
  };

  const undoDelete = async () => {
    if (lastDeleted) {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lastDeleted)
        });
        if (!res.ok) throw new Error('Failed to restore item');
        setLastDeleted(null);
        await fetchItems(search);
        await fetchStats();
        toast.success('Item restored!');
      } catch (err) {
        toast.error('Failed to restore item.');
      }
    }
  };

  // CSV export handler
  const handleExportCSV = () => {
    if (!items.length) return;
    const headers = Object.keys(items[0]);
    const csvRows = [headers.join(",")];
    for (const item of items) {
      const row = headers.map(h => JSON.stringify(item[h] ?? "")).join(",");
      csvRows.push(row);
    }
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredItems = showLowStockOnly
    ? items.filter(item => item.quantity < lowStockThreshold)
    : items;

  return (
    <Container className={`my-4${darkMode ? ' bg-dark text-light' : ''}`} fluid>
      <h2 className="mb-4">Inventory Dashboard</h2>
      <StatsHeader
        stats={stats}
        onLowStockFilter={() => setShowLowStockOnly(s => !s)}
        onExportCSV={handleExportCSV}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by name, SKU, or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Col>
        <Col md={6} className="text-end">
          <Button onClick={() => { setShowForm(true); setEditingItem(null); }}>
            + Add Item
          </Button>
        </Col>
      </Row>
      {loading ? (
        <div className="text-center my-5"><Spinner animation="border" /></div>
      ) : (
        <InventoryTable
          items={filteredItems}
          onEdit={item => { setEditingItem(item); setShowForm(true); }}
          onDelete={handleDelete}
          lowStockThreshold={lowStockThreshold}
        />
      )}
      <ItemForm
        show={showForm}
        handleClose={() => setShowForm(false)}
        handleSave={handleSave}
        item={editingItem}
      />
    </Container>
  );
}

export default Dashboard;
