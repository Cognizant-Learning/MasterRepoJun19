import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner, Row, Col, Badge, Button, Tabs, Tab, Modal, Form, Table } from 'react-bootstrap';
import { inventoryApi, NotificationItem, AutoFillResult } from '../api/inventoryApi';

// NotificationList component for displaying different types of notifications
interface NotificationListProps {
  notifications: NotificationItem[];
  onAutoFill: (itemId: string) => void;
  showAutoFillColumn?: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications, onAutoFill, showAutoFillColumn = false }) => {
  if (notifications.length === 0) {
    return <Alert variant="info">No notifications in this category.</Alert>;
  }

  return (
    <Card>
      <Card.Body>
        <div className="table-responsive">
          <Table striped hover>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Type</th>
                <th>Status</th>
                <th>Details</th>
                {showAutoFillColumn && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => (
                <tr key={`${notification._id}-${notification.notificationType}`}>
                  <td>{notification.name}</td>
                  <td>{notification.category}</td>
                  <td>{notification.notificationType}</td>
                  <td>
                    <Badge bg={notification.detail.severity === 'danger' ? 'danger' : 
                             notification.detail.severity === 'warning' ? 'warning' : 'info'}>
                      {notification.detail.severity === 'danger' ? 'Critical' : 
                       notification.detail.severity === 'warning' ? 'Warning' : 'Info'}
                    </Badge>
                  </td>
                  <td>{notification.detail.message}</td>
                  {showAutoFillColumn && (
                    <td>
                      <Button 
                        size="sm" 
                        variant="primary" 
                        onClick={() => onAutoFill(notification._id)}
                      >
                        Auto-Fill
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<NotificationItem[]>([]);
  const [outOfStockItems, setOutOfStockItems] = useState<NotificationItem[]>([]);
  const [expiringItems, setExpiringItems] = useState<NotificationItem[]>([]);
  const [priceChangeItems, setPriceChangeItems] = useState<NotificationItem[]>([]);
  const [autoFillResults, setAutoFillResults] = useState<AutoFillResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showAutoFillModal, setShowAutoFillModal] = useState<boolean>(false);
  const [autoFillInProgress, setAutoFillInProgress] = useState<boolean>(false);
  const [autoFillSuccess, setAutoFillSuccess] = useState<string | null>(null);
  const [autoFillError, setAutoFillError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const [allRes, lowStockRes, outOfStockRes, expiringRes, priceChangeRes] = await Promise.all([
          inventoryApi.getAllNotifications(),
          inventoryApi.getLowStockItems(),
          inventoryApi.getOutOfStockItems(),
          inventoryApi.getExpiringItems(),
          inventoryApi.getPriceChangeItems()
        ]);
        
        if (allRes.success) {
          setNotifications(allRes.data);
        }
        
        if (lowStockRes.success) {
          setLowStockItems(lowStockRes.data);
        }
        
        if (outOfStockRes.success) {
          setOutOfStockItems(outOfStockRes.data);
        }
        
        if (expiringRes.success) {
          setExpiringItems(expiringRes.data);
        }
        
        if (priceChangeRes.success) {
          setPriceChangeItems(priceChangeRes.data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('An error occurred while fetching notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [autoFillResults]); // Refresh when auto-fill is completed
  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: Date | undefined): number => {
    if (!expiryDate) return 0;
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    const differenceInTime = expiry.getTime() - now.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    
    return differenceInDays;
  };

  // Determine badge color for expiring items
  const getExpiryBadgeVariant = (days: number): string => {
    if (days <= 0) return 'danger';
    if (days <= 15) return 'warning';
    if (days <= 30) return 'info';
    if (days <= 60) return 'primary';
    return 'secondary';
  };
  
  // Handle auto-fill for all out of stock items
  const handleAutoFillAll = async () => {
    try {
      setAutoFillInProgress(true);
      setAutoFillError(null);
      setShowAutoFillModal(true);
      
      const response = await inventoryApi.triggerAutoFill();
      
      if (response.success) {
        setAutoFillResults(response.data);
        setAutoFillSuccess(`Successfully auto-filled ${response.data.length} items`);
      }
    } catch (error) {
      console.error('Error triggering auto-fill:', error);
      setAutoFillError('Failed to auto-fill items. Please try again.');
    } finally {
      setAutoFillInProgress(false);
    }
  };
  
  // Handle auto-fill for a specific item
  const handleAutoFillItem = async (itemId: string) => {
    try {
      setAutoFillInProgress(true);
      setAutoFillError(null);
      setShowAutoFillModal(true);
      
      const response = await inventoryApi.autoFillItem(itemId);
      
      if (response.success) {
        setAutoFillResults([response.data]);
        setAutoFillSuccess(`Successfully auto-filled ${response.data.itemName}`);
      }
    } catch (error) {
      console.error('Error auto-filling item:', error);
      setAutoFillError('Failed to auto-fill item. Please try again.');
    } finally {
      setAutoFillInProgress(false);
    }
  };
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }
  
  // Auto-fill modal
  const renderAutoFillModal = () => (
    <Modal show={showAutoFillModal} onHide={() => setShowAutoFillModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Auto-Fill Results</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {autoFillInProgress && (
          <div className="text-center my-3">
            <Spinner animation="border" />
            <p className="mt-2">Processing auto-fill requests...</p>
          </div>
        )}
        
        {autoFillError && (
          <Alert variant="danger">{autoFillError}</Alert>
        )}
        
        {autoFillSuccess && (
          <Alert variant="success">{autoFillSuccess}</Alert>
        )}
        
        {autoFillResults.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Previous Quantity</th>
                  <th>Added Quantity</th>
                  <th>New Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {autoFillResults.map((result, index) => (
                  <tr key={index}>
                    <td>{result.itemName}</td>
                    <td>{result.previousQuantity}</td>
                    <td>{result.autoFillQuantity}</td>
                    <td>{result.newQuantity}</td>
                    <td>
                      <Badge bg={result.successful ? 'success' : 'danger'}>
                        {result.successful ? 'Success' : 'Failed'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowAutoFillModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <Container>
      <h1 className="mb-4">Inventory Notifications</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4>Total Notifications: <Badge bg="primary">{notifications.length}</Badge></h4>
        </div>
        <div>
          <Button 
            variant="success" 
            onClick={handleAutoFillAll} 
            disabled={outOfStockItems.length === 0}
          >
            Auto-Fill All Out of Stock Items ({outOfStockItems.length})
          </Button>
        </div>
      </div>
      
      {!loading && notifications.length === 0 ? (
        <Alert variant="success">No notifications at this time.</Alert>
      ) : (
        <>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || 'all')}
            className="mb-4"
          >
            <Tab eventKey="all" title={`All (${notifications.length})`}>
              <NotificationList 
                notifications={notifications} 
                onAutoFill={handleAutoFillItem} 
              />
            </Tab>
            <Tab eventKey="outOfStock" title={`Out of Stock (${outOfStockItems.length})`}>
              <NotificationList 
                notifications={outOfStockItems} 
                onAutoFill={handleAutoFillItem} 
                showAutoFillColumn={true}
              />
            </Tab>
            <Tab eventKey="lowStock" title={`Low Stock (${lowStockItems.length})`}>
              <NotificationList 
                notifications={lowStockItems} 
                onAutoFill={handleAutoFillItem} 
              />
            </Tab>
            <Tab eventKey="expiring" title={`Expiring (${expiringItems.length})`}>
              <NotificationList 
                notifications={expiringItems} 
                onAutoFill={handleAutoFillItem} 
              />
            </Tab>
            <Tab eventKey="priceChanges" title={`Price Changes (${priceChangeItems.length})`}>
              <NotificationList 
                notifications={priceChangeItems} 
                onAutoFill={handleAutoFillItem} 
              />
            </Tab>
          </Tabs>
        </>
      )}
      
      {renderAutoFillModal()}
    </Container>
  );
};
};

export default Notifications;
