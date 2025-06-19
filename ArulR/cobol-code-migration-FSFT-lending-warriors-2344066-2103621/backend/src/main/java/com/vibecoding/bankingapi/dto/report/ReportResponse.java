package com.vibecoding.bankingapi.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private Long id;
    private String name;
    private String description;
    private String type;
    private String reportQuery;
    private String reportParameters;
    private String templatePath;
    private String createdBy;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
