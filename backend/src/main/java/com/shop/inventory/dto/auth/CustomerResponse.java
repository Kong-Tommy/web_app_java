package com.shop.inventory.dto.auth;

public record CustomerResponse(Integer customerId, String fullName, String email, String phone, String address,
                                String avatarUrl) {
}
