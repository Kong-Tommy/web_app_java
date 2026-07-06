package com.shop.inventory.service;

import com.shop.inventory.dto.auth.CustomerRegisterRequest;
import com.shop.inventory.dto.auth.LoginRequest;
import com.shop.inventory.dto.auth.LoginResponse;
import com.shop.inventory.entity.Customer;
import com.shop.inventory.exception.ApiException;
import com.shop.inventory.repository.CustomerRepository;
import com.shop.inventory.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomerAuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public CustomerAuthService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse register(CustomerRegisterRequest request) {
        if (customerRepository.existsByEmail(request.email())) {
            throw ApiException.invalidInput("Email is already registered");
        }

        Customer customer = new Customer();
        customer.setFullName(request.fullName());
        customer.setEmail(request.email());
        customer.setPassword(passwordEncoder.encode(request.password()));
        customer.setPhone(request.phone());
        customer.setAddress(request.address());
        customer = customerRepository.save(customer);

        return buildToken(customer);
    }

    public LoginResponse login(LoginRequest request) {
        Customer customer = customerRepository.findByEmail(request.email())
                .orElseThrow(() -> ApiException.authenticationError("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), customer.getPassword())) {
            throw ApiException.authenticationError("Invalid email or password");
        }

        return buildToken(customer);
    }

    private LoginResponse buildToken(Customer customer) {
        String token = jwtUtil.generateToken(String.valueOf(customer.getCustomerId()), Map.of(
                "email", customer.getEmail(),
                "type", "CUSTOMER",
                "role", "CUSTOMER"
        ));
        return new LoginResponse(token, "customer");
    }
}
