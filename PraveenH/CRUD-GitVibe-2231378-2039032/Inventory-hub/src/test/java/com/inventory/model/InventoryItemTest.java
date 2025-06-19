package com.inventory.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class InventoryItemTest {

    @Test
    void testInventoryItemCreation() {
        InventoryItem item = new InventoryItem();
        item.setId(1L);
        item.setName("Test Item");
        item.setDescription("Test Description");
        item.setQuantity(10);
        item.setPrice(99.99);

        assertEquals(1L, item.getId());
        assertEquals("Test Item", item.getName());
        assertEquals("Test Description", item.getDescription());
        assertEquals(10, item.getQuantity());
        assertEquals(99.99, item.getPrice());
    }

    @Test
    void testInventoryItemEquality() {
        InventoryItem item1 = new InventoryItem();
        item1.setId(1L);
        item1.setName("Test Item");

        InventoryItem item2 = new InventoryItem();
        item2.setId(1L);
        item2.setName("Test Item");

        assertEquals(item1, item2);
        assertEquals(item1.hashCode(), item2.hashCode());
    }

    @Test
    void testInventoryItemToString() {
        InventoryItem item = new InventoryItem();
        item.setId(1L);
        item.setName("Test Item");
        
        String toString = item.toString();
        assertTrue(toString.contains("1"));
        assertTrue(toString.contains("Test Item"));
    }
}
