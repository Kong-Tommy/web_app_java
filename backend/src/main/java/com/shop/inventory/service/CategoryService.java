package com.shop.inventory.service;

import com.shop.inventory.dto.category.CategoryRequest;
import com.shop.inventory.dto.category.CategoryResponse;
import com.shop.inventory.entity.Category;
import com.shop.inventory.exception.ApiException;
import com.shop.inventory.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll().stream().map(this::toResponse).toList();
    }

    public CategoryResponse create(CategoryRequest request) {
        Category category = new Category();
        category.setCategoryName(request.categoryName());
        category.setDescription(request.description());
        return toResponse(categoryRepository.save(category));
    }

    public Category getEntity(Integer categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> ApiException.notFound("Category not found with id " + categoryId));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.getCategoryId(), category.getCategoryName(), category.getDescription());
    }
}
