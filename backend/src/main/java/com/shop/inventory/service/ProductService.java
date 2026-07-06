package com.shop.inventory.service;

import com.shop.inventory.dto.category.CategoryResponse;
import com.shop.inventory.dto.product.ProductGroupByCategory;
import com.shop.inventory.dto.product.ProductRequest;
import com.shop.inventory.dto.product.ProductResponse;
import com.shop.inventory.entity.Category;
import com.shop.inventory.entity.Product;
import com.shop.inventory.exception.ApiException;
import com.shop.inventory.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    public ProductService(ProductRepository productRepository, CategoryService categoryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }

    public List<ProductResponse> findAll() {
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProductResponse findById(Integer id) {
        return toResponse(getEntity(id));
    }

    public Product getEntity(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Product not found with id " + id));
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Category category = categoryService.getEntity(request.categoryId());
        Product product = new Product();
        applyRequest(product, request, category);
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Integer id, ProductRequest request) {
        Product product = getEntity(id);
        Category category = categoryService.getEntity(request.categoryId());
        applyRequest(product, request, category);
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(Integer id) {
        Product product = getEntity(id);
        productRepository.delete(product);
    }

    public List<ProductGroupByCategory> search(String name, Integer categoryId) {
        List<Product> products = productRepository.search(
                (name == null || name.isBlank()) ? null : name.trim(),
                categoryId);

        Map<Integer, ProductGroupByCategory> grouped = new LinkedHashMap<>();
        for (Product p : products) {
            Category category = p.getCategory();
            Integer key = category != null ? category.getCategoryId() : -1;
            grouped.computeIfAbsent(key, k -> new ProductGroupByCategory(
                    key,
                    category != null ? category.getCategoryName() : "Uncategorized",
                    new java.util.ArrayList<>()
            )).products().add(toResponse(p));
        }

        return grouped.values().stream()
                .sorted(Comparator.comparing(ProductGroupByCategory::categoryName))
                .toList();
    }

    private void applyRequest(Product product, ProductRequest request, Category category) {
        product.setProductName(request.productName());
        product.setMaterial(request.material());
        product.setPrice(request.price());
        product.setQuantity(request.quantity());
        product.setReleaseDate(request.releaseDate());
        product.setImageUrl(request.imageUrl());
        product.setCategory(category);
    }

    private ProductResponse toResponse(Product product) {
        CategoryResponse categoryResponse = null;
        if (product.getCategory() != null) {
            categoryResponse = new CategoryResponse(
                    product.getCategory().getCategoryId(),
                    product.getCategory().getCategoryName(),
                    product.getCategory().getDescription());
        }
        return new ProductResponse(
                product.getProductId(),
                product.getProductName(),
                product.getMaterial(),
                product.getPrice(),
                product.getQuantity(),
                product.getReleaseDate(),
                product.getImageUrl(),
                categoryResponse
        );
    }
}
