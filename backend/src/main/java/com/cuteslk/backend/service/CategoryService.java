package com.cuteslk.backend.service;

import com.cuteslk.backend.model.Category;
import com.cuteslk.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> listAll() {
        return categoryRepository.findAll();
    }

    public Optional<Category> findByName(String name) {
        return categoryRepository.findByName(name);
    }

    public Optional<Category> findByCode(String code) {
        return categoryRepository.findByCode(code);
    }

    public Category save(Category category) {
        return categoryRepository.save(category);
    }
}
