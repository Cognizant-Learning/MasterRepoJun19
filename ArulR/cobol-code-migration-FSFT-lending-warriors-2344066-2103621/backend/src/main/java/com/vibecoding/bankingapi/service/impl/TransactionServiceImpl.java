package com.vibecoding.bankingapi.service.impl;

import com.vibecoding.bankingapi.dto.transaction.TransactionRequest;
import com.vibecoding.bankingapi.dto.transaction.TransactionResponse;
import com.vibecoding.bankingapi.exception.ResourceNotFoundException;
import com.vibecoding.bankingapi.model.Account;
import com.vibecoding.bankingapi.model.Customer;
import com.vibecoding.bankingapi.model.Transaction;
import com.vibecoding.bankingapi.repository.AccountRepository;
import com.vibecoding.bankingapi.repository.CustomerRepository;
import com.vibecoding.bankingapi.repository.TransactionRepository;
import com.vibecoding.bankingapi.service.TransactionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Service
public class TransactionServiceImpl implements TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository, 
                                 AccountRepository accountRepository, 
                                 CustomerRepository customerRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public Page<TransactionResponse> getAllTransactions(Pageable pageable) {
        return transactionRepository.findAll(pageable)
                .map(this::mapToTransactionResponse);
    }

    @Override
    public TransactionResponse getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return mapToTransactionResponse(transaction);
    }

    @Override
    public TransactionResponse getTransactionByNumber(String transactionNumber) {
        Transaction transaction = transactionRepository.findByTransactionNumber(transactionNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with number: " + transactionNumber));
        return mapToTransactionResponse(transaction);
    }

    @Override
    public Page<TransactionResponse> getTransactionsByAccountNumber(String accountNumber, String type,
                                                                   LocalDate startDate, LocalDate endDate,
                                                                   Pageable pageable) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with number: " + accountNumber));
        
        if (type != null && startDate != null && endDate != null) {
            LocalDateTime startDateTime = startDate.atTime(LocalTime.MIN);
            LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
            return transactionRepository.findByAccountAndCreatedAtBetween(account, startDateTime, endDateTime, pageable)
                    .map(this::mapToTransactionResponse);
        } else if (type != null) {
            Transaction.TransactionType transactionType = Transaction.TransactionType.valueOf(type.toUpperCase());
            return transactionRepository.findByAccountAndType(account, transactionType, pageable)
                    .map(this::mapToTransactionResponse);
        } else {
            return transactionRepository.findByAccount(account, pageable)
                    .map(this::mapToTransactionResponse);
        }
    }

    @Override
    public Page<TransactionResponse> getTransactionsByCustomerId(Long customerId, Pageable pageable) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
        
        Account account = customer.getAccount();
        if (account == null) {
            throw new ResourceNotFoundException("No account found for customer with id: " + customerId);
        }
        
        return transactionRepository.findByAccount(account, pageable)
                .map(this::mapToTransactionResponse);
    }

    @Override
    @Transactional
    public TransactionResponse createTransaction(TransactionRequest transactionRequest) {
        Account account = accountRepository.findByAccountNumber(transactionRequest.getAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with number: " + transactionRequest.getAccountNumber()));
        
        Transaction.TransactionType type = Transaction.TransactionType.valueOf(transactionRequest.getType().toUpperCase());
        
        // Update account balance based on transaction type
        if (type == Transaction.TransactionType.CREDIT) {
            account.setBalance(account.getBalance().add(transactionRequest.getAmount()));
        } else if (type == Transaction.TransactionType.DEBIT) {
            if (account.getBalance().compareTo(transactionRequest.getAmount()) < 0) {
                throw new RuntimeException("Insufficient funds in account");
            }
            account.setBalance(account.getBalance().subtract(transactionRequest.getAmount()));
        }
        
        accountRepository.save(account);
        
        // Create transaction
        Transaction transaction = Transaction.builder()
                .transactionNumber(generateTransactionNumber())
                .account(account)
                .type(type)
                .amount(transactionRequest.getAmount())
                .description(transactionRequest.getDescription())
                .referenceId(transactionRequest.getReferenceId())
                .status(Transaction.TransactionStatus.COMPLETED)
                .build();
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToTransactionResponse(savedTransaction);
    }

    @Override
    @Transactional
    public TransactionResponse updateTransactionStatus(Long id, String status) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        
        Transaction.TransactionStatus transactionStatus = Transaction.TransactionStatus.valueOf(status.toUpperCase());
        
        // Handle reversal of transaction if needed
        if (transactionStatus == Transaction.TransactionStatus.REVERSED && 
                transaction.getStatus() == Transaction.TransactionStatus.COMPLETED) {
            Account account = transaction.getAccount();
            
            if (transaction.getType() == Transaction.TransactionType.CREDIT) {
                account.setBalance(account.getBalance().subtract(transaction.getAmount()));
            } else if (transaction.getType() == Transaction.TransactionType.DEBIT) {
                account.setBalance(account.getBalance().add(transaction.getAmount()));
            }
            
            accountRepository.save(account);
        }
        
        transaction.setStatus(transactionStatus);
        Transaction updatedTransaction = transactionRepository.save(transaction);
        return mapToTransactionResponse(updatedTransaction);
    }
    
    private TransactionResponse mapToTransactionResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .transactionNumber(transaction.getTransactionNumber())
                .accountNumber(transaction.getAccount().getAccountNumber())
                .type(transaction.getType().name())
                .amount(transaction.getAmount())
                .description(transaction.getDescription())
                .referenceId(transaction.getReferenceId())
                .status(transaction.getStatus().name())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }
    
    private String generateTransactionNumber() {
        return "TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
