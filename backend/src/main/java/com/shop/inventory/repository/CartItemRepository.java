package com.shop.inventory.repository;

import com.shop.inventory.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCustomer_CustomerId(Integer customerId);
    Optional<CartItem> findByCustomer_CustomerIdAndProduct_ProductId(Integer customerId, Integer productId);
    void deleteByCustomer_CustomerId(Integer customerId);
}
