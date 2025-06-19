// API configuration options for the pharmacy dashboard
export enum ApiMode {
  // Use the MSW (Mock Service Worker) in-browser API mocking
  MSW_MOCK = 'msw',
  // Use the Node.js mock server running on localhost:5000
  NODE_MOCK = 'node',
  // Use the real backend server (requires MongoDB)
  REAL = 'real',
  // Use the standalone mock (no server or MSW required)
  STANDALONE_MOCK = 'standalone'
}

// Current API mode - change this to switch between modes
// Default to STANDALONE_MOCK for complete frontend independence
// Can be overridden by setting window.API_MODE
declare global {
  interface Window {
    API_MODE?: string;
    REACT_APP_API_URL?: string;
  }
}
export const API_MODE: ApiMode = 
  (window?.API_MODE as ApiMode) || ApiMode.STANDALONE_MOCK;

// API endpoints configuration
export const API_CONFIG = {  // Base URL for API requests
  baseUrl: API_MODE === ApiMode.REAL 
    ? (window?.REACT_APP_API_URL || 'http://localhost:5000/api')
    : API_MODE === ApiMode.NODE_MOCK
      ? 'http://localhost:5000/api'
      : '/api', // For MSW, use relative path

  // Whether to use MSW for mocking
  useMswMock: API_MODE === ApiMode.MSW_MOCK,
  
  // Whether to use standalone mock (no server required)
  useStandaloneMock: API_MODE === ApiMode.STANDALONE_MOCK,

  // Mock server status endpoint - used to check if the mock server is running
  mockServerStatusUrl: 'http://localhost:5000/',

  // Whether to show mock API indicator in UI
  showMockIndicator: API_MODE !== ApiMode.REAL,
  
  // Current API mode
  currentMode: API_MODE
};
