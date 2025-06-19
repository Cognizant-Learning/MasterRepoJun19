# Banking API - Backend

This is the backend API for the Banking Management System, built with Spring Boot.

## Prerequisites

- Java 17 or higher
- Maven
- MySQL

## Setup

1. Ensure MySQL is running
2. Update `src/main/resources/application.properties` if needed to match your MySQL configuration
3. Build and run the application:

```bash
mvn spring-boot:run
```

## API Endpoints

### Account Balance
- **GET** `/api/accounts/{accountId}`
- Returns the current balance for the specified account

### Credit Account
- **POST** `/api/accounts/{accountId}/credit`
- Request body: `{ "amount": 100.00 }`
- Adds the specified amount to the account balance

### Debit Account
- **POST** `/api/accounts/{accountId}/debit`
- Request body: `{ "amount": 50.00 }`
- Subtracts the specified amount from the account balance if sufficient funds are available

### Initialize Account
- **POST** `/api/accounts/initialize`
- Creates a new account with the default balance of 1000.00

## Error Handling

- Insufficient funds error when attempting to debit more than available balance
- Account not found error when attempting to access a non-existent account
