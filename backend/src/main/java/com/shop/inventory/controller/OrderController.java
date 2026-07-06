package com.shop.inventory.controller;

import com.shop.inventory.dto.order.OrderRequest;
import com.shop.inventory.dto.order.OrderResponse;
import com.shop.inventory.security.AuthPrincipal;
import com.shop.inventory.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Checkout and order history for logged-in customers")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Checkout the current cart and place an order")
    public ResponseEntity<OrderResponse> checkout(@AuthenticationPrincipal AuthPrincipal principal,
                                                   @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.checkout(principal.id(), request));
    }

    @GetMapping
    @Operation(summary = "List the current customer's orders")
    public ResponseEntity<List<OrderResponse>> myOrders(@AuthenticationPrincipal AuthPrincipal principal) {
        return ResponseEntity.ok(orderService.findByCustomer(principal.id()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get one of the current customer's orders by id")
    public ResponseEntity<OrderResponse> getOrder(@AuthenticationPrincipal AuthPrincipal principal,
                                                   @PathVariable Integer id) {
        return ResponseEntity.ok(orderService.findByIdForCustomer(principal.id(), id));
    }
}
