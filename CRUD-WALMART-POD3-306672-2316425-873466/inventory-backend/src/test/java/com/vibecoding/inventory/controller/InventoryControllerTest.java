package com.vibecoding.inventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibecoding.inventory.model.InventoryItem;
import com.vibecoding.inventory.repository.InventoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for InventoryController.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class InventoryControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private InventoryRepository repository;
    @Autowired
    private ObjectMapper objectMapper;

    private InventoryItem testItem;

    @BeforeEach
    void setup() {
        repository.deleteAll();
        testItem = repository.save(new InventoryItem(null, "Test", "SKU100", "TestCat", 10.0, 5));
    }

    @Test
    void testGetAllItems() throws Exception {
        mockMvc.perform(get("/api/inventory"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void testGetItemById() throws Exception {
        mockMvc.perform(get("/api/inventory/" + testItem.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Test")));
    }

    @Test
    void testSearchItems() throws Exception {
        mockMvc.perform(get("/api/inventory/search").param("query", "Test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].sku", is("SKU100")));
    }

    @Test
    void testCreateItem() throws Exception {
        InventoryItem item = new InventoryItem(null, "New", "SKU101", "Cat", 20.0, 10);
        mockMvc.perform(post("/api/inventory")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(item)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.sku", is("SKU101")));
    }

    @Test
    void testUpdateItem() throws Exception {
        testItem.setPrice(99.99);
        mockMvc.perform(put("/api/inventory/" + testItem.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testItem)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price", is(99.99)));
    }

    @Test
    void testDeleteItem() throws Exception {
        mockMvc.perform(delete("/api/inventory/" + testItem.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    void testLowStockItems() throws Exception {
        mockMvc.perform(get("/api/inventory/low-stock").param("threshold", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].sku", is("SKU100")));
    }

    @Test
    void testOutOfStockItems() throws Exception {
        testItem.setQuantity(0);
        repository.save(testItem);
        mockMvc.perform(get("/api/inventory/out-of-stock"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].sku", is("SKU100")));
    }
}
