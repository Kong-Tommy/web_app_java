package com.shop.inventory.dto.product;

import com.shop.inventory.dto.category.CategoryResponse;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProductResponse(
        Integer productId,
        String productName,
        String material,
        BigDecimal price,
        Integer quantity,
        LocalDate releaseDate,
        String imageUrl,
        CategoryResponse category
) {
}
