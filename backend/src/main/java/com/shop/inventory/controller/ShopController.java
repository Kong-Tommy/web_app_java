package com.shop.inventory.controller;

import com.shop.inventory.dto.category.CategoryResponse;
import com.shop.inventory.dto.product.ProductGroupByCategory;
import com.shop.inventory.dto.product.ProductResponse;
import com.shop.inventory.service.CategoryService;
import com.shop.inventory.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop")
@Tag(name = "Storefront", description = "Public browsing endpoints for the shop (no login required)")
public class ShopController {

    private final ProductService productService;
    private final CategoryService categoryService;

    public ShopController(ProductService productService, CategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }

    @GetMapping("/products")
    @Operation(summary = "Browse all products (public)")
    public ResponseEntity<List<ProductResponse>> browseProducts() {
        return ResponseEntity.ok(productService.findAll());
    }

    @GetMapping("/products/{id}")
    @Operation(summary = "View a product's detail (public)")
    public ResponseEntity<ProductResponse> viewProduct(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @GetMapping("/products/search")
    @Operation(summary = "Search products by name/category (public)")
    public ResponseEntity<List<ProductGroupByCategory>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer category) {
        return ResponseEntity.ok(productService.search(name, category));
    }

    @GetMapping("/categories")
    @Operation(summary = "List categories (public)")
    public ResponseEntity<List<CategoryResponse>> listCategories() {
        return ResponseEntity.ok(categoryService.findAll());
    }
}
