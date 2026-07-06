package com.shop.inventory.service;

import com.shop.inventory.dto.auth.LoginRequest;
import com.shop.inventory.dto.auth.LoginResponse;
import com.shop.inventory.entity.StaffRole;
import com.shop.inventory.entity.SystemAccount;
import com.shop.inventory.exception.ApiException;
import com.shop.inventory.repository.SystemAccountRepository;
import com.shop.inventory.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final SystemAccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(SystemAccountRepository accountRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        SystemAccount account = accountRepository.findByEmail(request.email())
                .orElseThrow(() -> ApiException.authenticationError("Invalid email or password"));

        if (!Boolean.TRUE.equals(account.getIsActive())) {
            throw ApiException.authenticationError("Account is disabled");
        }

        if (!passwordEncoder.matches(request.password(), account.getPassword())) {
            throw ApiException.authenticationError("Invalid email or password");
        }

        StaffRole role = StaffRole.fromCode(account.getRole());
        if (role == StaffRole.OTHER) {
            // "Others roles: No token issued" theo de bai
            throw ApiException.authenticationError("This account role is not permitted to sign in");
        }

        String token = jwtUtil.generateToken(String.valueOf(account.getAccountId()), Map.of(
                "email", account.getEmail(),
                "type", "STAFF",
                "role", role.name()
        ));

        return new LoginResponse(token, role.name().toLowerCase());
    }
}
