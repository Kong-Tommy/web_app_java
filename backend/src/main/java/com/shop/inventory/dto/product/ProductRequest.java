package com.shop.inventory.dto.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProductRequest(
        @NotNull
        @Pattern(regexp = "^[A-Z][a-zA-Z0-9\\s]{2,50}$",
                 message = "productName must start with an uppercase letter and be 3-51 characters (letters, digits, spaces)")
        String productName,

        String material,

        @NotNull @DecimalMin(value = "0.01", message = "price must be greater than 0")
        BigDecimal price,

        @NotNull @Min(value = 0, message = "quantity must be >= 0")
        Integer quantity,

        LocalDate releaseDate,

        String imageUrl,

        @NotNull(message = "categoryId is required")
        Integer categoryId
) {
}
