package com.shop.inventory.controller;

import com.shop.inventory.dto.cart.CartItemRequest;
import com.shop.inventory.dto.cart.CartResponse;
import com.shop.inventory.security.AuthPrincipal;
import com.shop.inventory.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Cart", description = "Shopping cart for logged-in customers")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @Operation(summary = "View current customer's cart")
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal AuthPrincipal principal) {
        return ResponseEntity.ok(cartService.getCart(principal.id()));
    }

    @PostMapping("/items")
    @Operation(summary = "Add a product to the cart")
    public ResponseEntity<CartResponse> addItem(@AuthenticationPrincipal AuthPrincipal principal,
                                                 @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addItem(principal.id(), request));
    }

    @PutMapping("/items/{cartItemId}")
    @Operation(summary = "Update quantity of a cart item")
    public ResponseEntity<CartResponse> updateItem(@AuthenticationPrincipal AuthPrincipal principal,
                                                    @PathVariable Integer cartItemId,
                                                    @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.updateItem(principal.id(), cartItemId, request));
    }

    @DeleteMapping("/items/{cartItemId}")
    @Operation(summary = "Remove an item from the cart")
    public ResponseEntity<CartResponse> removeItem(@AuthenticationPrincipal AuthPrincipal principal,
                                                    @PathVariable Integer cartItemId) {
        return ResponseEntity.ok(cartService.removeItem(principal.id(), cartItemId));
    }
}
