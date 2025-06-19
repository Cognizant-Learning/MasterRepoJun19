package com.example.legacyapp.service;

import java.math.BigDecimal;
import java.util.List;

import com.example.legacyapp.dto.AccountDTO;

public interface AccountService {
    AccountDTO getAccountById(String id);
    AccountDTO createAccount(AccountDTO dto);
    List<AccountDTO> getAllAccounts();

	AccountDTO creditAccount(String id, BigDecimal amount);
	AccountDTO debitAccount(String id, BigDecimal amount);

}

