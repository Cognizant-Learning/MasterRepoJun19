package com.example.legacyapp.mapper;

import com.example.legacyapp.entity.Account;
import com.example.legacyapp.dto.AccountDTO;

public class AccountMapper {
    public static AccountDTO toDTO(Account account) {
        if (account == null) return null;
        return new AccountDTO(
            account.getId(),
            account.getAccountNumber(),
            account.getBalance()
        );
    }

    public static Account toEntity(AccountDTO dto) {
        if (dto == null) return null;
        return new Account(
            dto.getId(),
            dto.getAccountNumber(),
            dto.getBalance()
        );
    }
}

