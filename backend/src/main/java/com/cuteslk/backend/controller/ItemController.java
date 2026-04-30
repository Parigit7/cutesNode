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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

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

        Item item = new Item(
                request.getCode().trim(),
                request.getTitle().trim(),
                category.getName(),
                category.getCode(),
                request.getPrice(),
                request.getImage(),
                toColors(request.getColors())
        );

        item = itemService.save(item);
        return ResponseEntity.ok(toDto(item));
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
