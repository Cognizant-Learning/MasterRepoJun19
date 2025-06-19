package com.vibecoding.inventory.controller;

import com.vibecoding.inventory.model.Item;
import com.vibecoding.inventory.service.ItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class ItemControllerTest {

    @Mock
    private ItemService itemService;

    @InjectMocks
    private ItemController itemController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(itemController).build();
    }

    @Test
    void getAllItems_ShouldReturnItemList() throws Exception {
        // Setup
        Item item1 = new Item();
        item1.setId(1L);
        item1.setName("Test Item 1");
        item1.setSku("TEST-1");
        item1.setCategory("Test Category");
        item1.setPrice(new BigDecimal("19.99"));
        item1.setQuantity(10);

        Item item2 = new Item();
        item2.setId(2L);
        item2.setName("Test Item 2");
        item2.setSku("TEST-2");
        item2.setCategory("Test Category");
        item2.setPrice(new BigDecimal("29.99"));
        item2.setQuantity(5);

        List<Item> expectedItems = Arrays.asList(item1, item2);

        when(itemService.getAllItems()).thenReturn(expectedItems);

        // Execute & Verify
        mockMvc.perform(get("/api/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("Test Item 1")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].name", is("Test Item 2")));

        verify(itemService, times(1)).getAllItems();
    }

    // Additional tests would go here...
}
