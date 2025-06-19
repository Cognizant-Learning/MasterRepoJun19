package com.vibecoding.inventory.controller;

import com.vibecoding.inventory.model.Item;
import com.vibecoding.inventory.service.ItemService;
import com.vibecoding.inventory.dto.StatsDTO;
import com.vibecoding.inventory.dto.BulkDeleteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {
    
    private final ItemService itemService;
    
    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }
    
    @GetMapping
    public List<Item> getAllItems() {
        return itemService.getAllItems();
    }
    
    @GetMapping("/{id}")
    public Item getItemById(@PathVariable Long id) {
        return itemService.getItemById(id);
    }
    
    @PostMapping
    public Item createItem(@Valid @RequestBody Item item) {
        return itemService.createItem(item);
    }
    
    @PutMapping("/{id}")
    public Item updateItem(@PathVariable Long id, @Valid @RequestBody Item item) {
        return itemService.updateItem(id, item);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Item deleted successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/low-stock")
    public List<Item> getLowStockItems() {
        return itemService.getLowStockItems();
    }
    
    @GetMapping("/stats")
    public StatsDTO getInventoryStats() {
        return itemService.getInventoryStats();
    }
    
    @PostMapping("/bulk-delete")
    public ResponseEntity<Map<String, String>> bulkDeleteItems(@RequestBody BulkDeleteDTO bulkDeleteDTO) {
        itemService.bulkDeleteItems(bulkDeleteDTO.getIds());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Items deleted successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{id}/image")
    public ResponseEntity<Map<String, String>> uploadItemImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        String imageUrl = itemService.uploadItemImage(id, file);
        
        Map<String, String> response = new HashMap<>();
        response.put("image_url", imageUrl);
        
        return ResponseEntity.ok(response);
    }
}
