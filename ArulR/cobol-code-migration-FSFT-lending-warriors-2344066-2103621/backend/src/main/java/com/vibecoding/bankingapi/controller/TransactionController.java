package com.vibecoding.bankingapi.controller;

import com.vibecoding.bankingapi.dto.transaction.TransactionRequest;
import com.vibecoding.bankingapi.dto.transaction.TransactionResponse;
import com.vibecoding.bankingapi.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
    
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CUSTOMER_SERVICE')")
    public ResponseEntity<Page<TransactionResponse>> getAllTransactions(Pageable pageable) {
        return ResponseEntity.ok(transactionService.getAllTransactions(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CUSTOMER_SERVICE')")
    public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }
    
    @GetMapping("/number/{transactionNumber}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CUSTOMER_SERVICE')")
    public ResponseEntity<TransactionResponse> getTransactionByNumber(@PathVariable String transactionNumber) {
        return ResponseEntity.ok(transactionService.getTransactionByNumber(transactionNumber));
    }
    
    @GetMapping("/account/{accountNumber}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CUSTOMER_SERVICE')")
    public ResponseEntity<Page<TransactionResponse>> getTransactionsByAccountNumber(
            @PathVariable String accountNumber,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        return ResponseEntity.ok(transactionService.getTransactionsByAccountNumber(
                accountNumber, type, startDate, endDate, pageable));
    }
    
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CUSTOMER_SERVICE')")
    public ResponseEntity<Page<TransactionResponse>> getTransactionsByCustomerId(
            @PathVariable Long customerId,
            Pageable pageable) {
        return ResponseEntity.ok(transactionService.getTransactionsByCustomerId(customerId, pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CUSTOMER_SERVICE')")
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody TransactionRequest transactionRequest) {
        return new ResponseEntity<>(transactionService.createTransaction(transactionRequest), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<TransactionResponse> updateTransactionStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(transactionService.updateTransactionStatus(id, status));
    }
}
