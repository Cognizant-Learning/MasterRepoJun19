# Requirements for Project Apex: The Intelligent Inventory Hub

## Tech Stack
- Backend: Spring Boot
- Frontend: Angular
- Database: MySQL
- UI Testing: Selenium with Cucumber and Maven
- API Testing: Rest Assured with Cucumber and Maven

---

## 1. Database Design (MySQL)

### Table: `items`
| Column      | Type         | Constraints                |
|-------------|--------------|----------------------------|
| id          | BIGINT       | PRIMARY KEY, AUTO_INCREMENT|
| name        | VARCHAR(100) | NOT NULL                   |
| sku         | VARCHAR(50)  | NOT NULL, UNIQUE           |
| category    | VARCHAR(50)  | NOT NULL                   |
| price       | DECIMAL(10,2)| NOT NULL, CHECK (price>=0) |
| quantity    | INT          | NOT NULL, CHECK (quantity>=0)|
| image_url   | VARCHAR(255) | NULL                       |
| created_at  | DATETIME     | DEFAULT CURRENT_TIMESTAMP  |
| updated_at  | DATETIME     | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### Table: `activity_log`
| Column      | Type         | Constraints                |
|-------------|--------------|----------------------------|
| id          | BIGINT       | PRIMARY KEY, AUTO_INCREMENT|
| action      | VARCHAR(255) | NOT NULL                   |
| item_id     | BIGINT       | NULL, FOREIGN KEY (item_id) REFERENCES items(id) |
| timestamp   | DATETIME     | DEFAULT CURRENT_TIMESTAMP  |

#### DDL Script
```sql
CREATE TABLE items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  sku VARCHAR(50) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  quantity INT NOT NULL CHECK (quantity >= 0),
  image_url VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE activity_log (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  action VARCHAR(255) NOT NULL,
  item_id BIGINT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id)
);
```

---

## 2. APIs to be Created (Spring Boot)

### Inventory Item APIs
- `GET /api/items` — List all inventory items
  - **Response:**
    ```json
    [
      {
        "id": 1,
        "name": "T-Shirt",
        "sku": "TSHIRT001",
        "category": "Apparel",
        "price": 19.99,
        "quantity": 50,
        "image_url": "..."
      }
    ]
    ```
  - **Invalid Scenarios:**
    - Internal server error: 
      ```json
      { "error": "Internal server error" }
      ```

- `GET /api/items/{id}` — Get details of a single item
  - **Response:**
    ```json
    {
      "id": 1,
      "name": "T-Shirt",
      "sku": "TSHIRT001",
      "category": "Apparel",
      "price": 19.99,
      "quantity": 50,
      "image_url": "..."
    }
    ```
  - **Invalid Scenarios:**
    - If the id is invalid or does not exist:
      ```json
      { "error": "Item not found" }
      ```
    - If the id is not a number:
      ```json
      { "error": "Invalid item id" }
      ```

- `POST /api/items` — Create a new inventory item
  - **Request:**
    ```json
    {
      "name": "T-Shirt",
      "sku": "TSHIRT001",
      "category": "Apparel",
      "price": 19.99,
      "quantity": 50
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "name": "T-Shirt",
      "sku": "TSHIRT001",
      "category": "Apparel",
      "price": 19.99,
      "quantity": 50,
      "image_url": null
    }
    ```
  - **Invalid Scenarios:**
    - Missing required fields or invalid data:
      ```json
      { "error": "Validation failed", "details": { "field": "error message" } }
      ```
    - Duplicate SKU:
      ```json
      { "error": "SKU already exists" }
      ```

- `PUT /api/items/{id}` — Update an existing item
  - **Request:**
    ```json
    {
      "name": "T-Shirt",
      "sku": "TSHIRT001",
      "category": "Apparel",
      "price": 18.99,
      "quantity": 40
    }
    ```
  - **Response:** (same as GET by id)
  - **Invalid Scenarios:**
    - If the id is invalid or does not exist:
      ```json
      { "error": "Item not found" }
      ```
    - Validation errors:
      ```json
      { "error": "Validation failed", "details": { "field": "error message" } }
      ```
    - Duplicate SKU:
      ```json
      { "error": "SKU already exists" }
      ```

