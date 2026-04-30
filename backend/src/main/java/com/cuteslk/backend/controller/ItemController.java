package com.cuteslk.backend.controller;

import com.cuteslk.backend.dto.ItemColorDto;
import com.cuteslk.backend.dto.ItemDto;
import com.cuteslk.backend.dto.ItemRequest;
import com.cuteslk.backend.model.Category;
import com.cuteslk.backend.model.Item;
import com.cuteslk.backend.model.ItemColor;
import com.cuteslk.backend.service.CategoryService;
import com.cuteslk.backend.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;
    private final CategoryService categoryService;

    public ItemController(ItemService itemService, CategoryService categoryService) {
        this.itemService = itemService;
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<ItemDto> listItems() {
        return itemService.listAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ItemDto> createItem(@Validated @RequestBody ItemRequest request) {
        Category category = categoryService.findByName(request.getCategory())
                .orElseGet(() -> categoryService.save(new Category(request.getCategory().trim(), request.getCategoryCode().trim().toUpperCase())));
        Item item;
        if (request.getId() != null) {
            item = itemService.findById(request.getId())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Item not found"));
            item.setTitle(request.getTitle().trim());
            item.setCategory(category.getName());
            item.setCategoryCode(category.getCode());
            item.setPrice(request.getPrice());
            item.setImage(request.getImage());
            item.setColors(toColors(request.getColors()));
        } else {
            item = new Item(
                    request.getCode().trim(),
                    request.getTitle().trim(),
                    category.getName(),
                    category.getCode(),
                    request.getPrice(),
                    request.getImage(),
                    toColors(request.getColors())
            );
        }

        item = itemService.save(item);
        return ResponseEntity.ok(toDto(item));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ItemDto> updateItem(@PathVariable("id") Long id, @Validated @RequestBody ItemRequest request) {
        return updateItemInternal(id, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/update")
    public ResponseEntity<ItemDto> updateItemViaPost(@PathVariable("id") Long id, @Validated @RequestBody ItemRequest request) {
        return updateItemInternal(id, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/save-changes")
    public ResponseEntity<ItemDto> updateItemByPayload(@Validated @RequestBody ItemDto dto) {
        ItemRequest request = new ItemRequest();
        request.setCode(dto.getCode());
        request.setTitle(dto.getTitle());
        request.setCategory(dto.getCategory());
        request.setCategoryCode(dto.getCategoryCode());
        request.setPrice(dto.getPrice());
        request.setImage(dto.getImage());
        request.setColors(dto.getColors());
        return updateItemInternal(dto.getId(), request);
    }

    private ResponseEntity<ItemDto> updateItemInternal(Long id, ItemRequest request) {
        Item existing = itemService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Item not found"));

        Category category = categoryService.findByName(request.getCategory())
                .orElseGet(() -> categoryService.save(new Category(request.getCategory().trim(), request.getCategoryCode().trim().toUpperCase())));

        existing.setTitle(request.getTitle().trim());
        existing.setCategory(category.getName());
        existing.setCategoryCode(category.getCode());
        existing.setPrice(request.getPrice());
        existing.setImage(request.getImage());
        existing.setColors(toColors(request.getColors()));

        Item saved = itemService.save(existing);
        return ResponseEntity.ok(toDto(saved));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable("id") Long id) {
        return deleteItemInternal(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/delete")
    public ResponseEntity<Void> deleteItemViaPost(@PathVariable("id") Long id) {
        return deleteItemInternal(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/delete")
    public ResponseEntity<Void> deleteItemByPayload(@RequestBody ItemDto dto) {
        return deleteItemInternal(dto.getId());
    }

    private ResponseEntity<Void> deleteItemInternal(Long id) {
        Item existing = itemService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Item not found"));
        itemService.deleteById(existing.getId());
        return ResponseEntity.noContent().build();
    }

    private ItemDto toDto(Item item) {
        return new ItemDto(
                item.getId(),
                item.getCode(),
                item.getTitle(),
                item.getCategory(),
                item.getCategoryCode(),
                item.getPrice(),
                item.getImage(),
                item.getColors().stream().map(this::toDto).collect(Collectors.toList())
        );
    }

    private ItemColorDto toDto(ItemColor color) {
        return new ItemColorDto(color.getName(), color.getQty());
    }

    private List<ItemColor> toColors(List<ItemColorDto> colors) {
        return colors == null ? List.of() : colors.stream()
                .map(color -> new ItemColor(color.getName(), color.getQty()))
                .collect(Collectors.toList());
    }
}
