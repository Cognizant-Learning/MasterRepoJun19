package com.vibecoding.bankingapi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType type;

    @Column(name = "report_query", columnDefinition = "TEXT")
    private String reportQuery;

    @Column(name = "report_parameters", columnDefinition = "TEXT")
    private String reportParameters;

    @Column(name = "template_path")
    private String templatePath;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(nullable = false)
    private boolean active = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ReportType {
        CUSTOMER,
        TRANSACTION,
        ACCOUNT,
        SUMMARY,
        CUSTOM
    }
}
