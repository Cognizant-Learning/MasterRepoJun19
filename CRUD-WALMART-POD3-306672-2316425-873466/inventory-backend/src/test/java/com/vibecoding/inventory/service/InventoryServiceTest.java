package com.vibecoding.inventory.service;

import com.vibecoding.inventory.exception.ResourceNotFoundException;
import com.vibecoding.inventory.model.InventoryItem;
import com.vibecoding.inventory.repository.InventoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for InventoryService.
 */
class InventoryServiceTest {
    @Mock
    private InventoryRepository repository;
    @InjectMocks
    private InventoryService service;
    private InventoryItem item;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        item = new InventoryItem(1L, "Test", "SKU100", "Cat", 10.0, 5);
    }

    @Test
    void getAllItems() {
        when(repository.findAll()).thenReturn(Arrays.asList(item));
        List<InventoryItem> items = service.getAllItems();
        assertEquals(1, items.size());
    }

    @Test
    void getItemById_found() {
        when(repository.findById(1L)).thenReturn(Optional.of(item));
        InventoryItem found = service.getItemById(1L);
        assertEquals("Test", found.getName());
    }

    @Test
    void getItemById_notFound() {
        when(repository.findById(2L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getItemById(2L));
    }

    @Test
    void createItem() {
        when(repository.save(any())).thenReturn(item);
        InventoryItem created = service.createItem(item);
        assertEquals("Test", created.getName());
    }

    @Test
    void updateItem() {
        when(repository.findById(1L)).thenReturn(Optional.of(item));
        when(repository.save(any())).thenReturn(item);
        InventoryItem updated = service.updateItem(1L, item);
        assertEquals("Test", updated.getName());
    }

    @Test
    void deleteItem_found() {
        when(repository.existsById(1L)).thenReturn(true);
        doNothing().when(repository).deleteById(1L);
        assertDoesNotThrow(() -> service.deleteItem(1L));
    }

    @Test
    void deleteItem_notFound() {
        when(repository.existsById(2L)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> service.deleteItem(2L));
    }

    @Test
    void getLowStockItems() {
        when(repository.findByQuantityLessThan(10)).thenReturn(Arrays.asList(item));
        List<InventoryItem> items = service.getLowStockItems(10);
        assertEquals(1, items.size());
    }

    @Test
    void getOutOfStockItems() {
        when(repository.findByQuantity(0)).thenReturn(Arrays.asList(item));
        List<InventoryItem> items = service.getOutOfStockItems();
        assertEquals(1, items.size());
    }
}
