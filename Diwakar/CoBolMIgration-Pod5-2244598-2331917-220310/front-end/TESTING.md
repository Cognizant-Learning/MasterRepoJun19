# End-to-End Testing with Cypress

This document provides instructions and information about the end-to-end testing setup for the Banking Application.

## Test Structure

The test suite is organized into several key categories:

1. **Balance Tests** (`balance.cy.js`) - Tests for viewing account balance
2. **Credit Tests** (`credit.cy.js`) - Tests for crediting/depositing funds
3. **Debit Tests** (`debit.cy.js`) - Tests for debiting/withdrawing funds
4. **Workflow Tests** (`workflow.cy.js`) - Tests for complete user workflows
5. **API Tests** (`api.cy.js`) - Tests that directly interact with the backend API
6. **Visual Tests** (`visual.cy.js`) - Tests focused on UI appearance and functionality
7. **Edge Cases** (`edge-cases.cy.js`) - Tests for boundary values and special cases

## Prerequisites

Before running tests, ensure that:

1. The Spring Boot backend is running at http://localhost:8080
2. MySQL database is running 
3. The React frontend is running at http://localhost:3000

## Running Tests

### Test Execution Modes

Cypress tests can be run in two modes:

1. **Headless mode** - Tests run in the background without a visible browser (best for CI/CD)
2. **Headed mode** - Tests run in a visible browser window (best for development/debugging)

For details on using headed mode, please see the [HEADED_TESTING.md](./HEADED_TESTING.md) document.

### Opening the Cypress Test Runner

To open the Cypress Test Runner UI:

```bash
npm run cypress:open
```

### Running All Tests

To run all tests in headless mode:

```bash
npm run test:all
```

### Running Specific Test Categories

```bash
# Headless Mode (no visible browser)
# API Tests only
npm run test:api

# UI Visual Tests only
npm run test:ui

# Balance Tests only
npm run test:balance

# Credit Operation Tests only
npm run test:credit

# Debit Operation Tests only
npm run test:debit

# Full Workflow Tests
npm run test:workflow

# Edge Cases and Boundary Tests
npm run test:edge

# Headed Mode (with visible browser)
# API Tests only
npm run test:api:headed

# UI Visual Tests only
npm run test:ui:headed

# Balance Tests only
npm run test:balance:headed

# Credit Operation Tests only
npm run test:credit:headed

# Debit Operation Tests only
npm run test:debit:headed
```

### Using the PowerShell Script for Headed Testing

For convenience, a PowerShell script provides an interactive menu to run headed tests:

```powershell
# Navigate to the banking-app directory
cd "path\to\banking-app"

# Run the script
.\Run-HeadedTests.ps1
```

### Running Tests with Both Frontend and Backend

To start the frontend server and run tests:

```bash
npm run test:e2e
```

## Test Coverage

The test suite covers the following aspects:

1. **Functional Testing** - Verifies all features work as expected
2. **API Testing** - Validates all backend endpoints
3. **Visual Testing** - Checks UI components and responsive behavior
4. **Edge Case Testing** - Tests boundary conditions and error handling
5. **Workflow Testing** - Tests complete user journeys

## Custom Cypress Commands

The test suite includes several custom commands to simplify testing:

- `cy.initializeAccount()` - Initializes an account for testing
- `cy.getAccountBalance()` - Gets the current account balance
- `cy.creditAccount(amount)` - Credits the account with the specified amount
- `cy.debitAccount(amount)` - Debits the account with the specified amount

## Test Data

Test data is managed through fixtures:

- `amounts.json` - Contains test amounts for various scenarios

## Troubleshooting

If tests are failing, verify:

1. The backend API is running at http://localhost:8080
2. The frontend application is running at http://localhost:3000
3. The database is properly initialized
4. Correct test data is available in the fixtures

## Extending Tests

To add new tests:

1. Create a new test file in the `cypress/e2e` folder
2. Use the existing custom commands and patterns
3. Add appropriate test scripts to `package.json`
