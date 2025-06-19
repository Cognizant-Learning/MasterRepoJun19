/**
 * Startup script for Pharmacy Dashboard standalone mode
 * This script sets the API mode to standalone and then starts the React app
 */
import { ApiMode } from './src/config/api.config';

// Set localStorage to use standalone mode
localStorage.setItem('apiMode', ApiMode.STANDALONE_MOCK);

// Log that we're starting in standalone mode
console.log('🟢 Starting pharmacy dashboard in standalone mode (no server required)');

// Start the app normally by importing the entry point
require('./src/index.tsx');
