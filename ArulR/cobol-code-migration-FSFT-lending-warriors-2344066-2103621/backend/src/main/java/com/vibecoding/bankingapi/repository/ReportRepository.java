package com.vibecoding.bankingapi.repository;

import com.vibecoding.bankingapi.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByType(Report.ReportType type);
    List<Report> findByNameContainingIgnoreCase(String name);
    List<Report> findByActive(boolean active);
}
