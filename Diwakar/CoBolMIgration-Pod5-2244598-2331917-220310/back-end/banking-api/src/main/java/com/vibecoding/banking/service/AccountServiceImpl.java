package com.vibecoding.banking.service;

import com.vibecoding.banking.dto.AccountResponse;
import com.vibecoding.banking.dto.TransactionRequest;
import com.vibecoding.banking.exception.InsufficientFundsException;
import com.vibecoding.banking.model.Account;
import com.vibecoding.banking.repository.AccountRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    
    @Autowired
    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }
    
    @PostConstruct
    public void init() {
        // Check if there's already an account, if not create one with default balance
        if (accountRepository.count() == 0) {
            initializeDefaultAccount();
        }
    }
    
    @Override
    public Account initializeDefaultAccount() {
        Account defaultAccount = new Account();
        return accountRepository.save(defaultAccount);
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponse getAccountBalance(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        return AccountResponse.builder()
                .id(account.getId())
                .balance(account.getBalance())
                .message("Current balance: " + account.getBalance())
                .build();
    }

    @Override
    @Transactional
    public AccountResponse creditAccount(Long accountId, TransactionRequest request) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        account.setBalance(account.getBalance().add(request.getAmount()));
        Account updatedAccount = accountRepository.save(account);
        
        return AccountResponse.builder()
                .id(updatedAccount.getId())
                .balance(updatedAccount.getBalance())
                .message("Amount credited. New balance: " + updatedAccount.getBalance())
                .build();
    }

    @Override
    @Transactional
    public AccountResponse debitAccount(Long accountId, TransactionRequest request) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientFundsException("Insufficient funds for this debit.");
        }
        
        account.setBalance(account.getBalance().subtract(request.getAmount()));
        Account updatedAccount = accountRepository.save(account);
        
        return AccountResponse.builder()
                .id(updatedAccount.getId())
                .balance(updatedAccount.getBalance())
                .message("Amount debited. New balance: " + updatedAccount.getBalance())
                .build();
    }
}
