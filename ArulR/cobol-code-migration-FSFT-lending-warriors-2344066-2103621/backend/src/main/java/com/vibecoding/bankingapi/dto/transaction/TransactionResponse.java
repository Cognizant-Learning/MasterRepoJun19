package com.vibecoding.bankingapi.dto.transaction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private String transactionNumber;
    private String accountNumber;
    private String type;
    private BigDecimal amount;
    private String description;
    private String referenceId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
