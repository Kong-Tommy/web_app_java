package com.shop.inventory.dto.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartItemRequest(
        @NotNull Integer productId,
        @NotNull @Min(1) Integer quantity
) {
}
