import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner, Form, Row, Col } from 'react-bootstrap';
import { inventoryApi, InventoryItem } from '../api/inventoryApi';
import InventoryModal from './InventoryModal';

const InventoryList: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch inventory items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await inventoryApi.getAllItems();
      if (response.success) {
        setItems(response.data);
      } else {
        setError('Failed to fetch inventory items');
      }
    } catch (error) {
      setError('An error occurred while fetching inventory items');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await inventoryApi.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  // Handle item deletion
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await inventoryApi.deleteItem(id);
        if (response.success) {
          setItems(items.filter(item => item._id !== id));
        } else {
          setError('Failed to delete item');
        }
      } catch (error) {
        setError('An error occurred while deleting the item');
        console.error(error);
      }
    }
  };

  // Handle edit click
  const handleEdit = (item: InventoryItem) => {
    setCurrentItem(item);
    setShowModal(true);
  };

  // Handle add new click
  const handleAddNew = () => {
    setCurrentItem(null);
    setShowModal(true);
  };

  // Handle modal save
  const handleSave = async (item: InventoryItem) => {
    try {
      let response;
      
      if (item._id) {
        // Update existing item
        response = await inventoryApi.updateItem(item._id, item);
      } else {
        // Create new item
        response = await inventoryApi.createItem(item);
      }
      
      if (response.success) {
        fetchItems(); // Refresh the list
        setShowModal(false);
      } else {
        setError(response.error || 'Failed to save item');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred while saving the item');
      console.error(error);
    }
  };

  // Filter items based on category and search term
  const filteredItems = items.filter(item => {
    const matchesCategory = filterCategory ? item.category === filterCategory : true;
    const matchesSearch = searchTerm 
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <Row className="align-items-center">
          <Col md={3}>
            <h2>Inventory Items</h2>
          </Col>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3} className="text-end">
            <Button variant="primary" onClick={handleAddNew}>
              Add New Item
            </Button>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {filteredItems.length === 0 ? (
        <Alert variant="info">No inventory items found.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Reorder Level</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.sku}</td>
                <td>{item.category}</td>
                <td>${item.price.toFixed(2)}</td>
                <td className={item.quantity <= item.reorderLevel ? 'text-danger' : ''}>
                  {item.quantity}
                </td>
                <td>{item.reorderLevel}</td>
                <td>
                  {item.expiryDate 
                    ? new Date(item.expiryDate).toLocaleDateString() 
                    : 'N/A'}
                </td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => item._id && handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <InventoryModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSave}
        item={currentItem}
        categories={categories}
      />
    </>
  );
};

export default InventoryList;
