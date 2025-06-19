package com.vibecoding.bankingapi.service.impl;

import com.vibecoding.bankingapi.dto.account.AccountResponse;
import com.vibecoding.bankingapi.dto.customer.CustomerRequest;
import com.vibecoding.bankingapi.dto.customer.CustomerResponse;
import com.vibecoding.bankingapi.exception.ResourceNotFoundException;
import com.vibecoding.bankingapi.model.Account;
import com.vibecoding.bankingapi.model.Customer;
import com.vibecoding.bankingapi.repository.AccountRepository;
import com.vibecoding.bankingapi.repository.CustomerRepository;
import com.vibecoding.bankingapi.service.CustomerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class CustomerServiceImpl implements CustomerService {
    
    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository, AccountRepository accountRepository) {
        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    public Page<CustomerResponse> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable)
                .map(this::mapToCustomerResponse);
    }

    @Override
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return mapToCustomerResponse(customer);
    }

    @Override
    public CustomerResponse getCustomerByNumber(String customerNumber) {
        Customer customer = customerRepository.findByCustomerNumber(customerNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with number: " + customerNumber));
        return mapToCustomerResponse(customer);
    }

    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerRequest customerRequest) {
        // Create account first
        Account account = Account.builder()
                .accountNumber(generateAccountNumber())
                .type(Account.AccountType.valueOf(customerRequest.getAccountType().toUpperCase()))
                .balance(BigDecimal.valueOf(customerRequest.getInitialDeposit()))
                .build();
        
        accountRepository.save(account);
        
        // Create customer with the account
        Customer customer = Customer.builder()
                .customerNumber(generateCustomerNumber())
                .firstName(customerRequest.getFirstName())
                .lastName(customerRequest.getLastName())
                .email(customerRequest.getEmail())
                .phone(customerRequest.getPhone())
                .dateOfBirth(customerRequest.getDateOfBirth())
                .addressLine1(customerRequest.getAddressLine1())
                .addressLine2(customerRequest.getAddressLine2())
                .city(customerRequest.getCity())
                .state(customerRequest.getState())
                .postalCode(customerRequest.getPostalCode())
                .country(customerRequest.getCountry())
                .account(account)
                .build();
        
        Customer savedCustomer = customerRepository.save(customer);
        return mapToCustomerResponse(savedCustomer);
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerRequest customerRequest) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        
        customer.setFirstName(customerRequest.getFirstName());
        customer.setLastName(customerRequest.getLastName());
        customer.setEmail(customerRequest.getEmail());
        customer.setPhone(customerRequest.getPhone());
        customer.setDateOfBirth(customerRequest.getDateOfBirth());
        customer.setAddressLine1(customerRequest.getAddressLine1());
        customer.setAddressLine2(customerRequest.getAddressLine2());
        customer.setCity(customerRequest.getCity());
        customer.setState(customerRequest.getState());
        customer.setPostalCode(customerRequest.getPostalCode());
        customer.setCountry(customerRequest.getCountry());
        
        Customer updatedCustomer = customerRepository.save(customer);
        return mapToCustomerResponse(updatedCustomer);
    }

    @Override
    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        
        customer.setActive(false);
        customerRepository.save(customer);
    }
    
    private CustomerResponse mapToCustomerResponse(Customer customer) {
        AccountResponse accountResponse = null;
        
        if (customer.getAccount() != null) {
            Account account = customer.getAccount();
            accountResponse = AccountResponse.builder()
                    .id(account.getId())
                    .accountNumber(account.getAccountNumber())
                    .type(account.getType().name())
                    .balance(account.getBalance())
                    .active(account.isActive())
                    .createdAt(account.getCreatedAt())
                    .updatedAt(account.getUpdatedAt())
                    .build();
        }
        
        return CustomerResponse.builder()
                .id(customer.getId())
                .customerNumber(customer.getCustomerNumber())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .dateOfBirth(customer.getDateOfBirth())
                .addressLine1(customer.getAddressLine1())
                .addressLine2(customer.getAddressLine2())
                .city(customer.getCity())
                .state(customer.getState())
                .postalCode(customer.getPostalCode())
                .country(customer.getCountry())
                .account(accountResponse)
                .active(customer.isActive())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }
    
    private String generateCustomerNumber() {
        return "CUST" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private String generateAccountNumber() {
        return "ACC" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
