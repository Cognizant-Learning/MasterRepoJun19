// TransactionMapper.java
package com.example.legacyapp.mapper;

import com.example.legacyapp.entity.Transaction;
import com.example.legacyapp.entity.Account;
import com.example.legacyapp.dto.TransactionDTO;

public class TransactionMapper {
    public static TransactionDTO toDTO(Transaction transaction) {
        if (transaction == null) return null;
        return new TransactionDTO(
            transaction.getT_id(),
            transaction.getAmount(),
            transaction.getType(),
            transaction.getAccount() != null ? transaction.getAccount().getId() : null
        );
    }

    public static Transaction toEntity(TransactionDTO dto, Account account) {
        if (dto == null || account == null) return null;
        return new Transaction(
            dto.getT_id(),
            dto.getAmount(),
            dto.getType(),
            account
        );
    }
}



