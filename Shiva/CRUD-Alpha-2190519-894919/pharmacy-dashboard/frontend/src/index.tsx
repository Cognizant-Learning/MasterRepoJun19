import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { API_CONFIG, ApiMode } from './config/api.config';

// Start the application with optional MSW mock or standalone mock
async function startApp() {
  // Determine API mode
  if (API_CONFIG.useStandaloneMock) {
    console.log('🟢 Using standalone mock API - no server required');
    
    // If in standalone mode, we don't need to start MSW or connect to a server
    // The mockApiService will be used directly from the inventoryApi
  }
  // If configured to use MSW mock API
  else if (API_CONFIG.useMswMock) {
    // Import and start the MSW worker
    try {
      console.log('🔶 Using MSW in-browser mock API');
      const { worker } = await import('./mocks/browser');
      await worker.start({
        onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
      });
    } catch (error) {
      console.error('Failed to start MSW mock:', error);
    }
  } else {
    console.log(`🔷 Using API endpoint: ${API_CONFIG.baseUrl}`);
  }
  
  // Render the app
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}
}

startApp();
