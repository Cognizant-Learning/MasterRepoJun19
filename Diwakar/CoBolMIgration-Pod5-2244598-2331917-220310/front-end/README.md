# Banking App - Frontend

This is the frontend React application for the Banking Management System.

## Prerequisites

- Node.js 14.x or higher
- npm or yarn

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

The application will be available at http://localhost:3000

## Features

- View current account balance
- Credit (deposit) funds to the account
- Debit (withdraw) funds from the account with insufficient funds validation
- Auto-initialize the account if it doesn't exist

## Components

- **App.js** - Main application component
- **AccountBalance.js** - Displays current balance
- **AccountOperations.js** - Handles credit and debit operations
- **AccountService.js** - API communication service

## API Integration

The application communicates with the Spring Boot backend at http://localhost:8080.
