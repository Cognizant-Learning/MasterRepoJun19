import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { InventoryItem } from '../api/inventoryApi';

interface InventoryModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (item: InventoryItem) => void;
  item: InventoryItem | null;
  categories: string[];
}

const defaultItem: InventoryItem = {
  name: '',
  description: '',
  sku: '',
  category: '',
  price: 0,
  cost: 0,
  quantity: 0,
  reorderLevel: 10,
  autoFillEnabled: false,
  autoFillQuantity: 20,
  storageType: 'Room Temperature',
  isControlledSubstance: false
};

const InventoryModal: React.FC<InventoryModalProps> = ({ 
  show, 
  handleClose, 
  handleSave, 
  item,
  categories 
}) => {
  const [formData, setFormData] = useState<InventoryItem>({ ...defaultItem });
  const [validated, setValidated] = useState(false);
  
  // Reset form when item changes
  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({ ...defaultItem });
    }
    setValidated(false);
  }, [item]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else if (type === 'date' && value) {
      setFormData({ ...formData, [name]: new Date(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    handleSave(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{item ? 'Edit Item' : 'Add New Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a name.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group as={Col} md="6">
              <Form.Label>SKU</Form.Label>
              <Form.Control
                required
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide an SKU.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Category</Form.Label>
              <Form.Select
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a category.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6">
              <Form.Label>Storage Type</Form.Label>
              <Form.Select
                required
                name="storageType"
                value={formData.storageType}
                onChange={handleChange}
              >
                <option value="Room Temperature">Room Temperature</option>
                <option value="Refrigerated">Refrigerated</option>
                <option value="Specialty Storage">Specialty Storage</option>
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="3">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                required
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group as={Col} md="3">
              <Form.Label>Cost ($)</Form.Label>
              <Form.Control
                required
                type="number"
                min="0"
                step="0.01"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group as={Col} md="3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                required
                type="number"
                min="0"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group as={Col} md="3">
              <Form.Label>Reorder Level</Form.Label>
              <Form.Control
                required
                type="number"
                min="0"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Manufacturer</Form.Label>
              <Form.Control
                type="text"
                name="manufacturer"
                value={formData.manufacturer || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group as={Col} md="6">
              <Form.Label>Batch Number</Form.Label>
              <Form.Control
                type="text"
                name="batchNumber"
                value={formData.batchNumber || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                name="expiryDate"
                value={formData.expiryDate ? new Date(formData.expiryDate).toISOString().split('T')[0] : ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group as={Col} md="6" className="d-flex align-items-center">
              <Form.Check 
                type="checkbox"
                id="controlled-substance"
                label="Controlled Substance"
                name="isControlledSubstance"
                checked={formData.isControlledSubstance}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>
          
          <Row className="mb-3">
            <Col md="12">
              <h5>Auto-Fill Settings</h5>
              <p className="text-muted small">Configure automatic replenishment when item is out of stock</p>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Form.Group as={Col} md="6" className="d-flex align-items-center">
              <Form.Check 
                type="checkbox"
                id="auto-fill-enabled"
                label="Enable Auto-Fill"
                name="autoFillEnabled"
                checked={formData.autoFillEnabled || false}
                onChange={handleChange}
              />
            </Form.Group>
            
            <Form.Group as={Col} md="6">
              <Form.Label>Auto-Fill Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                name="autoFillQuantity"
                value={formData.autoFillQuantity || 20}
                onChange={handleChange}
                disabled={!formData.autoFillEnabled}
              />
              <Form.Text className="text-muted">
                Quantity to add when auto-filling this item
              </Form.Text>
            </Form.Group>
          </Row>
          
          <Row className="mb-3">
            <Col md="12">
              <h5>Notification Preferences</h5>
              <p className="text-muted small">Configure which notifications you want to receive for this item</p>
            </Col>
            <Form.Group as={Col} className="d-flex flex-wrap gap-3">
              <Form.Check 
                type="checkbox"
                id="notif-low-stock"
                label="Low Stock"
                name="notificationLowStock"
                checked={formData.notificationPreferences?.includes('Low Stock') || true}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const prefs = formData.notificationPreferences || [];
                  if (checked && !prefs.includes('Low Stock')) {
                    setFormData({ ...formData, notificationPreferences: [...prefs, 'Low Stock'] });
                  } else if (!checked && prefs.includes('Low Stock')) {
                    setFormData({ 
                      ...formData, 
                      notificationPreferences: prefs.filter(p => p !== 'Low Stock') 
                    });
                  }
                }}
              />
              <Form.Check 
                type="checkbox"
                id="notif-out-of-stock"
                label="Out of Stock"
                name="notificationOutOfStock"
                checked={formData.notificationPreferences?.includes('Out of Stock') || true}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const prefs = formData.notificationPreferences || [];
                  if (checked && !prefs.includes('Out of Stock')) {
                    setFormData({ ...formData, notificationPreferences: [...prefs, 'Out of Stock'] });
                  } else if (!checked && prefs.includes('Out of Stock')) {
                    setFormData({ 
                      ...formData, 
                      notificationPreferences: prefs.filter(p => p !== 'Out of Stock') 
                    });
                  }
                }}
              />
              <Form.Check 
                type="checkbox"
                id="notif-expiry-30"
                label="Expiry (30 days)"
                name="notificationExpiry30"
                checked={formData.notificationPreferences?.includes('Expiry 30 Days') || false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const prefs = formData.notificationPreferences || [];
                  if (checked && !prefs.includes('Expiry 30 Days')) {
                    setFormData({ ...formData, notificationPreferences: [...prefs, 'Expiry 30 Days'] });
                  } else if (!checked && prefs.includes('Expiry 30 Days')) {
                    setFormData({ 
                      ...formData, 
                      notificationPreferences: prefs.filter(p => p !== 'Expiry 30 Days') 
                    });
                  }
                }}
              />
              <Form.Check 
                type="checkbox"
                id="notif-expiry-60"
                label="Expiry (60 days)"
                name="notificationExpiry60"
                checked={formData.notificationPreferences?.includes('Expiry 60 Days') || false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const prefs = formData.notificationPreferences || [];
                  if (checked && !prefs.includes('Expiry 60 Days')) {
                    setFormData({ ...formData, notificationPreferences: [...prefs, 'Expiry 60 Days'] });
                  } else if (!checked && prefs.includes('Expiry 60 Days')) {
                    setFormData({ 
                      ...formData, 
                      notificationPreferences: prefs.filter(p => p !== 'Expiry 60 Days') 
                    });
                  }
                }}
              />
              <Form.Check 
                type="checkbox"
                id="notif-expiry-90"
                label="Expiry (90 days)"
                name="notificationExpiry90"
                checked={formData.notificationPreferences?.includes('Expiry 90 Days') || false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const prefs = formData.notificationPreferences || [];
                  if (checked && !prefs.includes('Expiry 90 Days')) {
                    setFormData({ ...formData, notificationPreferences: [...prefs, 'Expiry 90 Days'] });
                  } else if (!checked && prefs.includes('Expiry 90 Days')) {
                    setFormData({ 
                      ...formData, 
                      notificationPreferences: prefs.filter(p => p !== 'Expiry 90 Days') 
                    });
                  }
                }}
              />
              <Form.Check 
                type="checkbox"
                id="notif-price-change"
                label="Price Changes"
                name="notificationPriceChange"
                checked={formData.notificationPreferences?.includes('Price Change') || false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const prefs = formData.notificationPreferences || [];
                  if (checked && !prefs.includes('Price Change')) {
                    setFormData({ ...formData, notificationPreferences: [...prefs, 'Price Change'] });
                  } else if (!checked && prefs.includes('Price Change')) {
                    setFormData({ 
                      ...formData, 
                      notificationPreferences: prefs.filter(p => p !== 'Price Change') 
                    });
                  }
                }}
              />
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default InventoryModal;
