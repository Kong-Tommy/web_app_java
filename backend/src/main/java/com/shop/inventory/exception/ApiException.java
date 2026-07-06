package com.shop.inventory.exception;

import lombok.Getter;

@Getter
public class ApiException extends RuntimeException {

    private final ErrorCode errorCode;

    public ApiException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public static ApiException invalidInput(String message) {
        return new ApiException(ErrorCode.INVALID_INPUT, message);
    }

    public static ApiException authenticationError(String message) {
        return new ApiException(ErrorCode.AUTHENTICATION_ERROR, message);
    }

    public static ApiException notAuthorized(String message) {
        return new ApiException(ErrorCode.NOT_AUTHORIZED, message);
    }

    public static ApiException notFound(String message) {
        return new ApiException(ErrorCode.NOT_FOUND, message);
    }
}
