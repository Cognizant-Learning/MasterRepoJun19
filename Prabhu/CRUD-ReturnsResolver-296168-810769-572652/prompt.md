# API Prompts for CRUD Dashboard

## Category Endpoints

### Get All Categories
```http
GET /api/inventory/stock/categories
```
Response:
```json
[
  {
    "id": 1,
    "name": "Electronics"
  },
  {
    "id": 2,
    "name": "Furniture"
  }
]
```

### Get Category by ID
```http
GET /api/inventory/stock/categories/{id}
```
Response:
```json
{
  "id": 1,
  "name": "Electronics"
}
```

### Create Category
```http
POST /api/inventory/stock/categories
Content-Type: application/json

{
  "name": "New Category"
}
```
Response:
```json
{
  "id": 3,
  "name": "New Category"
}
```

### Update Category
```http
PUT /api/inventory/stock/categories/{id}
Content-Type: application/json

{
  "name": "Updated Category"
}
```
Response:
```json
{
  "id": 1,
  "name": "Updated Category"
}
```

### Delete Category
```http
DELETE /api/inventory/stock/categories/{id}
```

## Product Endpoints

### Get All Products
```http
GET /api/inventory/stock/products
```
Response:
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "categoryId": 1,
    "price": 1299.99,
    "quantity": 15,
    "description": "High-performance gaming laptop",
    "image": "laptop.jpg"
  },
  {
    "id": 2,
    "name": "Office Chair",
    "categoryId": 2,
    "price": 199.99,
    "quantity": 30,
    "description": "Ergonomic office chair",
    "image": "chair.jpg"
  }
]
```

### Get Product by ID
```http
GET /api/inventory/stock/products/{id}
```
Response:
```json
{
  "id": 1,
  "name": "Laptop",
  "categoryId": 1,
  "price": 1299.99,
  "quantity": 15,
  "description": "High-performance gaming laptop",
  "image": "laptop.jpg"
}
```

### Create Product
```http
POST /api/inventory/stock/products
Content-Type: application/json

{
  "name": "New Product",
  "categoryId": 1,
  "price": 999.99,
  "quantity": 10,
  "description": "Product description",
  "image": "product.jpg"
}
```
Response:
```json
{
  "id": 3,
  "name": "New Product",
  "categoryId": 1,
  "price": 999.99,
  "quantity": 10,
  "description": "Product description",
  "image": "product.jpg"
}
```

### Update Product
```http
PUT /api/inventory/stock/products/{id}
Content-Type: application/json

{
  "name": "Updated Product",
  "categoryId": 1,
  "price": 1099.99,
  "quantity": 15,
  "description": "Updated description",
  "image": "updated.jpg"
}
```
Response:
```json
{
  "id": 1,
  "name": "Updated Product",
  "categoryId": 1,
  "price": 1099.99,
  "quantity": 15,
  "description": "Updated description",
  "image": "updated.jpg"
}
```

### Delete Product
```http
DELETE /api/inventory/stock/products/{id}
```

## Database Access

### H2 Console
```
URL: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:testdb
Username: sa
Password: password
```
