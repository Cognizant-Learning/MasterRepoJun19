// TransactionService.java
package com.example.legacyapp.service;

import com.example.legacyapp.dto.TransactionDTO;

public interface TransactionService {
    TransactionDTO getTransactionById(Long id);
    TransactionDTO createTransaction(TransactionDTO dto);
}


