package com.inventory.service;

import com.inventory.model.InventoryItem;
import com.inventory.repository.InventoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
        testItem.setQuantity(10);
    }

    @Test
    void testCreateInventoryItem() {
        when(repository.save(any(InventoryItem.class))).thenReturn(testItem);

        InventoryItem created = service.createInventoryItem(testItem);
        assertNotNull(created);
        assertEquals("Test Item", created.getName());
        verify(repository).save(any(InventoryItem.class));
    }

    @Test
    void testGetInventoryItem() {
        when(repository.findById(1L)).thenReturn(Optional.of(testItem));

        InventoryItem found = service.getInventoryItem(1L);
        assertNotNull(found);
        assertEquals(1L, found.getId());
    }

    @Test
    void testGetAllInventoryItems() {
        List<InventoryItem> items = Arrays.asList(testItem);
        when(repository.findAll()).thenReturn(items);

        List<InventoryItem> allItems = service.getAllInventoryItems();
        assertFalse(allItems.isEmpty());
        assertEquals(1, allItems.size());
    }

    @Test
    void testUpdateInventoryItem() {
        when(repository.findById(1L)).thenReturn(Optional.of(testItem));
        when(repository.save(any(InventoryItem.class))).thenReturn(testItem);

        InventoryItem updateItem = new InventoryItem();
        updateItem.setQuantity(20);
        
        InventoryItem updated = service.updateInventoryItem(1L, updateItem);
        assertNotNull(updated);
        verify(repository).save(any(InventoryItem.class));
    }

    @Test
    void testDeleteInventoryItem() {
        when(repository.findById(1L)).thenReturn(Optional.of(testItem));
        doNothing().when(repository).deleteById(1L);

        service.deleteInventoryItem(1L);
        verify(repository).deleteById(1L);
    }
}
