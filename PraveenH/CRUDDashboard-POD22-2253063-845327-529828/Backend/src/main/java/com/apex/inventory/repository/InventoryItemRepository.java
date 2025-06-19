package com.apex.inventory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apex.inventory.model.InventoryItem;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByNameContainingIgnoreCaseOrSkuContainingIgnoreCaseOrCategoryContainingIgnoreCase(String name, String sku, String category);
    List<InventoryItem> findByQuantityLessThan(int threshold);
    long countByQuantityLessThan(int threshold);
    long countByQuantityEquals(int quantity);
}
