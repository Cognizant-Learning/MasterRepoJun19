package com.example.legacyapp.dto;

import java.math.BigDecimal;

public class AccountDTO {
    private String id;
    private String accountNumber;
    private BigDecimal balance;

    public AccountDTO() {}

    public AccountDTO(String id, String accountNumber, BigDecimal balance) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
}


