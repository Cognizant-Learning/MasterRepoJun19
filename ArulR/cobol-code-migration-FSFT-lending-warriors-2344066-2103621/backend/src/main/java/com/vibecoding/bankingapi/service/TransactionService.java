package com.vibecoding.bankingapi.service;

import com.vibecoding.bankingapi.dto.transaction.TransactionRequest;
import com.vibecoding.bankingapi.dto.transaction.TransactionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface TransactionService {
    
    Page<TransactionResponse> getAllTransactions(Pageable pageable);
    
    TransactionResponse getTransactionById(Long id);
    
    TransactionResponse getTransactionByNumber(String transactionNumber);
    
    Page<TransactionResponse> getTransactionsByAccountNumber(String accountNumber, String type,
                                                            LocalDate startDate, LocalDate endDate, 
                                                            Pageable pageable);
    
    Page<TransactionResponse> getTransactionsByCustomerId(Long customerId, Pageable pageable);
    
    TransactionResponse createTransaction(TransactionRequest transactionRequest);
    
    TransactionResponse updateTransactionStatus(Long id, String status);
}
