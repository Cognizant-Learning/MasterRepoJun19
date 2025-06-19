# Intelligent Inventory Hub

A centralized dashboard for efficient inventory management.

## Project Overview

Intelligent Inventory Hub is a single-page web application designed to help business owners efficiently manage their inventory. The system provides a centralized dashboard with real-time inventory visibility and management capabilities.

## Features

- **Dashboard Interface** with key statistics and inventory table
- **Real-time Search and Filter** for quick item lookup
- **CRUD Operations** for inventory management
- **Low Stock Alerts** for proactive inventory management

## Tech Stack

### Frontend
- React
- TypeScript
- Redux Toolkit for state management
- Styled Components for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- RESTful API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm run install:all
```

### Configuration

1. Create a `.env` file in the server directory with the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/inventory-hub
NODE_ENV=development
```

### Running the Application

Start both the client and server concurrently:

```bash
npm start
```

This will start:
- React client on [http://localhost:3000](http://localhost:3000)
- Express server on [http://localhost:5000](http://localhost:5000)

## Project Structure

```
/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   ├── styles/         # Styled components
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── server/                 # Backend Express application
│   ├── controllers/        # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── config/             # Configuration files
│   ├── middleware/         # Express middleware
│   └── utils/              # Utility functions
└── .vscode/                # VS Code configuration
```

## License

This project is licensed under the ISC License.
