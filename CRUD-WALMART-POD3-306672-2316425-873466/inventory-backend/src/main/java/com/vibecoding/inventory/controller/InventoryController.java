package com.vibecoding.inventory.controller;

import com.vibecoding.inventory.model.InventoryItem;
import com.vibecoding.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for inventory management.
 */
@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InventoryController {
    private static final Logger logger = LoggerFactory.getLogger(InventoryController.class);
    private final InventoryService service;

    @GetMapping
    public List<InventoryItem> getAllItems() {
        logger.info("API: Get all inventory items");
        return service.getAllItems();
    }

    @GetMapping("/{id}")
    public InventoryItem getItemById(@PathVariable Long id) {
        logger.info("API: Get inventory item by id: {}", id);
        return service.getItemById(id);
    }

    @GetMapping("/search")
    public List<InventoryItem> searchItems(@RequestParam String query) {
        logger.info("API: Search inventory items with query: {}", query);
        return service.searchItems(query);
    }

    @PostMapping
    public ResponseEntity<InventoryItem> createItem(@Valid @RequestBody InventoryItem item) {
        logger.info("API: Create inventory item");
        InventoryItem created = service.createItem(item);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public InventoryItem updateItem(@PathVariable Long id, @Valid @RequestBody InventoryItem item) {
        logger.info("API: Update inventory item with id: {}", id);
        return service.updateItem(id, item);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        logger.info("API: Delete inventory item with id: {}", id);
        service.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/low-stock")
    public List<InventoryItem> getLowStockItems(@RequestParam(defaultValue = "10") int threshold) {
        logger.info("API: Get low stock items below threshold: {}", threshold);
        return service.getLowStockItems(threshold);
    }

    @GetMapping("/out-of-stock")
    public List<InventoryItem> getOutOfStockItems() {
        logger.info("API: Get out of stock items");
        return service.getOutOfStockItems();
    }
}
