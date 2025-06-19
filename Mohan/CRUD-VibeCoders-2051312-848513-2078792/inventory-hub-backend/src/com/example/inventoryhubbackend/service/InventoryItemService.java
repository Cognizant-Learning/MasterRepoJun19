package com.example.inventoryhubbackend.service;

import com.example.inventoryhubbackend.model.InventoryItem;
import com.example.inventoryhubbackend.repository.InventoryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryItemService {
    @Autowired
    private InventoryItemRepository repository;

    public List<InventoryItem> getAllItems() {
        return repository.findAll();
    }

    public Optional<InventoryItem> getItem(Long id) {
        return repository.findById(id);
    }

    public InventoryItem createItem(InventoryItem item) {
        return repository.save(item);
    }

    public InventoryItem updateItem(Long id, InventoryItem item) {
        item.setId(id);
        return repository.save(item);
    }

    public void deleteItem(Long id) {
        repository.deleteById(id);
    }
}
