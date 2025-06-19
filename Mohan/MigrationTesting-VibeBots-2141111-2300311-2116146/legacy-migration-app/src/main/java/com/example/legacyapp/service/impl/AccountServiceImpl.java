package com.example.legacyapp.service.impl;

import com.example.legacyapp.dto.AccountDTO;
import com.example.legacyapp.entity.Account;
import com.example.legacyapp.mapper.AccountMapper;
import com.example.legacyapp.repository.AccountRepository;
import com.example.legacyapp.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public AccountDTO getAccountById(String id) {
        Optional<Account> account = accountRepository.findById(id);
        return account.map(AccountMapper::toDTO).orElse(null);
    }

    @Override
    public AccountDTO createAccount(AccountDTO dto) {
        Account account = AccountMapper.toEntity(dto);
        Account saved = accountRepository.save(account);
        return AccountMapper.toDTO(saved);
    }
    
    @Override
    public List<AccountDTO> getAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
        return accounts.stream()
                .map(AccountMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public AccountDTO creditAccount(String id, BigDecimal amount) {
        Optional<Account> accountOpt = accountRepository.findById(id);
        if (accountOpt.isEmpty()) return null;
        Account account = accountOpt.get();
        account.setBalance(account.getBalance().add(amount));
        Account saved = accountRepository.save(account);
        return AccountMapper.toDTO(saved);
    }

    @Override
    public AccountDTO debitAccount(String id, BigDecimal amount) {
        Optional<Account> accountOpt = accountRepository.findById(id);
        if (accountOpt.isEmpty()) return null;
        Account account = accountOpt.get();
        if (account.getBalance().compareTo(amount) < 0) return null; // insufficient funds
        account.setBalance(account.getBalance().subtract(amount));
        Account saved = accountRepository.save(account);
        return AccountMapper.toDTO(saved);
    }
}

