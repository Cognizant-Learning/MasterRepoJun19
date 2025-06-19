import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { inventoryApi } from '../api/inventoryApi';
import { API_CONFIG } from '../config/api.config';

const Header: React.FC = () => {
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [expiringCount, setExpiringCount] = useState(0);
  const [priceChangeCount, setPriceChangeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [allRes, lowStockRes, outOfStockRes, expiringRes, priceChangeRes] = await Promise.all([
          inventoryApi.getAllNotifications(),
          inventoryApi.getLowStockItems(),
          inventoryApi.getOutOfStockItems(),
          inventoryApi.getExpiringItems(),
          inventoryApi.getPriceChangeItems()
        ]);
        
        setTotalNotifications(allRes.count || 0);
        setLowStockCount(lowStockRes.count || 0);
        setOutOfStockCount(outOfStockRes.count || 0);
        setExpiringCount(expiringRes.count || 0);
        setPriceChangeCount(priceChangeRes.count || 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    
    // Refresh notifications every minute
    const intervalId = setInterval(fetchNotifications, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Pharmacy Dashboard
          {API_CONFIG.showMockIndicator && (
            <Badge bg="warning" className="ms-2" style={{ fontSize: '0.6rem' }}>
              MOCK DATA
            </Badge>
          )}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inventory</Nav.Link>
            <Nav.Link as={Link} to="/analytics">Analytics</Nav.Link>
          </Nav>          <Nav>
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="notification-breakdown">
                  {outOfStockCount > 0 && <div>Out of Stock: {outOfStockCount}</div>}
                  {lowStockCount > 0 && <div>Low Stock: {lowStockCount}</div>}
                  {expiringCount > 0 && <div>Expiring: {expiringCount}</div>}
                  {priceChangeCount > 0 && <div>Price Changes: {priceChangeCount}</div>}
                </Tooltip>
              }
            >
              <Nav.Link as={Link} to="/notifications" className="d-flex align-items-center">
                Notifications
                {!loading && totalNotifications > 0 && (
                  <Badge bg="danger" className="ms-2">
                    {totalNotifications}
                  </Badge>
                )}
              </Nav.Link>
            </OverlayTrigger>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
