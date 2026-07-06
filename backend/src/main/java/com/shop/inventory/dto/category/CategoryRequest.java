package com.shop.inventory.dto.category;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
        @NotBlank String categoryName,
        String description
) {
}
