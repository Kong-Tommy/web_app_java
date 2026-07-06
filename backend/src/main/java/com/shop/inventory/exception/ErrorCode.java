package com.shop.inventory.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    INVALID_INPUT("PR40001", HttpStatus.BAD_REQUEST),
    AUTHENTICATION_ERROR("PR40101", HttpStatus.UNAUTHORIZED),
    NOT_AUTHORIZED("PR40301", HttpStatus.FORBIDDEN),
    NOT_FOUND("PR40401", HttpStatus.NOT_FOUND),
    SERVER_ERROR("PR50001", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String code;
    private final HttpStatus status;

    ErrorCode(String code, HttpStatus status) {
        this.code = code;
        this.status = status;
    }

    public String getCode() {
        return code;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
