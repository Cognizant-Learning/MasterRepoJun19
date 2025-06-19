package com.vibecoding.inventory;

import com.vibecoding.inventory.model.InventoryItem;
import com.vibecoding.inventory.repository.InventoryRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;

import java.util.List;

/**
 * Integration tests for the Inventory backend application.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class VibeCodingCrudDashboardApplicationTests {

    //@LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private InventoryRepository repository;

    @Test
    void contextLoads() {
        // Application context loads successfully
    }

    @Test
    void testGetAllItems() {
        ResponseEntity<InventoryItem[]> response = restTemplate.getForEntity("/api/inventory", InventoryItem[].class);
        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
        Assertions.assertTrue(response.getBody().length >= 1);
    }

    @Test
    void testCreateAndDeleteItem() {
        InventoryItem newItem = new InventoryItem(null, "Test Product", "SKU999", "TestCat", 99.99, 10);
        ResponseEntity<InventoryItem> createResponse = restTemplate.postForEntity("/api/inventory", newItem, InventoryItem.class);
        Assertions.assertEquals(HttpStatus.CREATED, createResponse.getStatusCode());
        InventoryItem created = createResponse.getBody();
        Assertions.assertNotNull(created.getId());
        // Delete
        restTemplate.delete("/api/inventory/" + created.getId());
        Assertions.assertFalse(repository.existsById(created.getId()));
    }

    @Test
    void testUpdateItem() {
        List<InventoryItem> items = repository.findAll();
        InventoryItem item = items.get(0);
        item.setPrice(123.45);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<InventoryItem> entity = new HttpEntity<>(item, headers);
        ResponseEntity<InventoryItem> response = restTemplate.exchange("/api/inventory/" + item.getId(), HttpMethod.PUT, entity, InventoryItem.class);
        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
        Assertions.assertEquals(123.45, response.getBody().getPrice());
    }

    @Test
    void testLowStockAndOutOfStockEndpoints() {
        ResponseEntity<InventoryItem[]> lowStock = restTemplate.getForEntity("/api/inventory/low-stock?threshold=10", InventoryItem[].class);
        Assertions.assertEquals(HttpStatus.OK, lowStock.getStatusCode());
        ResponseEntity<InventoryItem[]> outOfStock = restTemplate.getForEntity("/api/inventory/out-of-stock", InventoryItem[].class);
        Assertions.assertEquals(HttpStatus.OK, outOfStock.getStatusCode());
    }
}
