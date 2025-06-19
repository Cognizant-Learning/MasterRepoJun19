package com.vibecoding.bankingapi.controller;

import com.vibecoding.bankingapi.dto.report.ReportRequest;
import com.vibecoding.bankingapi.dto.report.ReportResponse;
import com.vibecoding.bankingapi.service.ReportService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reports")
public class ReportController {
    
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CUSTOMER_SERVICE')")
    public ResponseEntity<List<ReportResponse>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }
    
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CUSTOMER_SERVICE')")
    public ResponseEntity<List<ReportResponse>> getReportsByType(@PathVariable String type) {
        return ResponseEntity.ok(reportService.getReportsByType(type));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CUSTOMER_SERVICE')")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getReportById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ReportResponse> createReport(@Valid @RequestBody ReportRequest reportRequest) {
        return new ResponseEntity<>(reportService.createReport(reportRequest), HttpStatus.CREATED);
    }
    
    @PostMapping("/custom")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ReportResponse> generateCustomReport(@Valid @RequestBody ReportRequest reportRequest) {
        return ResponseEntity.ok(reportService.generateCustomReport(reportRequest));
    }

    @GetMapping("/export/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CUSTOMER_SERVICE')")
    public void exportReport(
            @PathVariable Long id,
            @RequestParam String format,
            @RequestParam(required = false) Map<String, String> parameters,
            HttpServletResponse response) throws IOException {
        Resource resource = reportService.exportReport(id, format, parameters);
        reportService.writeReportToResponse(resource, format, response);
    }
}
