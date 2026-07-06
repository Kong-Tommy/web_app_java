package com.shop.inventory.dto.customer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CustomerProfileUpdateRequest(
        @NotBlank @Size(min = 2, max = 255) String fullName,
        String phone,
        String address,
        String avatarUrl
) {
}
