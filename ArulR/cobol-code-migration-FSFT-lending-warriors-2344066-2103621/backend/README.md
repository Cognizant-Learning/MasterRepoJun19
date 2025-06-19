# Banking API - Spring Boot Backend

This project is the backend API for the COBOL code migration project. It provides the necessary endpoints for handling customer management, transaction processing, and reporting functionality.

## Technologies Used

- Java 17
- Spring Boot 3.x
- Spring Security with JWT Authentication
- Spring Data JPA
- MySQL Database
- Flyway for Database Migrations
- Maven

## Project Structure

```
src/main/java/com/vibecoding/bankingapi
├── config            # Configuration classes
├── controller        # REST API controllers
├── dto               # Data Transfer Objects
├── exception         # Exception handling
├── model             # JPA Entities
├── repository        # Spring Data JPA Repositories
├── security          # Security configuration and JWT utilities
│   ├── jwt           # JWT implementation
│   └── services      # User details service implementation
├── service           # Service interfaces and implementations
│   └── impl          # Service implementations
└── BankingApiApplication.java  # Main application class
```

## API Endpoints

### Authentication API
- POST /api/auth/login - Login and get JWT token
- POST /api/auth/logout - Logout
- POST /api/auth/signup - Register new user
- GET /api/auth/user - Get current user details

### Customer API
- GET /api/customers - List all customers
- GET /api/customers/{id} - Get customer details by ID
- GET /api/customers/number/{customerNumber} - Get customer details by customer number
- POST /api/customers - Create new customer
- PUT /api/customers/{id} - Update customer
- DELETE /api/customers/{id} - Delete customer

### Transaction API
- GET /api/transactions - List all transactions
- GET /api/transactions/{id} - Get transaction details by ID
- GET /api/transactions/number/{transactionNumber} - Get transaction details by transaction number
- GET /api/transactions/account/{accountNumber} - Get transactions for an account
- GET /api/transactions/customer/{customerId} - Get transactions for a customer
- POST /api/transactions - Create new transaction
- PUT /api/transactions/{id}?status={status} - Update transaction status

### Report API
- GET /api/reports - List available reports
- GET /api/reports/type/{type} - Get reports by type
- GET /api/reports/{id} - Get specific report
- POST /api/reports - Create new report
- POST /api/reports/custom - Generate custom report
- GET /api/reports/export/{id}?format={format} - Export report in specified format

## Security

The API uses JWT tokens for authentication. The token must be included in the `Authorization` header for secured endpoints.

Example:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Getting Started

### Prerequisites
- Java 17 or later
- MySQL 8.0 or later
- Maven 3.6 or later

### Setting up the Database
1. Create a MySQL database called `banking_api_db` (or update the application.properties with your database name)
2. Configure the application.properties file with your MySQL credentials

### Running the Application
1. Clone the repository
2. Navigate to the project root
3. Build the project:
   ```
   mvn clean install
   ```
4. Run the application:
   ```
   mvn spring-boot:run
   ```

The server will start on port 8080 with context path `/api`.

## Testing the API

You can use tools like Postman or curl to test the API endpoints.

Example login request:
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Example response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "roles": ["ROLE_ADMIN"]
}
```
