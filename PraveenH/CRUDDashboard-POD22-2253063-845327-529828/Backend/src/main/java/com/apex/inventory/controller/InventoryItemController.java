package com.apex.inventory.controller;

import com.apex.inventory.model.InventoryItem;
import com.apex.inventory.service.InventoryItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
@CrossOrigin
public class InventoryItemController {
    @Autowired
    private InventoryItemService service;

    @GetMapping
    public List<InventoryItem> getAllItems(@RequestParam(value = "search", required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return service.searchItems(search);
        }
        return service.getAllItems();
    }

    @GetMapping("/low-stock")
    public List<InventoryItem> getLowStockItems() {
        return service.getLowStockItems();
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(new StatsResponse(
                service.getTotalUniqueItems(),
                service.getLowStockCount(),
                service.getOutOfStockCount()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getItemById(@PathVariable Long id) {
        Optional<InventoryItem> item = service.getItemById(id);
        return item.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public InventoryItem createItem(@RequestBody InventoryItem item) {
        return service.createItem(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryItem> updateItem(@PathVariable Long id, @RequestBody InventoryItem item) {
        InventoryItem updated = service.updateItem(id, item);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        if (service.deleteItem(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // DTO for stats
    static class StatsResponse {
        public long totalUniqueItems;
        public long lowStockItems;
        public long outOfStockItems;
        public StatsResponse(long total, long low, long out) {
            this.totalUniqueItems = total;
            this.lowStockItems = low;
            this.outOfStockItems = out;
        }
    }
}
