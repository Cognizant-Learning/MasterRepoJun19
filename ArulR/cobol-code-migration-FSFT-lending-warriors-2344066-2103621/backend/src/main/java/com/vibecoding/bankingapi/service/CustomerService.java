package com.vibecoding.bankingapi.service;

import com.vibecoding.bankingapi.dto.customer.CustomerRequest;
import com.vibecoding.bankingapi.dto.customer.CustomerResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerService {
    
    Page<CustomerResponse> getAllCustomers(Pageable pageable);
    
    CustomerResponse getCustomerById(Long id);
    
    CustomerResponse getCustomerByNumber(String customerNumber);
    
    CustomerResponse createCustomer(CustomerRequest customerRequest);
    
    CustomerResponse updateCustomer(Long id, CustomerRequest customerRequest);
    
    void deleteCustomer(Long id);
}
