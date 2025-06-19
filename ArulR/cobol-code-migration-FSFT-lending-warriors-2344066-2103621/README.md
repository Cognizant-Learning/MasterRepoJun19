# COBOL to Modern Banking Application Migration

This project is a migration of a legacy COBOL banking system to a modern full-stack application, using:
- Backend: Spring Boot, Spring Security, and MySQL
- Frontend: Angular with Angular Material

## Project Structure

### Backend
- Java Spring Boot application
- REST API endpoints
- JWT Authentication
- MySQL database with Flyway migrations

### Frontend
- Angular 16 application
- Angular Material UI components
- Authentication and protected routes
- Responsive dashboard

## Database Schema

The application includes the following main entities:
- User: Authentication and authorization
- Role: User roles and permissions
- Customer: Banking customer information
- Account: Bank account details
- Transaction: Financial transactions
- Report: Generated reports

## Setup and Installation

### Prerequisites
- Java JDK 17 or higher
- Maven
- Node.js and npm
- MySQL database

### Running the Application

1. **Using the script:**
   ```
   run-application.bat
   ```

2. **Manually:**
   - Backend:
     ```
     cd backend
     mvn clean install
     mvn spring-boot:run
     ```
   - Frontend:
     ```
     cd frontend
     npm install
     npm start
     ```

3. Access the application at:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8080/api

## API Endpoints

### Authentication
- POST /api/auth/login - Login and receive JWT token
- POST /api/auth/logout - Logout

### Customer Management
- GET /api/customers - Get all customers
- GET /api/customers/{id} - Get customer by ID
- POST /api/customers - Create new customer
- PUT /api/customers/{id} - Update customer
- DELETE /api/customers/{id} - Delete customer

### Account Management
- GET /api/accounts - Get all accounts
- GET /api/accounts/{id} - Get account by ID
- GET /api/customers/{id}/accounts - Get customer accounts
- POST /api/accounts - Create new account
- PUT /api/accounts/{id} - Update account
- DELETE /api/accounts/{id} - Delete account

### Transaction Management
- GET /api/transactions - Get all transactions
- GET /api/transactions/{id} - Get transaction by ID
- GET /api/accounts/{id}/transactions - Get account transactions
- POST /api/transactions - Create new transaction

### Reports
- GET /api/reports - Get all reports
- GET /api/reports/{id} - Get report by ID
- POST /api/reports - Generate new report
