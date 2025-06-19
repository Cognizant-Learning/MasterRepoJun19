package com.vibecoding.inventory.repository;

import com.vibecoding.inventory.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for InventoryItem entity.
 */
@Repository
public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByNameContainingIgnoreCaseOrSkuContainingIgnoreCaseOrCategoryContainingIgnoreCase(String name, String sku, String category);
    List<InventoryItem> findByQuantityLessThan(int threshold);
    List<InventoryItem> findByQuantity(int quantity);
}
