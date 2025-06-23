import React, { useState, useEffect } from 'react';

const InventoryForm = ({ onSubmit, editingItem, onCancel }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setQuantity(editingItem.quantity);
    } else {
      setName('');
      setQuantity(0);
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '' || quantity < 0) return;
    onSubmit({
      id: editingItem ? editingItem.id : Date.now(),
      name,
      quantity: Number(quantity),
    });
    setName('');
    setQuantity(0);
  };

  return (
    <form className="inventory-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Item Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        min="0"
        onChange={e => setQuantity(e.target.value)}
        required
      />
      <button type="submit">{editingItem ? 'Update' : 'Add'} Item</button>
      {editingItem && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default InventoryForm;
