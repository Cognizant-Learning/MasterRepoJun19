package com.vibecoding.banking.repository;

import com.vibecoding.banking.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    // This provides CRUD operations out of the box
}
