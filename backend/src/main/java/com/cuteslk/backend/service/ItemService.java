package com.cuteslk.backend.service;

import com.cuteslk.backend.model.Item;
import com.cuteslk.backend.model.ItemColor;
import com.cuteslk.backend.repository.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ItemService {

    private final ItemRepository itemRepository;
    private final jakarta.persistence.EntityManager entityManager;

    public ItemService(ItemRepository itemRepository, jakarta.persistence.EntityManager entityManager) {
        this.itemRepository = itemRepository;
        this.entityManager = entityManager;
    }

    public void refresh(Item item) {
        entityManager.flush();
        entityManager.refresh(item);
    }

    public List<Item> listAll() {
        return itemRepository.findAll();
    }

    public Optional<Item> findById(Long id) {
        return itemRepository.findById(id);
    }

    public Item save(Item item) {
        return itemRepository.save(item);
    }

    public void deleteById(Long id) {
        itemRepository.deleteById(id);
    }

    public Item adjustQuantity(Long itemId, String colorName, int quantityChange) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        String trimmedColor = colorName != null ? colorName.trim() : "";
        
        // Check current quantity first to be safe
        ItemColor colorMatch = item.getColors().stream()
                .filter(c -> c.getName().trim().equalsIgnoreCase(trimmedColor))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Color '" + colorName + "' not found for item: " + item.getCode()));

        if (colorMatch.getQty() < quantityChange) {
            throw new RuntimeException("Insufficient quantity for color: " + colorName + ". Available: " + colorMatch.getQty());
        }

        // Use native query to update the DB directly
        int updatedRows = itemRepository.adjustQuantityNative(itemId, colorMatch.getName(), quantityChange);
        if (updatedRows == 0) {
            throw new RuntimeException("Failed to update quantity in database for color: " + colorName);
        }
        
        // Refresh to get updated values into the L1 cache
        refresh(item);
        return item;
    }

    public Item restoreQuantity(Long itemId, String colorName, int quantityToRestore) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        String trimmedColor = colorName != null ? colorName.trim() : "";
        
        // Find the actual color name from the DB to be sure
        Optional<ItemColor> colorMatch = item.getColors().stream()
                .filter(c -> c.getName().trim().equalsIgnoreCase(trimmedColor))
                .findFirst();

        if (colorMatch.isPresent()) {
            itemRepository.restoreQuantityNative(itemId, colorMatch.get().getName(), quantityToRestore);
            refresh(item);
        }
        
        return item;
    }
}
