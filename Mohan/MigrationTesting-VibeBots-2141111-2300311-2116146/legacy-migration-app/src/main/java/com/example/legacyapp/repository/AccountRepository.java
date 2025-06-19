
 package com.example.legacyapp.repository;

 import com.example.legacyapp.entity.Account;
 import org.springframework.data.jpa.repository.JpaRepository;

 public interface AccountRepository extends JpaRepository<Account, String> {
 }

