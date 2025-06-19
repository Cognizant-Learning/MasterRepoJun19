package com.vibecoding.inventory.repository;

import com.vibecoding.inventory.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByQuantityLessThan(Integer quantity);
    List<Item> findByQuantityEquals(Integer quantity);
    
    @Query("SELECT COUNT(i) FROM Item i")
    Long countTotalItems();
    
    @Query("SELECT COUNT(i) FROM Item i WHERE i.quantity < :threshold")
    Long countLowStockItems(Integer threshold);
    
    @Query("SELECT COUNT(i) FROM Item i WHERE i.quantity = 0")
    Long countOutOfStockItems();
    
    boolean existsBySku(String sku);
}
