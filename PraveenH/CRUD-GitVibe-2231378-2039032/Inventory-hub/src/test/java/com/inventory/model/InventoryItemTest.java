package com.inventory.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.math.BigDecimal;

class InventoryItemTest {

    @Test
    void testInventoryItemCreation() {
        InventoryItem item = new InventoryItem();
        item.setId(1L);
        item.setName("Test Item");
        item.setSku("TEST123");
        item.setCategory("Electronics");
        item.setQuantity(10);
        item.setPrice(new BigDecimal("99.99"));
        item.setLowStockThreshold(5);

        assertEquals(1L, item.getId());
        assertEquals("Test Item", item.getName());
        assertEquals("TEST123", item.getSku());
        assertEquals("Electronics", item.getCategory());
        assertEquals(10, item.getQuantity());
        assertEquals(new BigDecimal("99.99"), item.getPrice());
        assertEquals(5, item.getLowStockThreshold());
    }

    @Test
    void testInventoryItemEquality() {
        InventoryItem item1 = new InventoryItem();
        item1.setId(1L);
        item1.setName("Test Item");
        item1.setSku("TEST123");
        item1.setCategory("Electronics");

        InventoryItem item2 = new InventoryItem();
        item2.setId(1L);
        item2.setName("Test Item");
        item2.setSku("TEST123");
        item2.setCategory("Electronics");

        assertEquals(item1, item2);
        assertEquals(item1.hashCode(), item2.hashCode());
    }

    @Test
    void testInventoryItemToString() {
        InventoryItem item = new InventoryItem();
        item.setId(1L);
        item.setName("Test Item");
        item.setSku("TEST123");
        
        String toString = item.toString();
        assertTrue(toString.contains("1"));
        assertTrue(toString.contains("Test Item"));
        assertTrue(toString.contains("TEST123"));
    }
}
