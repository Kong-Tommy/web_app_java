package com.shop.inventory.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Integer orderId,
        Integer customerId,
        String customerName,
        String customerEmail,
        LocalDateTime orderDate,
        String status,
        String shippingAddress,
        String shippingPhone,
        BigDecimal totalAmount,
        List<OrderItemResponse> items
) {
}
