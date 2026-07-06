package com.shop.inventory.controller;

import com.shop.inventory.dto.auth.CustomerResponse;
import com.shop.inventory.dto.customer.CustomerProfileUpdateRequest;
import com.shop.inventory.security.AuthPrincipal;
import com.shop.inventory.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer/profile")
@Tag(name = "Customer Profile", description = "View / edit the logged-in customer's own profile")
public class CustomerProfileController {

    private final CustomerService customerService;

    public CustomerProfileController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    @Operation(summary = "Get current customer's profile")
    public ResponseEntity<CustomerResponse> getProfile(@AuthenticationPrincipal AuthPrincipal principal) {
        return ResponseEntity.ok(customerService.getProfile(principal.id()));
    }

    @PutMapping
    @Operation(summary = "Update current customer's profile (name, phone, address, avatar)")
    public ResponseEntity<CustomerResponse> updateProfile(@AuthenticationPrincipal AuthPrincipal principal,
                                                           @Valid @RequestBody CustomerProfileUpdateRequest request) {
        return ResponseEntity.ok(customerService.updateProfile(principal.id(), request));
    }
}
