# Inventory Backend Project Structure

- src/main/java/com/vibecoding/inventory/
  - VibeCodingCrudDashboardApplication.java (main Spring Boot app)
  - DataSeeder.java (optional: seeds initial data)
  - model/InventoryItem.java (JPA entity)
  - repository/InventoryRepository.java (Spring Data JPA repository)
  - service/InventoryService.java (business logic, logging, validation)
  - controller/InventoryController.java (REST API)
  - exception/ResourceNotFoundException.java (custom exception)
  - exception/GlobalExceptionHandler.java (global error handling)
- src/main/resources/application.properties (H2 config, logging)

All files include JavaDoc, logging, and exception handling as per requirements. To build and run:

```
cd inventory-backend
mvn clean install
mvn spring-boot:run
```

The backend will be available at http://localhost:8080/api/inventory

H2 console: http://localhost:8080/h2-console (JDBC URL: jdbc:h2:mem:inventorydb)
