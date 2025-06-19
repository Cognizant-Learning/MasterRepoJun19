package com.inventory.controller;

import com.inventory.model.InventoryItem;
import com.inventory.service.InventoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InventoryController.class)
class InventoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InventoryService service;

    @Autowired
    private ObjectMapper objectMapper;

    private InventoryItem testItem;

    @BeforeEach
    void setUp() {
        testItem = new InventoryItem();
        testItem.setId(1L);
        testItem.setName("Test Item");
        testItem.setSku("SKU123");
        testItem.setCategory("Electronics");
        testItem.setQuantity(10);
        testItem.setPrice(new BigDecimal("29.99"));
        testItem.setLowStockThreshold(5);
    }

    @Test
    void testCreateInventoryItem() throws Exception {
        when(service.createItem(any(InventoryItem.class))).thenReturn(testItem);

        mockMvc.perform(post("/api/inventory")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testItem)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Test Item"))
                .andExpect(jsonPath("$.quantity").value(10));
    }

    @Test
    void testGetInventoryItem() throws Exception {
        when(service.getInventoryItem(1L)).thenReturn(testItem);

        mockMvc.perform(get("/api/inventory/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Item"));
    }

    @Test
    void testGetAllInventoryItems() throws Exception {
        when(service.getAllItems()).thenReturn(Arrays.asList(testItem));

        mockMvc.perform(get("/api/inventory"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Item"))
                .andExpect(jsonPath("$[0].quantity").value(10));
    }

    @Test
    void testUpdateInventoryItem() throws Exception {
        InventoryItem updatedItem = new InventoryItem();
        updatedItem.setQuantity(20);
        
        when(service.updateItem(eq(1L), any(InventoryItem.class))).thenReturn(updatedItem);

        mockMvc.perform(put("/api/inventory/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedItem)))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteInventoryItem() throws Exception {
        mockMvc.perform(delete("/api/inventory/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testCreateInventoryItemValidation() throws Exception {
        // Test case 1: Missing required fields
        InventoryItem invalidItem = new InventoryItem();
        mockMvc.perform(post("/api/inventory")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidItem)))
                .andExpect(status().isBadRequest());

        // Test case 2: Invalid quantity
        InventoryItem invalidQuantityItem = new InventoryItem();
        invalidQuantityItem.setName("Test Item");
        invalidQuantityItem.setSku("SKU123");
        invalidQuantityItem.setCategory("Electronics");
        invalidQuantityItem.setQuantity(-1);
        invalidQuantityItem.setPrice(new BigDecimal("29.99"));

        mockMvc.perform(post("/api/inventory")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidQuantityItem)))
                .andExpect(status().isBadRequest());

        // Test case 3: Invalid price
        InventoryItem invalidPriceItem = new InventoryItem();
        invalidPriceItem.setName("Test Item");
        invalidPriceItem.setSku("SKU124");
        invalidPriceItem.setCategory("Electronics");
        invalidPriceItem.setQuantity(5);
        invalidPriceItem.setPrice(new BigDecimal("-10.0"));

        mockMvc.perform(post("/api/inventory")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidPriceItem)))
                .andExpect(status().isBadRequest());
    }
}
