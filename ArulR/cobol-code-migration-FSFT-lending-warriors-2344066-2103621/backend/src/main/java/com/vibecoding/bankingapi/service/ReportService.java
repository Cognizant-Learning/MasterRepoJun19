package com.vibecoding.bankingapi.service;

import com.vibecoding.bankingapi.dto.report.ReportRequest;
import com.vibecoding.bankingapi.dto.report.ReportResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface ReportService {
    
    List<ReportResponse> getAllReports();
    
    List<ReportResponse> getReportsByType(String type);
    
    ReportResponse getReportById(Long id);
    
    ReportResponse createReport(ReportRequest reportRequest);
    
    ReportResponse generateCustomReport(ReportRequest reportRequest);
    
    Resource exportReport(Long id, String format, Map<String, String> parameters);
    
    void writeReportToResponse(Resource resource, String format, HttpServletResponse response) throws IOException;
}
