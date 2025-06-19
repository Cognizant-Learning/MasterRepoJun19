package com.vibecoding.bankingapi.repository;

import com.vibecoding.bankingapi.model.Account;
import com.vibecoding.bankingapi.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByTransactionNumber(String transactionNumber);
    List<Transaction> findByAccount(Account account);
    Page<Transaction> findByAccount(Account account, Pageable pageable);
    Page<Transaction> findByAccountAndCreatedAtBetween(Account account, LocalDateTime start, LocalDateTime end, Pageable pageable);
    Page<Transaction> findByAccountAndType(Account account, Transaction.TransactionType type, Pageable pageable);
}
