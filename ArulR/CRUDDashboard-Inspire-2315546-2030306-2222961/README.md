# Intelligent Inventory Hub

A modern and intuitive dashboard for inventory management, built with Spring Boot and Angular.

## Overview

This application provides a central dashboard for business owners to manage their inventory effectively, with key features including:

- Dashboard with key inventory statistics
- Item management (CRUD operations)
- Low stock alerts
- Data visualization
- Activity logs
- Image upload capability
- Bulk operations

## Tech Stack

- **Backend**: Spring Boot 2.7.x, Java 11
- **Frontend**: Angular 16
- **Database**: MySQL
- **API Testing**: Rest Assured, Cucumber, JUnit
- **UI Testing**: Selenium, Cucumber (planned)

## Prerequisites

- Java 11+
- Node.js 16+
- MySQL 8.0+
- Maven 3.8+

## Setup and Installation

### Database Setup

1. Install MySQL if not already installed
2. Create a database named `inventory_hub`
3. The application will automatically create the required tables on startup

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Update database connection in `src/main/resources/application.properties` if necessary.

3. Build and run the Spring Boot application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. The backend server will start on port 8080.

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the Angular application:
   ```bash
   ng serve
   ```

4. The frontend application will be available at http://localhost:4200

## API Endpoints

### Items

- `GET /api/items` - List all items
- `GET /api/items/{id}` - Get item by ID
- `POST /api/items` - Create new item
- `PUT /api/items/{id}` - Update item
- `DELETE /api/items/{id}` - Delete item
- `GET /api/items/low-stock` - Get low stock items
- `GET /api/items/stats` - Get inventory statistics
- `POST /api/items/bulk-delete` - Delete multiple items
- `POST /api/items/{id}/image` - Upload item image

### Activity Log

- `GET /api/activity-log` - Get recent activity logs

## Testing

### Backend Tests

Run unit tests:
```bash
cd backend
mvn test
```

Run API tests with Cucumber:
```bash
cd backend
mvn test -Dtest=CucumberTestRunner
```

## License

MIT

## Acknowledgements

This project was created as part of the VibeCoding CRUD Dashboard requirements.
