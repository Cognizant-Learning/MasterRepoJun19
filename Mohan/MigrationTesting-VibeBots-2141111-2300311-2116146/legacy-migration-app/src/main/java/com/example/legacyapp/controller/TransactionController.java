package com.example.legacyapp.controller;

import com.example.legacyapp.dto.TransactionDTO;
import com.example.legacyapp.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransactionById(@PathVariable Long id) {
        TransactionDTO transaction = transactionService.getTransactionById(id);
        if (transaction == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(transaction);
    }

    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(@RequestBody TransactionDTO dto) {
        TransactionDTO created = transactionService.createTransaction(dto);
        if (created == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.status(201).body(created);
    }
}

