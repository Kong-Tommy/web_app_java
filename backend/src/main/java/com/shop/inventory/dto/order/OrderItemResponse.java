package com.shop.inventory.dto.order;

import java.math.BigDecimal;

public record OrderItemResponse(
        Integer productId,
        String productName,
        BigDecimal price,
        Integer quantity,
        BigDecimal lineTotal
) {
}
