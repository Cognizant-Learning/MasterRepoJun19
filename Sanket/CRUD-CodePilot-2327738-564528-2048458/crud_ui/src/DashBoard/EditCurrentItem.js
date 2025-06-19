import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditCurrentItem.css';

function EditCurrentItem({ items, setItems }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const itemToEdit = items.find(item => item.id === Number(id));
  const [form, setForm] = useState({
    image: null,
    name: '',
    quantity: '',
    sku: '',
    category: '',
    price: ''
  });

  useEffect(() => {
    if (itemToEdit) {
      setForm({
        image: itemToEdit.image || null,
        name: itemToEdit.name || '',
        quantity: itemToEdit.quantity || '',
        sku: itemToEdit.sku || '',
        category: itemToEdit.category || '',
        price: itemToEdit.price || ''
      });
    }
  }, [itemToEdit]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (Number(form.quantity) < 10) {
      toast.warn('Low Stock: Quantity is below 10!');
    }
    const updatedItem = {
      ...itemToEdit,
      name: form.name,
      sku: form.sku,
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity),
      image: form.image
    };
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
    navigate('/');
  };

  if (!itemToEdit) return <div>Item not found.</div>;

  return (
    <div className="create-item-container">
      <ToastContainer position="top-center" />
      <h2>Edit Item</h2>
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
        <button type="submit">Update Item</button>
      </form>
    </div>
  );
}

export default EditCurrentItem;
