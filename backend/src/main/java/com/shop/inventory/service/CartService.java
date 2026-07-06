package com.shop.inventory.service;

import com.shop.inventory.dto.cart.CartItemRequest;
import com.shop.inventory.dto.cart.CartItemResponse;
import com.shop.inventory.dto.cart.CartResponse;
import com.shop.inventory.dto.category.CategoryResponse;
import com.shop.inventory.dto.product.ProductResponse;
import com.shop.inventory.entity.CartItem;
import com.shop.inventory.entity.Customer;
import com.shop.inventory.entity.Product;
import com.shop.inventory.exception.ApiException;
import com.shop.inventory.repository.CartItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductService productService;
    private final CustomerService customerService;

    public CartService(CartItemRepository cartItemRepository, ProductService productService, CustomerService customerService) {
        this.cartItemRepository = cartItemRepository;
        this.productService = productService;
        this.customerService = customerService;
    }

    public CartResponse getCart(Integer customerId) {
        List<CartItem> items = cartItemRepository.findByCustomer_CustomerId(customerId);
        return toCartResponse(items);
    }

    public CartResponse addItem(Integer customerId, CartItemRequest request) {
        Customer customer = customerService.getEntity(customerId);
        Product product = productService.getEntity(request.productId());

        CartItem item = cartItemRepository
                .findByCustomer_CustomerIdAndProduct_ProductId(customerId, request.productId())
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setCustomer(customer);
                    newItem.setProduct(product);
                    newItem.setQuantity(0);
                    return newItem;
                });

        item.setQuantity(item.getQuantity() + request.quantity());
        cartItemRepository.save(item);

        return getCart(customerId);
    }

    public CartResponse updateItem(Integer customerId, Integer cartItemId, CartItemRequest request) {
        CartItem item = getOwnedCartItem(customerId, cartItemId);
        item.setQuantity(request.quantity());
        cartItemRepository.save(item);
        return getCart(customerId);
    }

    public CartResponse removeItem(Integer customerId, Integer cartItemId) {
        CartItem item = getOwnedCartItem(customerId, cartItemId);
        cartItemRepository.delete(item);
        return getCart(customerId);
    }

    private CartItem getOwnedCartItem(Integer customerId, Integer cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> ApiException.notFound("Cart item not found"));
        if (!item.getCustomer().getCustomerId().equals(customerId)) {
            throw ApiException.notAuthorized("This cart item does not belong to you");
        }
        return item;
    }

    private CartResponse toCartResponse(List<CartItem> items) {
        BigDecimal total = BigDecimal.ZERO;
        List<CartItemResponse> responses = new java.util.ArrayList<>();

        for (CartItem item : items) {
            Product p = item.getProduct();
            BigDecimal lineTotal = p.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(lineTotal);

            CategoryResponse categoryResponse = p.getCategory() == null ? null : new CategoryResponse(
                    p.getCategory().getCategoryId(), p.getCategory().getCategoryName(), p.getCategory().getDescription());

            ProductResponse productResponse = new ProductResponse(
                    p.getProductId(), p.getProductName(), p.getMaterial(), p.getPrice(),
                    p.getQuantity(), p.getReleaseDate(), p.getImageUrl(), categoryResponse);

            responses.add(new CartItemResponse(item.getCartItemId(), productResponse, item.getQuantity(), lineTotal));
        }

        return new CartResponse(responses, total);
    }
}
