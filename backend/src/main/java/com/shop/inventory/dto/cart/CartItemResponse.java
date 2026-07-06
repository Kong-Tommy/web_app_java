package com.shop.inventory.dto.cart;

import com.shop.inventory.dto.product.ProductResponse;

import java.math.BigDecimal;

public record CartItemResponse(
        Integer cartItemId,
        ProductResponse product,
        Integer quantity,
        BigDecimal lineTotal
) {
}
