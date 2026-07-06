package com.shop.inventory.repository;

import com.shop.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("SELECT p FROM Product p WHERE " +
           "(:name IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:categoryId IS NULL OR p.category.categoryId = :categoryId) " +
           "ORDER BY p.category.categoryId, p.productName")
    List<Product> search(@Param("name") String name, @Param("categoryId") Integer categoryId);
}
