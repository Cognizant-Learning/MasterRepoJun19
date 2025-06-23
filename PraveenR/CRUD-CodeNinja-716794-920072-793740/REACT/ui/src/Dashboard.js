import React from 'react';
import './Dashboard.css';

const Dashboard = ({ totalItems, lowStockItems, outOfStockItems }) => (
  <div className="dashboard">
    <h2>Inventory Dashboard</h2>
    <div className="dashboard-summary">
      <div className="dashboard-card">
        <span className="dashboard-label">Total Unique Items</span>
        <span className="dashboard-value">{totalItems}</span>
      </div>
      <div className="dashboard-card warning">
        <span className="dashboard-label">Low Stock Items</span>
        <span className="dashboard-value">{lowStockItems.length}</span>
      </div>
      <div className="dashboard-card danger">
        <span className="dashboard-label">Out of Stock Items</span>
        <span className="dashboard-value">{outOfStockItems.length}</span>
      </div>
    </div>
    <div className="dashboard-lists">
      <div>
        <h4>Low Stock Items</h4>
        <ul>
          {lowStockItems.map(item => (
            <li key={item.id}>{item.name} (Qty: {item.quantity})</li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Out of Stock Items</h4>
        <ul>
          {outOfStockItems.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default Dashboard;
