import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Notifications from '../pages/Notifications';

// Mock API response data
const mockNotifications = {
  success: true,
  count: 4,
  data: [
    {
      _id: '1',
      name: 'Aspirin',
      sku: 'ASP100',
      category: 'Pain Relievers',
      notificationType: 'Low Stock',
      detail: {
        currentValue: 15,
        thresholdValue: 20,
        message: 'Low stock: 15 items remaining (below reorder level of 20)',
        severity: 'warning'
      },
      createdAt: new Date('2025-06-15')
    },
    {
      _id: '2',
      name: 'Amoxicillin',
      sku: 'AMX500',
      category: 'Antibiotics',
      notificationType: 'Out of Stock',
      detail: {
        currentValue: 0,
        message: 'Out of stock: Amoxicillin needs immediate attention',
        severity: 'danger'
      },
      createdAt: new Date('2025-06-16')
    },
    {
      _id: '3',
      name: 'Vitamin C',
      sku: 'VTC500',
      category: 'Vitamins',
      notificationType: 'Expiry Warning (30 Days)',
      detail: {
        currentValue: new Date('2025-07-19'),
        message: 'Expiring soon: 30 days remaining before expiry',
        severity: 'warning',
        daysToExpiry: 30
      },
      createdAt: new Date('2025-06-17')
    },
    {
      _id: '4',
      name: 'Ibuprofen',
      sku: 'IBP200',
      category: 'Pain Relievers',
      notificationType: 'Price Change',
      detail: {
        currentValue: 8.99,
        previousPrice: 7.49,
        priceChange: 1.50,
        priceChangePercent: 20,
        message: 'Price increased by 20% (from $7.49 to $8.99)',
        severity: 'info'
      },
      createdAt: new Date('2025-06-18')
    }
  ]
};

const mockAutoFillResult = {
  success: true,
  data: {
    itemId: '2',
    itemName: 'Amoxicillin',
    previousQuantity: 0,
    newQuantity: 30,
    autoFillQuantity: 30,
    successful: true,
    message: 'Successfully auto-filled 30 units of Amoxicillin'
  }
};

// Set up MSW server to intercept API requests
const server = setupServer(
  rest.get('/api/inventory/notifications/all', (req, res, ctx) => {
    return res(ctx.json(mockNotifications));
  }),
  rest.post('/api/inventory/auto-fill/:id', (req, res, ctx) => {
    return res(ctx.json(mockAutoFillResult));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Test suite for notification system
describe('Notification System', () => {
  test('renders all notification types correctly', async () => {
    render(
      <BrowserRouter>
        <Notifications />
      </BrowserRouter>
    );

    // Wait for notifications to load
    await waitFor(() => {
      expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
    });

    // Check if all notification types are displayed
    await waitFor(() => {
      expect(screen.getByText('Low Stock')).toBeInTheDocument();
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
      expect(screen.getByText('Expiry Warning (30 Days)')).toBeInTheDocument();
      expect(screen.getByText('Price Change')).toBeInTheDocument();
    });

    // Check severity badges
    await waitFor(() => {
      expect(screen.getAllByText('Warning').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Critical').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Info').length).toBeGreaterThan(0);
    });
  });

  test('auto-fill functionality works correctly', async () => {
    render(
      <BrowserRouter>
        <Notifications />
      </BrowserRouter>
    );

    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
    });

    // Find and click the auto-fill button for Amoxicillin
    const autoFillButtons = await screen.findAllByText('Auto-Fill');
    fireEvent.click(autoFillButtons[0]);

    // Check if success message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Successfully auto-filled/i)).toBeInTheDocument();
    });
  });
});
