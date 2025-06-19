package com.vibecoding.inventory.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for InventoryItem entity.
 */
class InventoryItemTest {
    @Test
    void testInventoryItemGettersSetters() {
        InventoryItem item = new InventoryItem();
        item.setId(1L);
        item.setName("Test");
        item.setSku("SKU100");
        item.setCategory("Cat");
        item.setPrice(10.0);
        item.setQuantity(5);

        assertEquals(1L, item.getId());
        assertEquals("Test", item.getName());
        assertEquals("SKU100", item.getSku());
        assertEquals("Cat", item.getCategory());
        assertEquals(10.0, item.getPrice());
        assertEquals(5, item.getQuantity());
    }

    @Test
    void testInventoryItemAllArgsConstructor() {
        InventoryItem item = new InventoryItem(2L, "Test2", "SKU200", "Cat2", 20.0, 10);
        assertEquals(2L, item.getId());
        assertEquals("Test2", item.getName());
        assertEquals("SKU200", item.getSku());
        assertEquals("Cat2", item.getCategory());
        assertEquals(20.0, item.getPrice());
        assertEquals(10, item.getQuantity());
    }
}
