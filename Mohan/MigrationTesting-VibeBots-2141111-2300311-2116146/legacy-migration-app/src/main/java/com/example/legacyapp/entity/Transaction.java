package com.example.legacyapp.entity;

import java.math.BigDecimal;
import jakarta.persistence.*;

@Entity
@Table(name = "transaction")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long t_id;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String type; // "CREDIT" or "DEBIT"

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    public Transaction() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Transaction(Long t_id, BigDecimal amount, String type, Account account) {
		super();
		this.t_id = t_id;
		this.amount = amount;
		this.type = type;
		this.account = account;
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

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }
}
