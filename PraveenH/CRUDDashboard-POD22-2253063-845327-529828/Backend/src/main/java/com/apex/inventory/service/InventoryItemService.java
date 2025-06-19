package com.apex.inventory.service;

import com.apex.inventory.model.InventoryItem;
import com.apex.inventory.repository.InventoryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryItemService {
    private static final int LOW_STOCK_THRESHOLD = 10;

    @Autowired
    private InventoryItemRepository repository;

    public List<InventoryItem> getAllItems() {
        return repository.findAll();
    }

    public Optional<InventoryItem> getItemById(Long id) {
        return repository.findById(id);
    }

    public InventoryItem createItem(InventoryItem item) {
        return repository.save(item);
    }

    public InventoryItem updateItem(Long id, InventoryItem updatedItem) {
        return repository.findById(id).map(item -> {
            item.setName(updatedItem.getName());
            item.setSku(updatedItem.getSku());
            item.setCategory(updatedItem.getCategory());
            item.setPrice(updatedItem.getPrice());
            item.setQuantity(updatedItem.getQuantity());
            return repository.save(item);
        }).orElse(null);
    }

    public boolean deleteItem(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<InventoryItem> searchItems(String query) {
        return repository.findByNameContainingIgnoreCaseOrSkuContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query, query);
    }

    public List<InventoryItem> getLowStockItems() {
        return repository.findByQuantityLessThan(LOW_STOCK_THRESHOLD);
    }

    public long getTotalUniqueItems() {
        return repository.count();
    }

    public long getLowStockCount() {
        return repository.countByQuantityLessThan(LOW_STOCK_THRESHOLD);
    }

    public long getOutOfStockCount() {
        return repository.countByQuantityEquals(0);
    }
}
