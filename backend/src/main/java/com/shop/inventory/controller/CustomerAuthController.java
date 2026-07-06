package com.shop.inventory.controller;

import com.shop.inventory.dto.auth.CustomerRegisterRequest;
import com.shop.inventory.dto.auth.LoginRequest;
import com.shop.inventory.dto.auth.LoginResponse;
import com.shop.inventory.service.CustomerAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer/auth")
@Tag(name = "Customer Auth", description = "Register / login for storefront shoppers")
public class CustomerAuthController {

    private final CustomerAuthService customerAuthService;

    public CustomerAuthController(CustomerAuthService customerAuthService) {
        this.customerAuthService = customerAuthService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new shopper account")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody CustomerRegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerAuthService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login as a shopper")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(customerAuthService.login(request));
    }
}
