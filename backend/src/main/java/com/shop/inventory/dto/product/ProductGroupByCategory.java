package com.shop.inventory.dto.product;

import java.util.List;

public record ProductGroupByCategory(
        Integer categoryId,
        String categoryName,
        List<ProductResponse> products
) {
}
