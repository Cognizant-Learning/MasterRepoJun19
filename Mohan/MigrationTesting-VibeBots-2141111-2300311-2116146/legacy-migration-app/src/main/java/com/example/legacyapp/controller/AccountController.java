package com.example.legacyapp.controller;

import com.example.legacyapp.dto.AccountDTO;
import com.example.legacyapp.service.AccountService;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*") // Allow all origins for CORS
@RestController
@RequestMapping("/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping("/{id}")
    public ResponseEntity<AccountDTO> getAccountById(@PathVariable String id) {
        AccountDTO account = accountService.getAccountById(id);
        if (account == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(account);
    }

    @PostMapping
    public ResponseEntity<AccountDTO> createAccount(@RequestBody AccountDTO dto) {
        AccountDTO created = accountService.createAccount(dto);
        return ResponseEntity.status(201).body(created);
    }
    
    @GetMapping
    public ResponseEntity<List<AccountDTO>> getAllAccounts() {
        List<AccountDTO> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }
    
    @PostMapping("/{id}/credit")
    public ResponseEntity<AccountDTO> creditAccount(@PathVariable String id, @RequestParam BigDecimal amount) {
        AccountDTO updated = accountService.creditAccount(id, amount);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/debit")
    public ResponseEntity<AccountDTO> debitAccount(@PathVariable String id, @RequestParam BigDecimal amount) {
        AccountDTO updated = accountService.debitAccount(id, amount);
        if (updated == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(updated);
    }
}