- `DELETE /api/items/{id}` — Delete an item
  - **Response:**
    ```json
    { "message": "Item deleted successfully" }
    ```
  - **Invalid Scenarios:**
    - If the id is invalid or does not exist:
      ```json
      { "error": "Item not found" }
      ```

- `GET /api/items/low-stock` — List items below the low stock threshold
  - **Response:** (same as GET /api/items, filtered)
  - **Invalid Scenarios:**
    - Internal server error:
      ```json
      { "error": "Internal server error" }
      ```

- `GET /api/items/stats` — Get key stats
  - **Response:**
    ```json
    {
      "totalUniqueItems": 100,
      "lowStockItems": 5,
      "outOfStockItems": 2
    }
    ```
  - **Invalid Scenarios:**
    - Internal server error:
      ```json
      { "error": "Internal server error" }
      ```

- `POST /api/items/bulk-delete` — Bulk delete items
  - **Request:**
    ```json
    { "ids": [1, 2, 3] }
    ```
  - **Response:**
    ```json
    { "message": "Items deleted successfully" }
    ```
  - **Invalid Scenarios:**
    - Invalid or empty ids array:
      ```json
      { "error": "Invalid request" }
      ```
    - One or more ids do not exist:
      ```json
      { "error": "Some items not found", "notFoundIds": [2, 3] }
      ```

- `POST /api/items/{id}/image` — Upload product image
  - **Request:** multipart/form-data (file upload)
  - **Response:**
    ```json
    { "image_url": "..." }
    ```
  - **Invalid Scenarios:**
    - Invalid file type or size:
      ```json
      { "error": "Invalid file type or size" }
      ```
    - If the id is invalid or does not exist:
      ```json
      { "error": "Item not found" }
      ```

- `GET /api/activity-log` — Get recent activity log
  - **Response:**
    ```json
    [
      { "id": 1, "action": "Item 'T-Shirt' created", "item_id": 1, "timestamp": "2025-06-19T10:00:00Z" }
    ]
    ```
  - **Invalid Scenarios:**
    - Internal server error:
      ```json
      { "error": "Internal server error" }
      ```

---

## 3. UI Screens to be Developed (Angular)

- **Dashboard View**
  - Header with key stats
  - Inventory table (sortable, filterable, with search bar)
  - Visual highlight for low/out of stock items
- **Create Item Form**
- **Edit Item Form**
- **Delete Confirmation Dialog**
- **Bulk Operations UI (checkboxes, batch delete)**
- **Data Visualization (bar/pie chart for item categories)**
- **Image Upload UI (in create/edit forms)**
- **Activity Log Panel**

### Form Field Validations
- **Name:** Required, max 100 characters
- **SKU:** Required, max 50 characters, unique
- **Category:** Required, max 50 characters
- **Price:** Required, numeric, min 0
- **Quantity:** Required, integer, min 0
- **Image:** Optional, must be image file (jpg/png), max size 2MB

---

## 4. Test Cases to Cover (85%+ Code Coverage)

### Backend (Rest Assured + Cucumber + Maven)
- CRUD operations for inventory items (create, read, update, delete)
- Validation errors (missing fields, invalid data)
- Low stock alert logic (threshold checks)
- Stats endpoint (correct counts for unique, low, and out of stock)
- Bulk delete functionality
- Image upload endpoint (file type/size validation)
- Activity log endpoint
- Security/authentication (if implemented)
- Database integration tests (MySQL)

### Frontend (Selenium + Cucumber + Maven)
- Dashboard loads and displays correct stats
- Inventory table displays, sorts, and filters items
- Search bar filters table in real-time
- Create item form (happy path and validation errors)
- Edit item form (happy path and validation errors)
- Delete item (with confirmation)
- Low stock items are visually highlighted
- Bulk delete via checkboxes
- Data visualization renders correctly
- Image upload in create/edit forms
- Activity log panel updates with actions
- Responsive design and accessibility checks

---

This requirements document is based on the MVP and stretch goals described in `projectbrief.md` and is tailored for the specified tech stack. Update as needed for additional features or changes in scope.
