package com.shop.inventory.repository;

import com.shop.inventory.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByCustomer_CustomerIdOrderByOrderDateDesc(Integer customerId);
}
