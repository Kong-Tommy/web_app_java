package com.shop.inventory.security;

public record AuthPrincipal(Integer id, String email, String type, String role) {
}
