package com.vibecoding.bankingapi.service.impl;

import com.vibecoding.bankingapi.dto.report.ReportRequest;
import com.vibecoding.bankingapi.dto.report.ReportResponse;
import com.vibecoding.bankingapi.exception.ResourceNotFoundException;
import com.vibecoding.bankingapi.model.Report;
import com.vibecoding.bankingapi.model.User;
import com.vibecoding.bankingapi.repository.ReportRepository;
import com.vibecoding.bankingapi.repository.UserRepository;
import com.vibecoding.bankingapi.security.services.UserDetailsImpl;
import com.vibecoding.bankingapi.service.ReportService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {
    
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public ReportServiceImpl(ReportRepository reportRepository, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<ReportResponse> getAllReports() {
        return reportRepository.findByActive(true)
                .stream()
                .map(this::mapToReportResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReportResponse> getReportsByType(String type) {
        Report.ReportType reportType = Report.ReportType.valueOf(type.toUpperCase());
        return reportRepository.findByType(reportType)
                .stream()
                .map(this::mapToReportResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ReportResponse getReportById(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));
        return mapToReportResponse(report);
    }

    @Override
    @Transactional
    public ReportResponse createReport(ReportRequest reportRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userDetails.getId()));
        
        Report report = Report.builder()
                .name(reportRequest.getName())
                .description(reportRequest.getDescription())
                .type(Report.ReportType.valueOf(reportRequest.getType().toUpperCase()))
                .reportQuery(reportRequest.getReportQuery())
                .reportParameters(reportRequest.getReportParameters())
                .templatePath(reportRequest.getTemplatePath())
                .createdBy(user)
                .build();
        
        Report savedReport = reportRepository.save(report);
        return mapToReportResponse(savedReport);
    }

    @Override
    @Transactional
    public ReportResponse generateCustomReport(ReportRequest reportRequest) {
        // This would normally involve executing the query and storing the results
        // For this implementation, we'll just create a new report definition
        
        return createReport(reportRequest);
    }

    @Override
    public Resource exportReport(Long id, String format, Map<String, String> parameters) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));
        
        // In a real implementation, this would generate the report in the requested format
        // For this implementation, we'll just create a simple placeholder
        
        String content = String.format(
                "Report: %s\nDescription: %s\nType: %s\nFormat: %s\n\n",
                report.getName(), 
                report.getDescription(),
                report.getType(),
                format.toUpperCase()
        );
        
        if (parameters != null && !parameters.isEmpty()) {
            content += "Parameters:\n";
            for (Map.Entry<String, String> entry : parameters.entrySet()) {
                content += String.format("- %s: %s\n", entry.getKey(), entry.getValue());
            }
        }
        
        return new ByteArrayResource(content.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public void writeReportToResponse(Resource resource, String format, HttpServletResponse response) throws IOException {
        response.setContentType(getContentType(format));
        response.setHeader("Content-Disposition", "attachment; filename=report." + format.toLowerCase());
        
        try (OutputStream outputStream = response.getOutputStream()) {
            outputStream.write(((ByteArrayResource) resource).getByteArray());
            outputStream.flush();
        }
    }
    
    private ReportResponse mapToReportResponse(Report report) {
        String createdBy = null;
        if (report.getCreatedBy() != null) {
            createdBy = report.getCreatedBy().getUsername();
        }
        
        return ReportResponse.builder()
                .id(report.getId())
                .name(report.getName())
                .description(report.getDescription())
                .type(report.getType().name())
                .reportQuery(report.getReportQuery())
                .reportParameters(report.getReportParameters())
                .templatePath(report.getTemplatePath())
                .createdBy(createdBy)
                .active(report.isActive())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build();
    }
    
    private String getContentType(String format) {
        return switch (format.toLowerCase()) {
            case "pdf" -> "application/pdf";
            case "xlsx" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "csv" -> "text/csv";
            default -> "text/plain";
        };
    }
}
