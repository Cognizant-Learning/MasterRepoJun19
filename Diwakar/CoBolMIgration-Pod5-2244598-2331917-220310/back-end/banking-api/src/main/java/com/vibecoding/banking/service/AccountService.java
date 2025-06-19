package com.vibecoding.banking.service;

import com.vibecoding.banking.dto.AccountResponse;
import com.vibecoding.banking.dto.TransactionRequest;
import com.vibecoding.banking.model.Account;

import java.math.BigDecimal;

public interface AccountService {
    AccountResponse getAccountBalance(Long accountId);
    AccountResponse creditAccount(Long accountId, TransactionRequest request);
    AccountResponse debitAccount(Long accountId, TransactionRequest request);
    Account initializeDefaultAccount();
}
