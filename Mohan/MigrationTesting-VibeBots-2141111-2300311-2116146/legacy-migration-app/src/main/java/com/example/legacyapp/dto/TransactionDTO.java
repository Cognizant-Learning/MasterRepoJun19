package com.example.legacyapp.dto;

import java.math.BigDecimal;

public class TransactionDTO {
    private Long t_id;
    private BigDecimal amount;
    private String type;
    private String accountId;

    public TransactionDTO() {}

    public TransactionDTO(Long t_id, BigDecimal amount, String type, String accountId) {
        this.t_id = t_id;
        this.amount = amount;
        this.type = type;
        this.accountId = accountId;
    }

    public Long getT_id() {
        return t_id;
    }

    public void setT_id(Long t_id) {
        this.t_id = t_id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }
}


