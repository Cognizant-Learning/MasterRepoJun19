package com.vibecoding.bankingapi.repository;

import com.vibecoding.bankingapi.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByCustomerNumber(String customerNumber);
    Optional<Customer> findByEmail(String email);
    List<Customer> findByLastNameContainingIgnoreCase(String lastName);
    boolean existsByEmail(String email);
    boolean existsByCustomerNumber(String customerNumber);
}
