package com.inventory.repository;

import com.inventory.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    boolean existsBySku(String sku);
    
    List<InventoryItem> findByCategory(String category);
    
    @Query("SELECT i FROM InventoryItem i WHERE i.quantity <= i.lowStockThreshold AND i.quantity > 0")
    List<InventoryItem> findLowStockItems();
    
    @Query("SELECT i FROM InventoryItem i WHERE i.quantity = 0")
    List<InventoryItem> findOutOfStockItems();
    
    List<InventoryItem> findByNameContainingIgnoreCaseOrSkuContainingIgnoreCase(String name, String sku);
}
