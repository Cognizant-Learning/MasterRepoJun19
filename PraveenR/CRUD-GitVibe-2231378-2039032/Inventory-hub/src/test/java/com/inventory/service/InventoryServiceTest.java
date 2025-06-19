package com.inventory.service;

import com.inventory.model.InventoryItem;
import com.inventory.repository.InventoryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private InventoryRepository repository;

    @InjectMocks
    private InventoryService service;

    private InventoryItem testItem;

    @BeforeEach
    void setUp() {
        testItem = new InventoryItem();
        testItem.setId(1L);
        testItem.setName("Test Item");
        testItem.setSku("TEST123");
        testItem.setCategory("Electronics");
        testItem.setPrice(new BigDecimal("99.99"));
        testItem.setQuantity(10);
    }

    @Test
    void testCreateInventoryItem() {
        when(repository.save(any(InventoryItem.class))).thenReturn(testItem);

        InventoryItem created = service.createItem(testItem);
        assertNotNull(created);
        assertEquals("Test Item", created.getName());
        verify(repository).save(any(InventoryItem.class));
    }

    @Test
    void testGetAllInventoryItems() {
        List<InventoryItem> items = Arrays.asList(testItem);
        when(repository.findAll()).thenReturn(items);

        List<InventoryItem> allItems = service.getAllItems();
        assertFalse(allItems.isEmpty());
        assertEquals(1, allItems.size());
    }

    @Test
    void testUpdateInventoryItem() {
        when(repository.findById(1L)).thenReturn(Optional.of(testItem));
        when(repository.save(any(InventoryItem.class))).thenReturn(testItem);

        InventoryItem updateItem = new InventoryItem();
        updateItem.setName("Updated Item");
        updateItem.setSku("UPDATED123");
        updateItem.setCategory("Updated Category");
        updateItem.setPrice(new BigDecimal("199.99"));
        updateItem.setQuantity(20);

        InventoryItem updated = service.updateItem(1L, updateItem);
        assertNotNull(updated);
        assertEquals("Updated Item", updated.getName());
        assertEquals("UPDATED123", updated.getSku());
        assertEquals("Updated Category", updated.getCategory());
        assertEquals(new BigDecimal("199.99"), updated.getPrice());
        assertEquals(20, updated.getQuantity());
        verify(repository).save(any(InventoryItem.class));
    }

    @Test
    void testDeleteInventoryItem() {
        when(repository.existsById(1L)).thenReturn(true);
        doNothing().when(repository).deleteById(1L);

        assertDoesNotThrow(() -> service.deleteItem(1L));
        verify(repository).existsById(1L);
        verify(repository).deleteById(1L);
    }

    @Test
    void testDeleteInventoryItem_NotFound() {
        when(repository.existsById(1L)).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () -> service.deleteItem(1L));
        verify(repository).existsById(1L);
        verify(repository, never()).deleteById(any());
    }
}
