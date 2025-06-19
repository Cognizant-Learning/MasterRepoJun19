// TransactionServiceImpl.java
package com.example.legacyapp.service.impl;

import com.example.legacyapp.dto.TransactionDTO;
import com.example.legacyapp.entity.Transaction;
import com.example.legacyapp.entity.Account;
import com.example.legacyapp.mapper.TransactionMapper;
import com.example.legacyapp.repository.TransactionRepository;
import com.example.legacyapp.repository.AccountRepository;
import com.example.legacyapp.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public TransactionDTO getTransactionById(Long id) {
        Optional<Transaction> transaction = transactionRepository.findById(id);
        return transaction.map(TransactionMapper::toDTO).orElse(null);
    }

    @Override
    public TransactionDTO createTransaction(TransactionDTO dto) {
        Optional<Account> accountOpt = accountRepository.findById(dto.getAccountId());
        if (accountOpt.isEmpty()) return null;
        Transaction transaction = TransactionMapper.toEntity(dto, accountOpt.get());
        Transaction saved = transactionRepository.save(transaction);
        return TransactionMapper.toDTO(saved);
    }
}


