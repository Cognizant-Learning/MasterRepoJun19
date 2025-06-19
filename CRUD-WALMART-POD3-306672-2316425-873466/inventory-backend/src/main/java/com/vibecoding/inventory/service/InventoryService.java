package com.vibecoding.inventory.service;

import com.vibecoding.inventory.model.InventoryItem;
import com.vibecoding.inventory.repository.InventoryRepository;
import com.vibecoding.inventory.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service layer for inventory operations.
 */
@Service
@RequiredArgsConstructor
public class InventoryService {
    private static final Logger logger = LoggerFactory.getLogger(InventoryService.class);
    private final InventoryRepository repository;

    public List<InventoryItem> getAllItems() {
        logger.info("Fetching all inventory items");
        return repository.findAll();
    }

    public InventoryItem getItemById(Long id) {
        logger.info("Fetching inventory item with id: {}", id);
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
    }

    public List<InventoryItem> searchItems(String query) {
        logger.info("Searching inventory items with query: {}", query);
        return repository.findByNameContainingIgnoreCaseOrSkuContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query, query);
    }

    @Transactional
    public InventoryItem createItem(@Valid InventoryItem item) {
        logger.info("Creating new inventory item: {}", item.getName());
        return repository.save(item);
    }

    @Transactional
    public InventoryItem updateItem(Long id, @Valid InventoryItem updatedItem) {
        logger.info("Updating inventory item with id: {}", id);
        InventoryItem item = getItemById(id);
        item.setName(updatedItem.getName());
        item.setSku(updatedItem.getSku());
        item.setCategory(updatedItem.getCategory());
        item.setPrice(updatedItem.getPrice());
        item.setQuantity(updatedItem.getQuantity());
        return repository.save(item);
    }

    @Transactional
    public void deleteItem(Long id) {
        logger.info("Deleting inventory item with id: {}", id);
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Item not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public List<InventoryItem> getLowStockItems(int threshold) {
        logger.info("Fetching items with quantity below threshold: {}", threshold);
        return repository.findByQuantityLessThan(threshold);
    }

    public List<InventoryItem> getOutOfStockItems() {
        logger.info("Fetching items out of stock");
        return repository.findByQuantity(0);
    }
}
