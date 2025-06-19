package com.vibecoding.banking.controller;

import com.vibecoding.banking.dto.AccountResponse;
import com.vibecoding.banking.dto.TransactionRequest;
import com.vibecoding.banking.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:3000") // Enable CORS for React frontend
public class AccountController {

    private final AccountService accountService;
    
    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }
    
    @GetMapping("/{accountId}")
    public ResponseEntity<AccountResponse> getAccountBalance(@PathVariable Long accountId) {
        return ResponseEntity.ok(accountService.getAccountBalance(accountId));
    }
    
    @PostMapping("/{accountId}/credit")
    public ResponseEntity<AccountResponse> creditAccount(
            @PathVariable Long accountId,
            @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(accountService.creditAccount(accountId, request));
    }
    
    @PostMapping("/{accountId}/debit")
    public ResponseEntity<AccountResponse> debitAccount(
            @PathVariable Long accountId,
            @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(accountService.debitAccount(accountId, request));
    }
    
    @PostMapping("/initialize")
    public ResponseEntity<AccountResponse> initializeAccount() {
        var account = accountService.initializeDefaultAccount();
        return ResponseEntity.ok(
            AccountResponse.builder()
                .id(account.getId())
                .balance(account.getBalance())
                .message("Account initialized with balance: " + account.getBalance())
                .build()
        );
    }
}
