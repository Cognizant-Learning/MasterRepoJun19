# Banking Management System

This project is a migration from a COBOL banking application to a modern web application using Spring Boot, React, and MySQL.

## Architecture

The application follows a modern three-tier architecture:

1. **Frontend**: React-based user interface
2. **Backend**: Spring Boot REST API
3. **Database**: MySQL persistence layer

## Features

- View account balance
- Credit account (make deposits)
- Debit account (make withdrawals) with insufficient funds validation
- Automatically initializes with a default balance of 1000.00

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL Database
- Maven

### Frontend
- React 18
- React Bootstrap 2.8.0
- Axios for API communication
- Modern responsive UI

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd application/back-end/banking-api
   ```

2. Install dependencies and build the application:
   ```
   mvn clean install
   ```

3. Run the Spring Boot application:
   ```
   mvn spring-boot:run
   ```
   
   The API will be available at http://localhost:8080

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd application/front-end/banking-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm start
   ```

   The application will be available at http://localhost:3000

### Database Configuration

The application is configured to connect to a MySQL database with the following default configuration:

- URL: `jdbc:mysql://localhost:3306/banking_db`
- Username: `root`
- Password: `root`

You can adjust these settings in the `application.properties` file.

## API Endpoints

- GET `/api/accounts/{accountId}` - Get account balance
- POST `/api/accounts/{accountId}/credit` - Credit account
- POST `/api/accounts/{accountId}/debit` - Debit account
- POST `/api/accounts/initialize` - Initialize default account

## Testing

This application includes comprehensive end-to-end testing using Cypress. Tests can be run in both headless (background) mode or headed (visible browser) mode.

### Test Runner Scripts

The project includes convenient scripts for test execution:

- `Run-HeadedTests.ps1`: PowerShell menu to run tests with a visible browser
- `Run-HeadedTests.bat`: Batch file menu for Windows users who prefer CMD
- `Start-BankingApp.ps1`: PowerShell script to start the full stack and run tests

### Running Tests

For detailed information about running tests:

1. See the [TESTING.md](./front-end/banking-app/TESTING.md) file for general testing information
2. See the [HEADED_TESTING.md](./front-end/banking-app/HEADED_TESTING.md) file for headed testing specifics

## Original COBOL Structure

The application was migrated from a COBOL system with three components:

1. `MainProgram` - User interface and menu handling
2. `Operations` - Business logic for account operations
3. `DataProgram` - Data persistence
