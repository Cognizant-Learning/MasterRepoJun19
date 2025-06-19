package com.example.inventoryhubbackend.repository;

import com.example.inventoryhubbackend.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    // JpaRepository already provides: findAll(), findById(Long), save(InventoryItem), deleteById(Long)
    // No additional methods are needed for the current InventoryItemService methods.
    // If you want to add custom queries, you can define them here.
}
