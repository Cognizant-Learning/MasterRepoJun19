package com.inventory.service;

import com.inventory.model.InventoryItem;
import com.inventory.repository.InventoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    public List<InventoryItem> getAllItems() {
        return inventoryRepository.findAll();
    }

    public InventoryItem getItemById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with id: " + id));
    }

    @Transactional
    public InventoryItem createItem(InventoryItem item) {
        if (inventoryRepository.existsBySku(item.getSku())) {
            throw new IllegalArgumentException("Item with SKU " + item.getSku() + " already exists");
        }
        return inventoryRepository.save(item);
    }

    @Transactional
    public InventoryItem updateItem(Long id, InventoryItem item) {
        InventoryItem existingItem = getItemById(id);
        
        // Check if new SKU conflicts with another item
        if (!existingItem.getSku().equals(item.getSku()) && inventoryRepository.existsBySku(item.getSku())) {
            throw new IllegalArgumentException("Item with SKU " + item.getSku() + " already exists");
        }

        existingItem.setName(item.getName());
        existingItem.setSku(item.getSku());
        existingItem.setCategory(item.getCategory());
        existingItem.setPrice(item.getPrice());
        existingItem.setQuantity(item.getQuantity());
        existingItem.setImageUrl(item.getImageUrl());
        existingItem.setLowStockThreshold(item.getLowStockThreshold());

        return inventoryRepository.save(existingItem);
    }

    @Transactional
    public void deleteItem(Long id) {
        if (!inventoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Item not found with id: " + id);
        }
        inventoryRepository.deleteById(id);
    }

    public List<InventoryItem> searchItems(String query) {
        return inventoryRepository.findByNameContainingIgnoreCaseOrSkuContainingIgnoreCase(query, query);
    }

    public List<InventoryItem> getItemsByCategory(String category) {
        return inventoryRepository.findByCategory(category);
    }

    public List<InventoryItem> getLowStockItems() {
        return inventoryRepository.findLowStockItems();
    }

    public List<InventoryItem> getOutOfStockItems() {
        return inventoryRepository.findOutOfStockItems();
    }


}
