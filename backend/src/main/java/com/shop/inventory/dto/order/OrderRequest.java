package com.shop.inventory.dto.order;

import jakarta.validation.constraints.NotBlank;

public record OrderRequest(
        @NotBlank String shippingAddress,
        @NotBlank String shippingPhone
) {
}
