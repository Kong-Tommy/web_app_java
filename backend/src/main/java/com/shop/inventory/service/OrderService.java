package com.shop.inventory.service;

import com.shop.inventory.dto.order.OrderItemResponse;
import com.shop.inventory.dto.order.OrderRequest;
import com.shop.inventory.dto.order.OrderResponse;
import com.shop.inventory.entity.*;
import com.shop.inventory.exception.ApiException;
import com.shop.inventory.repository.CartItemRepository;
import com.shop.inventory.repository.OrderRepository;
import com.shop.inventory.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CustomerService customerService;

    public OrderService(OrderRepository orderRepository, CartItemRepository cartItemRepository,
                         ProductRepository productRepository, CustomerService customerService) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.customerService = customerService;
    }

    @Transactional
    public OrderResponse checkout(Integer customerId, OrderRequest request) {
        Customer customer = customerService.getEntity(customerId);
        List<CartItem> cartItems = cartItemRepository.findByCustomer_CustomerId(customerId);

        if (cartItems.isEmpty()) {
            throw ApiException.invalidInput("Cart is empty");
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setShippingAddress(request.shippingAddress());
        order.setShippingPhone(request.shippingPhone());
        order.setStatus(OrderStatus.PENDING);

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product.getQuantity() < cartItem.getQuantity()) {
                throw ApiException.invalidInput("Not enough stock for product: " + product.getProductName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setProductName(product.getProductName());
            orderItem.setPrice(product.getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            order.getItems().add(orderItem);
            orderItem.setOrder(order);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));

            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(total);
        orderRepository.save(order);
        cartItemRepository.deleteByCustomer_CustomerId(customerId);

        return toResponse(order);
    }

    public List<OrderResponse> findByCustomer(Integer customerId) {
        return orderRepository.findByCustomer_CustomerIdOrderByOrderDateDesc(customerId)
                .stream().map(this::toResponse).toList();
    }

    public OrderResponse findByIdForCustomer(Integer customerId, Integer orderId) {
        Order order = getEntity(orderId);
        if (!order.getCustomer().getCustomerId().equals(customerId)) {
            throw ApiException.notAuthorized("This order does not belong to you");
        }
        return toResponse(order);
    }

    public List<OrderResponse> findAll() {
        return orderRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public OrderResponse updateStatus(Integer orderId, String statusValue) {
        Order order = getEntity(orderId);
        try {
            order.setStatus(OrderStatus.valueOf(statusValue.toUpperCase()));
        } catch (IllegalArgumentException ex) {
            throw ApiException.invalidInput("Invalid order status: " + statusValue);
        }
        orderRepository.save(order);
        return toResponse(order);
    }

    private Order getEntity(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> ApiException.notFound("Order not found with id " + orderId));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(i -> new OrderItemResponse(
                        i.getProduct().getProductId(), i.getProductName(), i.getPrice(), i.getQuantity(),
                        i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity()))))
                .toList();

        return new OrderResponse(
                order.getOrderId(),
                order.getCustomer().getCustomerId(),
                order.getCustomer().getFullName(),
                order.getCustomer().getEmail(),
                order.getOrderDate(),
                order.getStatus().name(),
                order.getShippingAddress(),
                order.getShippingPhone(),
                order.getTotalAmount(),
                items
        );
    }
}
