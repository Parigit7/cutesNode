package com.cuteslk.backend.controller;

import com.cuteslk.backend.dto.CategoryDto;
import com.cuteslk.backend.model.Category;
import com.cuteslk.backend.service.CategoryService;
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
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryDto> listCategories() {
        return categoryService.listAll().stream()
                .map(category -> new CategoryDto(category.getId(), category.getName(), category.getCode()))
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Validated @RequestBody CategoryDto dto) {
        Category category = new Category(dto.getName().trim(), dto.getCode().trim().toUpperCase());
        category = categoryService.save(category);
        return ResponseEntity.ok(new CategoryDto(category.getId(), category.getName(), category.getCode()));
    }
}
