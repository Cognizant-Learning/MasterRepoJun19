import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Set window.API_MODE to standalone for tests
window.API_MODE = 'standalone';

// Mock API_CONFIG to use standalone mode
jest.mock('../config/api.config', () => ({
  ApiMode: {
    STANDALONE_MOCK: 'standalone',
    MSW_MOCK: 'msw',
    NODE_MOCK: 'node',
    REAL: 'real'
  },
  API_MODE: 'standalone',
  API_CONFIG: {
    useStandaloneMock: true,
    useMswMock: false,
    showMockIndicator: true,
    currentMode: 'standalone'
  }
}));

describe('Standalone Mode Integration', () => {
  test('should render the application with standalone data', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    
    // Wait for the app to load data
    await waitFor(() => {
      // Check for the standalone mode indicator
      expect(screen.getByText(/standalone mode/i)).toBeInTheDocument();
    });
  });
  
  test('should show inventory items from standalone mock', async () => {
    render(
      <MemoryRouter initialEntries={['/inventory']}>
        <App />
      </MemoryRouter>
    );
    
    // Wait for inventory items to load
    await waitFor(() => {
      // Check if at least some inventory items are rendered
      const itemElements = screen.getAllByTestId('inventory-item');
      expect(itemElements.length).toBeGreaterThan(0);
    });
  });
  
  test('should show notifications from standalone mock', async () => {
    render(
      <MemoryRouter initialEntries={['/notifications']}>
        <App />
      </MemoryRouter>
    );
    
    // Wait for notifications to load
    await waitFor(() => {
      // Check if at least some notifications are rendered
      const notificationElements = screen.getAllByTestId('notification-item');
      expect(notificationElements.length).toBeGreaterThan(0);
    });
  });
  
  test('should show analytics from standalone mock', async () => {
    render(
      <MemoryRouter initialEntries={['/analytics']}>
        <App />
      </MemoryRouter>
    );
    
    // Wait for analytics to load
    await waitFor(() => {
      // Check if analytics charts are rendered
      expect(screen.getByTestId('analytics-chart')).toBeInTheDocument();
    });
  });
});
