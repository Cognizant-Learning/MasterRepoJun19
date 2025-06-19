import React, { useState, useEffect } from 'react';

const initialState = {
  name: '',
  price: '',
  description: ''
};

export default function ProductForm({ onSubmit, product, onCancel }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (product) {
      setForm(product);
    } else {
      setForm(initialState);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    onSubmit(form);
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>{product ? 'Edit Product' : 'Add Product'}</h2>
      <div>
        <label>Name:</label>
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Price:</label>
        <input name="price" value={form.price} onChange={handleChange} required type="number" min="0" />
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={form.description} onChange={handleChange} />
      </div>
      <button type="submit">{product ? 'Update' : 'Add'}</button>
      {onCancel && (
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      )}
    </form>
  );
}
