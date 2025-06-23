import React from 'react';

const InventoryList = ({ items, onEdit, onDelete }) => (
  <div>
    <h2>Inventory List</h2>
    <table className="inventory-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>SKU</th>
          <th>Category</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.sku || ''}</td>
            <td>{item.category || ''}</td>
            <td>{item.price !== undefined ? item.price : ''}</td>
            <td>{item.quantity}</td>
            <td>
              <button onClick={() => onEdit(item)}>Edit</button>
              <button onClick={() => onDelete(item.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default InventoryList;
