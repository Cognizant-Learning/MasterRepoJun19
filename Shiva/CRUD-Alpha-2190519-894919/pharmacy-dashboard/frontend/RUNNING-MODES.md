# Pharmacy Dashboard Running Modes

The pharmacy dashboard can operate in several different modes depending on your development needs:

## 1. Standalone Mock Mode

**Description:**
- Complete independence from any backend server
- Mock API service runs entirely in the browser
- All data stored in memory during session
- Full CRUD operations and functionality

**How to start:**
```bash
npm run start:standalone
# OR
./start-standalone.bat
# OR
./start-standalone.ps1
```

**Best for:**
- Frontend development without backend dependencies
- Demonstrations and presentations
- Learning the application
- Testing UI components in isolation

## 2. MSW (Mock Service Worker) Mode

**Description:**
- Uses [MSW](https://mswjs.io/) to intercept and mock API requests
- Browser-based API mocking
- No server required
- Service worker intercepts network requests

**How to start:**
```bash
# First set API_MODE to MSW_MOCK in src/config/api.config.ts
# Then run:
npm start
```

**Best for:**
- Frontend development with realistic network behavior
- Testing request/response flows
- Developing with network request inspection

## 3. Node.js Mock Server Mode

**Description:**
- Uses a separate Node.js server for mocking API endpoints
- Runs on http://localhost:5000
- Simulates a real backend server
- Complete API implementation

**How to start:**
```bash
# First set API_MODE to NODE_MOCK in src/config/api.config.ts
# Then in one terminal:
node enhanced-mock-server.js
# And in another terminal:
npm start
```

**Best for:**
- Testing with network latency
- Development across separate frontend/backend
- Testing error conditions and edge cases

## 4. Real Backend Mode

**Description:**
- Uses the actual TypeScript/Node.js backend
- Connects to MongoDB database
- Full backend functionality

**How to start:**
```bash
# First set API_MODE to REAL in src/config/api.config.ts
# Then in one terminal:
cd backend
npm run build
npm start
# And in another terminal:
cd frontend
npm start
```

**Best for:**
- Full stack development
- Final testing before production
- Working with real data persistence

## Switching Between Modes

Edit `src/config/api.config.ts` and change the `API_MODE` variable to one of:
- `ApiMode.STANDALONE_MOCK` (Standalone Mock)
- `ApiMode.MSW_MOCK` (MSW Mock)
- `ApiMode.NODE_MOCK` (Node.js Mock Server)
- `ApiMode.REAL` (Real Backend)

Or use the dedicated startup scripts for each mode.
