package com.shop.inventory.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shop.inventory.dto.ErrorResponse;
import com.shop.inventory.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RestAuthEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                          AuthenticationException authException) throws IOException {
        response.setStatus(ErrorCode.AUTHENTICATION_ERROR.getStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ErrorResponse body = new ErrorResponse(ErrorCode.AUTHENTICATION_ERROR.getCode(), "Authentication is required");
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
