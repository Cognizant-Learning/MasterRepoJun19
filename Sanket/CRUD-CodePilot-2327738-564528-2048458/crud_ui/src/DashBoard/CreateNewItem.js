import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreateNewItem.css';

function generateSKU(name) {
  if (!name) return '';
  return (
    name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 3) +
    '-' +
    Math.floor(1000 + Math.random() * 9000)
  );
}

function CreateNewItem({ setItems, items }) {
  const [form, setForm] = useState({
    image: null,
    name: '',
    quantity: '',
    sku: '',
    category: '',
    price: ''
  });
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'name') {
      // Check for existing item with the same name (case-insensitive)
      const existing = items.find(item => item.name.toLowerCase() === value.toLowerCase());
      if (existing) {
        setForm({
          image: existing.image || null,
          name: existing.name,
          quantity: existing.quantity,
          sku: existing.sku,
          category: existing.category,
          price: existing.price
        });
      } else {
        setForm(prev => ({
          ...prev,
          name: value,
          sku: generateSKU(value)
        }));
      }
    } else {
      setForm(prev => ({
        ...prev,
        [name]: files ? files[0] : value
      }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Check if item with same name exists (case-insensitive)
    const exists = items.some(item => item.name.toLowerCase() === form.name.toLowerCase());
    if (exists) {
      toast.error('Item with this name already exists!');
      return;
    }
    if (Number(form.quantity) < 10) {
      toast.warn('Low Stock: Quantity is below 10!');
    }
    const newItem = {
      id: Date.now(),
      name: form.name,
      sku: form.sku,
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity),
      image: form.image
    };
    setItems([...items, newItem]);
    navigate('/');
  };

  return (
    <div className="create-item-container">
      <ToastContainer position="top-center" />
      <h2>Create New Item</h2>
      <form className="create-item-form" onSubmit={handleSubmit}>
        <label>
          Item Image:
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
        </label>
        <label>
          Item Name:
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Quantity:
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required />
        </label>
        <label>
          SKU:
          <input type="text" name="sku" value={form.sku} readOnly />
        </label>
        <label>
          Category:
          <input type="text" name="category" value={form.category} onChange={handleChange} required />
        </label>
        <label>
          Price:
          <input type="number" name="price" value={form.price} onChange={handleChange} required />
        </label>
        <button type="submit">Create Item</button>
      </form>
    </div>
  );
}

export default CreateNewItem;
