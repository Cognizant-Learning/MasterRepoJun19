import React from 'react';
import { Table, Button } from 'react-bootstrap';

function InventoryTable({ items, onEdit, onDelete, lowStockThreshold }) {
  return (
    <Table striped bordered hover responsive>
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
        {items.map(item => {
          let rowClass = '';
          if (item.quantity === 0) rowClass = 'table-danger';
          else if (item.quantity < lowStockThreshold) rowClass = 'table-warning';
          return (
            <tr key={item.id} className={rowClass}>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td>{item.category}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>
                <Button size="sm" variant="info" onClick={() => onEdit(item)} className="me-2">Edit</Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(item)}>Delete</Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default InventoryTable;
