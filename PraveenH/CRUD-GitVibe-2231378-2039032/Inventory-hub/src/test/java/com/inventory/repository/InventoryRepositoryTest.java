package com.inventory.repository;

import com.inventory.model.InventoryItem;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class InventoryRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private InventoryRepository repository;

    @Test
    void testSaveInventoryItem() {
        InventoryItem item = new InventoryItem();
        item.setName("Test Item");
        item.setSku("TEST123");
        item.setCategory("Electronics");
        item.setQuantity(10);
        item.setPrice(new BigDecimal("99.99"));

        InventoryItem savedItem = repository.save(item);
        assertNotNull(savedItem.getId());
        assertEquals("Test Item", savedItem.getName());
        assertEquals("TEST123", savedItem.getSku());
        assertEquals("Electronics", savedItem.getCategory());
    }

    @Test
    void testFindByName() {
        InventoryItem item = new InventoryItem();
        item.setName("Unique Item");
        item.setSku("UNIQUE123");
        item.setCategory("Books");
        item.setQuantity(5);
        item.setPrice(new BigDecimal("49.99"));
        entityManager.persist(item);
        entityManager.flush();

        InventoryItem found = repository.findByName("Unique Item");
        assertNotNull(found);
        assertEquals(5, found.getQuantity());
        assertEquals("UNIQUE123", found.getSku());
        assertEquals("Books", found.getCategory());
    }

    @Test
    void testDeleteInventoryItem() {
        InventoryItem item = new InventoryItem();
        item.setName("Item to Delete");
        item.setSku("DELETE123");
        item.setCategory("Miscellaneous");
        item.setQuantity(1);
        item.setPrice(new BigDecimal("9.99"));
        entityManager.persist(item);
        entityManager.flush();

        repository.deleteById(item.getId());
        InventoryItem found = repository.findById(item.getId()).orElse(null);
        assertNull(found);
    }
}
