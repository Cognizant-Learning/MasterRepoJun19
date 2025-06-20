import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ItemForm({ show, handleClose, handleSave, item }) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    quantity: ''
  });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        sku: item.sku || '',
        category: item.category || '',
        price: item.price || '',
        quantity: item.quantity || ''
      });
    } else {
      setForm({ name: '', sku: '', category: '', price: '', quantity: '' });
    }
  }, [item]);

  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    handleSave({ ...item, ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{item ? 'Edit Item' : 'Add Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" value={form.name} onChange={onChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>SKU</Form.Label>
            <Form.Control name="sku" value={form.sku} onChange={onChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control name="category" value={form.category} onChange={onChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control name="price" type="number" step="0.01" value={form.price} onChange={onChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control name="quantity" type="number" value={form.quantity} onChange={onChange} required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ItemForm;
