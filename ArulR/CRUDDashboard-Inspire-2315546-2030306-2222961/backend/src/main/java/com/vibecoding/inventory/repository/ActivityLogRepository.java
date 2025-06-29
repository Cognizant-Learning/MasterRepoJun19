package com.vibecoding.inventory.repository;

import com.vibecoding.inventory.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByOrderByTimestampDesc(Pageable pageable);
}
