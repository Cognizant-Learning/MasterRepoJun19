import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DashBoard.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function DashBoard({ items, setItems }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const prevItemsRef = useRef(items);
  const firstLoad = useRef(true);
  const hasShownFirstLoad = useRef(false);
  const carouselInterval = useRef(null);

  useEffect(() => {
    // Only show all notifications on first load and only if on home page and not after navigation from create/edit
    if (firstLoad.current && location.pathname === '/' && !hasShownFirstLoad.current && performance.navigation.type === 1) {
      setTimeout(() => {
        items.forEach(item => {
          if (item.quantity === 0) {
            toast.error(`Out of Stock: ${item.name} is out of stock!`);
          } else if (item.quantity < 10) {
            toast.warn(`Low Stock: ${item.name} has less than 10 units!`);
          }
        });
      }, 100);
      firstLoad.current = false;
      hasShownFirstLoad.current = true;
    } else if (items.length > prevItemsRef.current.length) {
      // New item notification
      const newItem = items[items.length - 1];
      toast.success(`New item created: ${newItem.name}`);
      if (newItem.quantity < 10) {
        toast.warn(`Low Stock: ${newItem.name} has less than 10 units!`);
      }
    } else if (items.length === prevItemsRef.current.length) {
      // Check for updated item
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === prevItemsRef.current[i].id && items[i].quantity !== prevItemsRef.current[i].quantity) {
          if (items[i].quantity === 0) {
            toast.error(`Out of Stock: ${items[i].name} is out of stock!`);
          } else if (items[i].quantity < 10) {
            toast.warn(`Low Stock: ${items[i].name} has less than 10 units!`);
          }
          break;
        }
      }
    }
    prevItemsRef.current = items;
  }, [items, location.pathname]);

  // Get unique categories for dropdown
  const categories = Array.from(new Set(items.map(item => item.category)));

  const filteredItems = items.filter(item => {
    const matchesSearch = Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'low' && item.quantity > 0 && item.quantity < 10) ||
      (stockFilter === 'out' && item.quantity === 0);
    const matchesCategory =
      categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesStock && matchesCategory;
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Dashboard stats
  const totalItems = items.length;
  const lowStockCount = items.filter(item => item.quantity > 0 && item.quantity < 10).length;
  const outStockCount = items.filter(item => item.quantity === 0).length;
  const uniqueCategories = Array.from(new Set(items.map(item => item.category)));

  // For category block carousel
  const [catIndex, setCatIndex] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    if (uniqueCategories.length > 1) {
      if (carouselInterval.current) clearInterval(carouselInterval.current);
      carouselInterval.current = setInterval(() => {
        setCatIndex(prev => (prev + 1) % uniqueCategories.length);
      }, 2500); // 2.5 seconds
      return () => clearInterval(carouselInterval.current);
    }
  }, [uniqueCategories.length]);

  const handleNextCat = () => {
    setCatIndex((catIndex + 1) % uniqueCategories.length);
    if (carouselInterval.current) {
      clearInterval(carouselInterval.current);
      carouselInterval.current = setInterval(() => {
        setCatIndex(prev => (prev + 1) % uniqueCategories.length);
      }, 2500);
    }
  };
  const handlePrevCat = () => {
    setCatIndex((catIndex - 1 + uniqueCategories.length) % uniqueCategories.length);
    if (carouselInterval.current) {
      clearInterval(carouselInterval.current);
      carouselInterval.current = setInterval(() => {
        setCatIndex(prev => (prev + 1) % uniqueCategories.length);
      }, 2500);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleResetFilters = () => {
    setStockFilter('all');
    setCategoryFilter('all');
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedItems = React.useMemo(() => {
    if (!sortConfig.key) return filteredItems;
    const sorted = [...filteredItems].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredItems, sortConfig]);

  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function handleExportXLSX(data) {
    const ws = XLSX.utils.json_to_sheet(data.map(({ image, ...rest }) => rest));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'inventory.xlsx');
  }

  function getCategoryChartData(items) {
    const map = {};
    items.forEach(item => {
      if (!item.category) return;
      map[item.category] = (map[item.category] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }

  const categoryChartData = getCategoryChartData(items);
  const COLORS = ['#1976d2', '#43a047', '#ffb300', '#e53935', '#8e24aa', '#00838f', '#f4511e'];

  // Select all should select all filtered (not just paginated) items
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(sortedItems.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };
  const handleSelectRow = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} selected item(s)?`)) {
      setItems(items.filter(item => !selectedIds.includes(item.id)));
      setSelectedIds([]);
    }
  };

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-right" limit={2} />
      <div className="dashboard-header">
        <h2>Inventory Dashboard</h2>
      </div>
      <div className="dashboard-stats-row">
        <div className="dashboard-stat-block total-items">
          <div className="stat-label">Total Items</div>
          <div className="stat-value">{totalItems}</div>
        </div>
        <div className="dashboard-stat-block low-stock">
          <div className="stat-label">Low Stock</div>
          <div className="stat-value">{lowStockCount}</div>
        </div>
        <div className="dashboard-stat-block out-stock">
          <div className="stat-label">Out of Stock</div>
          <div className="stat-value">{outStockCount}</div>
        </div>
        <div className="dashboard-stat-block categories">
          <div className="stat-label">Categories</div>
          <div className="stat-value">{uniqueCategories.length}</div>
          <div className="category-carousel">
            {uniqueCategories.length > 0 && (
              <div className="category-item">
                {uniqueCategories[catIndex]} <span className="category-count">({items.filter(i => i.category === uniqueCategories[catIndex]).length})</span>
              </div>
            )}
            {/* Removed left/right navigation buttons for auto-scroll only */}
          </div>
        </div>
      </div>
      <div style={{ width: '100%', maxWidth: 500, margin: '32px auto 0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(25,118,210,0.08)', padding: 24 }}>
        <h3 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 12 }}>Category Breakdown</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={categoryChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#1976d2"
              label={({ name, value }) => `${name} (${value})`}
            >
              {categoryChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="dashboard-controls-row">
        <input
          type="text"
          className="search-box"
          placeholder="Search items..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-dropdown-group">
          <button
            className="filter-toggle-btn"
            onClick={() => setShowFilterMenu((prev) => !prev)}
          >
            Filter
          </button>
          {showFilterMenu && (
            <div className="filter-dropdown-menu">
              <select
                className="filter-dropdown"
                value={stockFilter}
                onChange={e => setStockFilter(e.target.value)}
              >
                <option value="all">All Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
              <select
                className="filter-dropdown"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button className="reset-btn" onClick={handleResetFilters}>Reset All</button>
            </div>
          )}
        </div>
        <button className="create-btn" onClick={() => navigate('/create-new-item')}>Create New Item</button>
        <button className="reset-btn" style={{marginLeft: 0}} onClick={handleBatchDelete} disabled={selectedIds.length === 0}>Batch Delete</button>
        <button className="reset-btn" style={{marginLeft: 0}} onClick={() => handleExportXLSX(items)}>Export XLSX</button>
      </div>
      <table className="inventory-table">
        <thead>
          <tr>
            <th><input type="checkbox" onChange={handleSelectAll} checked={sortedItems.length > 0 && sortedItems.every(item => selectedIds.includes(item.id))} /></th>
            <th>Image</th>
            <th onClick={() => handleSort('name')} style={{cursor:'pointer'}}>Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('sku')} style={{cursor:'pointer'}}>SKU {sortConfig.key === 'sku' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('category')} style={{cursor:'pointer'}}>Category {sortConfig.key === 'category' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('price')} style={{cursor:'pointer'}}>Price {sortConfig.key === 'price' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort('quantity')} style={{cursor:'pointer'}}>Quantity {sortConfig.key === 'quantity' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map(item => (
            <tr key={item.id} className={item.quantity === 0 ? 'out-stock' : item.quantity < 10 ? 'low-stock' : ''}>
              <td><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => handleSelectRow(item.id)} /></td>
              <td>
                {item.image ? (
                  typeof item.image === 'string' && item.image.startsWith('data:') ? (
                    <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                  ) : (
                    <img src={URL.createObjectURL(item.image)} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                  )
                ) : (
                  <span style={{ color: '#bbb', fontSize: 12 }}>No Image</span>
                )}
              </td>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td>{item.category}</td>
              <td>{item.price ? `$${item.price}` : '-'}</td>
              <td>{item.quantity}</td>
              <td>
                <button className="edit-btn" onClick={() => navigate(`/edit-item/${item.id}`)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredItems.length > itemsPerPage && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`pagination-btn${currentPage === i + 1 ? ' active' : ''}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashBoard;
