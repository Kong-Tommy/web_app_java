package com.shop.inventory.service;

import com.shop.inventory.dto.auth.CustomerResponse;
import com.shop.inventory.dto.customer.CustomerProfileUpdateRequest;
import com.shop.inventory.entity.Customer;
import com.shop.inventory.exception.ApiException;
import com.shop.inventory.repository.CustomerRepository;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer getEntity(Integer customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> ApiException.notFound("Customer not found"));
    }

    public CustomerResponse getProfile(Integer customerId) {
        return toResponse(getEntity(customerId));
    }

    public CustomerResponse updateProfile(Integer customerId, CustomerProfileUpdateRequest request) {
        Customer customer = getEntity(customerId);
        customer.setFullName(request.fullName());
        customer.setPhone(request.phone());
        customer.setAddress(request.address());
        customer.setAvatarUrl(request.avatarUrl());
        return toResponse(customerRepository.save(customer));
    }

    private CustomerResponse toResponse(Customer customer) {
        return new CustomerResponse(customer.getCustomerId(), customer.getFullName(), customer.getEmail(),
                customer.getPhone(), customer.getAddress(), customer.getAvatarUrl());
    }
}
