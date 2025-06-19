package com.inventory.repository;

import com.inventory.model.InventoryItem;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

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
        item.setDescription("Test Description");
        item.setQuantity(10);
        item.setPrice(99.99);

        InventoryItem savedItem = repository.save(item);
        assertNotNull(savedItem.getId());
        assertEquals("Test Item", savedItem.getName());
    }

    @Test
    void testFindByName() {
        InventoryItem item = new InventoryItem();
        item.setName("Unique Item");
        item.setQuantity(5);
        entityManager.persist(item);
        entityManager.flush();

        InventoryItem found = repository.findByName("Unique Item");
        assertNotNull(found);
        assertEquals(5, found.getQuantity());
    }

    @Test
    void testDeleteInventoryItem() {
        InventoryItem item = new InventoryItem();
        item.setName("Item to Delete");
        entityManager.persist(item);
        entityManager.flush();

        repository.deleteById(item.getId());
        InventoryItem found = repository.findById(item.getId()).orElse(null);
        assertNull(found);
    }
}
