import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, ProgressBar, Form } from 'react-bootstrap';

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let increment = end > start ? 1 : -1;
    let stepTime = Math.abs(Math.floor(1000 / (end - start)));
    const timer = setInterval(() => {
      start += increment;
      setDisplay(start);
      if (start === end) clearInterval(timer);
    }, stepTime > 50 ? stepTime : 50);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
}

function getHealthEmoji(stats) {
  if (stats.outOfStock > 0) return '🔴';
  if (stats.lowStock > 0) return '🟡';
  return '🟢';
}

function StatsHeader({ stats, onLowStockFilter, onExportCSV, darkMode, setDarkMode }) {
  const total = stats.total || 0;
  const healthy = total - (stats.lowStock || 0) - (stats.outOfStock || 0);
  const healthPercent = total === 0 ? 100 : Math.round((healthy / total) * 100);

  return (
    <Row className="mb-4 align-items-center">
      <Col md={2} className="text-center">
        <div style={{ fontSize: '2.5rem' }}>{getHealthEmoji(stats)}</div>
        <ProgressBar now={healthPercent} label={`${healthPercent}%`} variant={healthPercent > 70 ? 'success' : healthPercent > 30 ? 'warning' : 'danger'} className="mt-2" />
        <div style={{ fontSize: '0.9rem', marginTop: 4 }}>Inventory Health</div>
      </Col>
      <Col md={2} className="text-center">
        <Card bg="primary" text="white" className="mb-2">
          <Card.Body>
            <Card.Title>Total Unique Items</Card.Title>
            <Card.Text style={{ fontSize: '2rem' }}><AnimatedNumber value={stats.total} /></Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={2} className="text-center">
        <Card bg="warning" text="dark" className="mb-2">
          <Card.Body>
            <Card.Title>Low Stock</Card.Title>
            <Card.Text style={{ fontSize: '2rem' }}><AnimatedNumber value={stats.lowStock} /></Card.Text>
            <Button size="sm" variant="outline-dark" onClick={onLowStockFilter}>Show Low Stock</Button>
          </Card.Body>
        </Card>
      </Col>
      <Col md={2} className="text-center">
        <Card bg="danger" text="white" className="mb-2">
          <Card.Body>
            <Card.Title>Out of Stock</Card.Title>
            <Card.Text style={{ fontSize: '2rem' }}><AnimatedNumber value={stats.outOfStock} /></Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={2} className="text-center">
        <Button variant="success" onClick={onExportCSV} className="mb-2">Export CSV</Button>
      </Col>
      <Col md={2} className="text-center">
        <Form.Check 
          type="switch"
          id="dark-mode-switch"
          label={darkMode ? '🌙 Dark' : '☀️ Light'}
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </Col>
    </Row>
  );
}

export default StatsHeader;
