package com.vibecoding.inventory;

import com.vibecoding.inventory.model.InventoryItem;
import com.vibecoding.inventory.repository.InventoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Seeds the database with sample inventory data at startup.
 */
@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner initDatabase(InventoryRepository repository) {
        return args -> {
            repository.save(new InventoryItem(null, "T-Shirt", "SKU001", "Apparel", 19.99, 15));
            repository.save(new InventoryItem(null, "Jeans", "SKU002", "Apparel", 39.99, 5));
            repository.save(new InventoryItem(null, "Sneakers", "SKU003", "Footwear", 59.99, 0));
            repository.save(new InventoryItem(null, "Hat", "SKU004", "Accessories", 9.99, 25));
        };
    }
}
