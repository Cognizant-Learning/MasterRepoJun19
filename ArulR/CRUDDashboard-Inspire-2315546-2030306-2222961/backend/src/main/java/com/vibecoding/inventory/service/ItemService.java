package com.vibecoding.inventory.service;

import com.vibecoding.inventory.dto.StatsDTO;
import com.vibecoding.inventory.exception.ResourceNotFoundException;
import com.vibecoding.inventory.exception.DuplicateSkuException;
import com.vibecoding.inventory.model.Item;
import com.vibecoding.inventory.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ItemService {
    
    private final ItemRepository itemRepository;
    private final ActivityLogService activityLogService;
    
    @Value("${low.stock.threshold:10}")
    private int lowStockThreshold;
    
    @Autowired
    public ItemService(ItemRepository itemRepository, ActivityLogService activityLogService) {
        this.itemRepository = itemRepository;
        this.activityLogService = activityLogService;
    }
    
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }
    
    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
    }
    
    @Transactional
    public Item createItem(Item item) {
        if (itemRepository.existsBySku(item.getSku())) {
            throw new DuplicateSkuException("SKU already exists: " + item.getSku());
        }
        
        Item savedItem = itemRepository.save(item);
        activityLogService.logActivity("Item '" + savedItem.getName() + "' created", savedItem.getId());
        return savedItem;
    }
    
    @Transactional
    public Item updateItem(Long id, Item itemDetails) {
        Item existingItem = getItemById(id);
        
        // Check for duplicate SKU only if SKU is different
        if (!existingItem.getSku().equals(itemDetails.getSku()) && 
            itemRepository.existsBySku(itemDetails.getSku())) {
            throw new DuplicateSkuException("SKU already exists: " + itemDetails.getSku());
        }
        
        // Update fields
        existingItem.setName(itemDetails.getName());
        existingItem.setSku(itemDetails.getSku());
        existingItem.setCategory(itemDetails.getCategory());
        existingItem.setPrice(itemDetails.getPrice());
        existingItem.setQuantity(itemDetails.getQuantity());
        
        // Don't overwrite the image URL if it's null in the update
        if (itemDetails.getImageUrl() != null) {
            existingItem.setImageUrl(itemDetails.getImageUrl());
        }
        
        Item updatedItem = itemRepository.save(existingItem);
        activityLogService.logActivity("Item '" + updatedItem.getName() + "' updated", updatedItem.getId());
        return updatedItem;
    }
    
    @Transactional
    public void deleteItem(Long id) {
        Item item = getItemById(id);
        itemRepository.deleteById(id);
        activityLogService.logActivity("Item '" + item.getName() + "' deleted", id);
    }
    
    public List<Item> getLowStockItems() {
        return itemRepository.findByQuantityLessThan(lowStockThreshold);
    }
    
    public StatsDTO getInventoryStats() {
        return new StatsDTO(
            itemRepository.countTotalItems(),
            itemRepository.countLowStockItems(lowStockThreshold),
            itemRepository.countOutOfStockItems()
        );
    }
    
    @Transactional
    public void bulkDeleteItems(List<Long> ids) {
        List<Item> itemsToDelete = itemRepository.findAllById(ids);
        
        if (itemsToDelete.isEmpty()) {
            throw new ResourceNotFoundException("No items found with the provided ids");
        }
        
        itemRepository.deleteAllById(ids);
        
        // Log each item deletion
        itemsToDelete.forEach(item -> 
            activityLogService.logActivity("Item '" + item.getName() + "' deleted (bulk)", item.getId()));
    }
    
    @Transactional
    public String uploadItemImage(Long id, MultipartFile file) throws IOException {
        // Get the item
        Item item = getItemById(id);
        
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
            throw new IllegalArgumentException("Only JPEG and PNG image formats are supported");
        }
        
        // Generate unique file name
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        
        // Create uploads directory if it doesn't exist
        Path uploadDir = Paths.get("uploads");
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }
        
        // Save file
        Path filePath = uploadDir.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        
        // Update item with image URL
        String imageUrl = "/uploads/" + fileName;
        item.setImageUrl(imageUrl);
        itemRepository.save(item);
        
        activityLogService.logActivity("Image uploaded for item '" + item.getName() + "'", item.getId());
        
        return imageUrl;
    }
}
