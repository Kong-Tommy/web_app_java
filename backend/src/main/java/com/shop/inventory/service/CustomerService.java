package com.shop.inventory.service;

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
}
