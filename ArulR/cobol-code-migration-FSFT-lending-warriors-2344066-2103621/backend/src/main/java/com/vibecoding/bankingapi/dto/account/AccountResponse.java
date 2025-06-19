package com.vibecoding.bankingapi.dto.account;

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
public class AccountResponse {
    private Long id;
    private String accountNumber;
    private String type;
    private BigDecimal balance;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
